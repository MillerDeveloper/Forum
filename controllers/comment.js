const moment = require('moment')
const Comment = require('../models/Comment')
const Company = require('../models/Company')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const ObjectId = require('mongoose').Types.ObjectId
const mainIps = [''] // Company Ips here (for dev)

module.exports.getComments = async (req, res) => {
     try {
          if (ObjectId.isValid(req.params.id)) {
               const sortParams = new Object({
                    idCompany: req.params.id,
                    hidden: {
                         $ne: true
                    },
                    approved: true
               })

               var comments = await Comment
                    .find(sortParams)
                    .sort({ date: -1 })
                    .limit(req.query['limit'] ? +req.query['limit'] : 0)
                    .skip(+req.query['skip'] || 0)

               console.log(comments.length);

               const mutatedComments = mutateComments(comments, 'fetch', 'fetch').comments

               res.status(200).json(mutatedComments)
          } else {
               res.status(500)
          }
     } catch (error) {
          errorHandler(res, error)
     } finally {

     }
}

module.exports.getComment = async (req, res) => {
     try {
          if (ObjectId.isValid(req.params.id)) {
               const comment = await Comment.findById(req.params.id)
               res.status(200).json(comment)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}


module.exports.createComment = async (req, res) => {
     try {
          if (
               ObjectId.isValid(req.body.idCompany) &&
               req.body.name &&
               req.body.text &&
               req.body.name.length > 0 && req.body.name.length < 100 &&
               req.body.text.length > 0 && req.body.text.length < 5000
          ) {
               if (ObjectId.isValid(req.body.idUser)) {
                    var candidate = await User.findById(req.body.idUser).select({ password: false }) || null
               }

               if (req.body.dateComment && ObjectId.isValid(req.body.idUser) && candidate) {
                    var dateComment = new Date(req.body.dateComment)
               } else {
                    var dateComment = new Date()
               }

               const company = await Company.findById({ _id: req.body.idCompany })

               if (req.body.replyFor && ObjectId.isValid(req.body.replyFor)) {
                    var replyComment = new Comment({
                         text: req.body.text,
                         isAnonymous: true,
                         nameUser: req.body.name,
                         pickedRating: req.body.pickedRating,
                         replyForName: req.body.replyForName,
                         date: dateComment,
                         userData: {
                              browser: req.headers["user-agent"],
                              language: req.headers["accept-language"],
                              ip: req.clientIp
                         },
                         user: candidate || null
                    })

                    if (req.body.rootComment && ObjectId.isValid(req.body.rootComment._id)) {
                         if (req.body.replyFor === req.body.rootComment._id) {
                              await Comment.updateOne(
                                   { _id: req.body.rootComment._id },
                                   {
                                        $push: {
                                             replies: replyComment
                                        }
                                   }
                              )
                         } else {
                              const changedReplies = findAndPushComment(req.body.rootComment.replies, req.body.replyFor, replyComment)
                              if (changedReplies) {
                                   req.body.rootComment.replies = changedReplies
                                   await Comment.updateOne(
                                        { _id: req.body.rootComment._id },
                                        { $set: req.body.rootComment }
                                   )
                              }
                         }

                         const pickedRating = replyComment.pickedRating || 1
                         var calculatedRating = (pickedRating + company.rating)

                         const update = {
                              $set: {
                                   rating: calculatedRating
                              },
                              $push: {
                                   comments: replyComment._id
                              }
                         }

                         res.status(204).json(null)
                    }
               } else {
                    var newComment = new Comment({
                         text: req.body.text,
                         isAnonymous: true,
                         nameUser: req.body.name,
                         idCompany: req.body.idCompany,
                         root: true,
                         pickedRating: req.body.pickedRating,
                         replyForName: null,
                         date: dateComment,
                         userData: {
                              browser: req.headers["user-agent"],
                              language: req.headers["accept-language"],
                              ip: req.clientIp
                         },
                         user: candidate || null
                    })

                    await newComment.save()
                    res.status(201).json(newComment)

                    const pickedRating = newComment.pickedRating || replyComment.pickedRating || 1
                    var calculatedRating = (pickedRating + company.rating)

                    const update = {
                         $set: {
                              rating: calculatedRating
                         },
                         $push: {
                              comments: newComment._id || replyComment._id
                         }
                    }

                    await Company.updateOne(
                         { _id: req.body.idCompany },
                         update
                    )
               }
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

function findAndPushComment(comments, searchingId, repliedComment) {
     comments.forEach(comment => {
          if (comment._id == searchingId) {
               comment.replies.push(repliedComment)
          } else if (comment.replies && comment.replies.length > 0) {
               findAndPushComment(comment.replies, searchingId, repliedComment)
          }
     })

     return comments
}

module.exports.updateComment = async (req, res) => {
     try {
          if (
               req.user.rules.admin &&
               req.user.rules.canEditComments &&
               ObjectId.isValid(req.body.comment._id)
          ) {
               const rootComment = await Comment.findById(req.body.rootComment._id)

               if (rootComment) {
                    if (req.body.rootComment._id === req.body.comment._id) {
                         await Comment.updateOne(
                              { _id: req.body.rootComment._id },
                              { $set: req.body.rootComment }
                         )

                         const currentCompany = await Company.findById({ _id: req.body.rootComment.idCompany._id })
                         // console.log( currentCompany.rating, req.body.comment.oldRating, req.body.comment.pickedRating);

                         if (currentCompany) {
                              var currentRating = currentCompany.rating || 0
                              currentRating -= req.body.rootComment.oldRating || 0
                              currentRating += req.body.rootComment.pickedRating || 0
                         }

                         await Company.updateOne(
                              { _id: req.body.rootComment.idCompany },
                              {
                                   $set: {
                                        rating: currentRating
                                   }
                              }
                         )

                         res.status(201).json(null)
                    } else {
                         if (req.body.rootComment.replies.length > 0) {
                              const searchingId = req.body.comment._id || req.body.rootComment._id
                              const changedReplies = mutateComments(req.body.rootComment.replies, searchingId, 'update', req.body.comment, 0)

                              if (changedReplies) {
                                   req.body.rootComment.replies = changedReplies.comments
                                   await Comment.updateOne(
                                        { _id: req.body.rootComment._id },
                                        { $set: req.body.rootComment }
                                   )

                                   const currentCompany = await Company.findById({ _id: req.body.rootComment.idCompany })

                                   if (currentCompany) {
                                        // console.log( currentCompany.rating, req.body.comment.oldRating, req.body.comment.pickedRating);

                                        var currentRating = currentCompany.rating || 0
                                        currentRating -= req.body.comment.oldRating || 0
                                        currentRating += req.body.comment.pickedRating || 0

                                        await Company.updateOne(
                                             { _id: req.body.rootComment.idCompany },
                                             {
                                                  $set: {
                                                       rating: currentRating
                                                  }
                                             }
                                        )
                                   }

                                   res.status(201).json(null)
                              } else {
                                   res.status(500).json('Произошла ошибка')
                              }
                         }
                    }
               } else {
                    res.status(404).json('Комментарий не найден')
               }
          } else {
               res.status(400).json('Не валидны данные')
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

module.exports.hideComment = async (req, res) => {
     try {
          if (req.user.rules.canEditComments && req.user.companies.includes(req.body.rootComment.idCompany)) {
               const company = await Company.findById({ _id: req.body.rootComment.idCompany })
               if (req.body.rootComment._id === req.body.comment._id) {
                    const newRating = company.rating - req.body.rootComment.pickedRating

                    const update = {
                         $set: {
                              rating: newRating
                         },
                         $push: {
                              hiddenComments: req.body.rootComment._id
                         },
                         $pull: {
                              comments: req.body.rootComment._id
                         }
                    }

                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   hidden: true
                              }
                         }
                    )

                    await Company.updateOne(
                         { _id: company._id },
                         update
                    )
               } else {
                    const changedReplies = mutateComments(req.body.rootComment.replies, req.body.comment._id, 'hide')
                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   replies: changedReplies.comments
                              }
                         }
                    )
               }

               res.status(200).json(null)
          } else {
               res.status(400).json(null)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

let finndedComment = null

function mutateComments(comments, searchingId, caseValue, value) {
     comments.forEach((comment, index) => {
          if (comment._id == searchingId || searchingId === 'fetch' || searchingId === 'verificate') {
               finndedComment = comment
               switch (caseValue) {
                    case 'hide': {
                         comment.hidden = true
                         break
                    }
                    case 'fetch': {
                         if (comment.hidden) {
                              comments.splice(index, 1)
                         } else if (comment.userData && comment.userData.ip) {
                              const findedComments = comments.filter(cmmnt => cmmnt.userData.ip === comment.userData.ip)

                              if (
                                   // idx !== -1 && 
                                   findedComments.length >= 2 &&
                                   comment.isNotFirstUserComment &&
                                   mainIps.includes(comment.userData.ip.trim())
                              ) {
                                   comment.isNotFirstUserComment = false
                              } else if (
                                   // idx !== -1 && 
                                   findedComments.length >= 2 &&
                                   comments.length > 1 &&
                                   !mainIps.includes(comment.userData.ip.trim())
                              ) {
                                   if (!comment.isNotFirstUserComment) {
                                        comment.isNotFirstUserComment = true
                                        // await Comment.updateMany(
                                        //      {userData: {
                                        //           $elemMatch: {
                                        //                ip: comment.userData.ip
                                        //           } 
                                        //      }}, 
                                        //      {$set: {
                                        //           isNotFirstUserComment: true
                                        //      }}
                                        // )
                                   }
                              }
                         }

                         break
                    }
                    case 'delete': {
                         comments.splice(index, 1)
                         break
                    }
                    case 'update': {
                         Object.assign(comment, value)
                         break
                    }

                    case 'verificate': {
                         // if(mainIps.includes(comment.userData.ip.trim())) {
                         //      comments.splice(index, 1)
                         // } 

                         break
                    }

                    case 'approve': {
                         comment.approved = true
                         console.log(comment)
                         break
                    }
               }
          }

          if (comment.replies && comment.replies.length > 0) {
               mutateComments(comment.replies, searchingId, caseValue, value)
          }
     })

     return { comments, finndedComment }
}


module.exports.getNotVerifiedComments = async (req, res) => {
     try {
          if (req.user.rules && req.user.rules.moderator === true) {
               const notVerified = await Comment.find({ approved: { $ne: true } }).sort({ date: -1 }).populate('idCompany')
               const mutatedComments = mutateComments(notVerified, 'verificate', 'verificate')

               res.status(200).json(mutatedComments.comments)
          } else {
               res.status(400).json('Доступ запрещён')
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

module.exports.allowComment = async (req, res) => {
     try {
          if (req.user.rules.canEditComments && ObjectId.isValid(req.body.rootComment._id)) {
               if (req.body.rootComment._id === req.body.comment._id) {
                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   approved: true
                              }
                         }
                    )
               } else {
                    const changedReplies = mutateComments(req.body.rootComment.replies, req.body.comment._id, 'approve')
                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   replies: changedReplies.comments
                              }
                         }
                    )
               }

               res.status(200).json(null)
          } else {
               res.status(404).json('Комментарий не найден')
          }
     } catch (error) {
          errorHandler(res, error)
     }
}


module.exports.disAllowComment = async (req, res) => {
     try {
          if (
               req.user.rules.canEditComments
          ) {
               console.log(typeof req.body.rootComment.idCompany);
               if (
                    typeof req.body.rootComment.idCompany === 'string' &&
                    req.user.companies.includes(req.body.rootComment.idCompany)
               ) {
                    var company = await Company.findById({ _id: req.body.rootComment.idCompany })
               } else if (typeof req.body.rootComment.idCompany === 'object') {
                    var company = await Company.findById({ _id: req.body.rootComment.idCompany._id })
               } else {
                    res.status(400).json(null)
                    return
               }

               if (req.body.rootComment._id === req.body.comment._id) {
                    const newRating = company.rating - req.body.rootComment.pickedRating

                    const update = {
                         $set: {
                              rating: newRating
                         },
                         $pull: {
                              comments: req.body.rootComment._id
                         }
                    }

                    await Company.updateOne(
                         { _id: company._id },
                         update
                    )

                    await Comment.deleteOne({ _id: req.body.rootComment._id })

               } else {
                    const changedReplies = mutateComments(req.body.rootComment.replies, req.body.comment._id, 'delete')
                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   replies: changedReplies.comments
                              }
                         }
                    )
               }

               res.status(200).json(null)
          } else {
               res.status(400).json(null)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

module.exports.countComments = async (req, res) => {
     try {
          if (ObjectId.isValid(req.params.id)) {
               const countComments = await Comment.find({ idCompany: req.params.id, approved: true }).count()
               res.status(200).json(countComments)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

module.exports.countMoodComments = async (req, res) => {
     try {
          if (ObjectId.isValid(req.params.id)) {
               const comments = await Comment.find({
                    idCompany: req.params.id,
                    hidden: {
                         $ne: true
                    },
                    approved: true
               })

               const result = getMoodComments(comments)

               res.status(200).json(result)
          } else {
               res.status(400).json(null)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}


function getMoodComments(comments = [], negativeComments = [], positiveComments = []) {
     comments.forEach(comment => {
          if (comment.root && comment.pickedRating >= 4 && !comment.hidden) {
               positiveComments.push(comment)
          } else if (comment.root && comment.pickedRating <= 3 && !comment.hidden) {
               negativeComments.push(comment)
          }

          if (comment.root && comment.replies.length > 0) {
               getMoodComments(comment.replies, negativeComments, positiveComments)
          }
     })

     return { count: negativeComments.length + positiveComments.length, negativeComments, positiveComments }
}


module.exports.deleteComment = async (req, res) => {
     try {
          if (req.user.rules.canEditComments && req.user.companies.includes(req.body.rootComment.idCompany)) {
               const company = await Company.findById({ _id: req.body.rootComment.idCompany })
               if (req.body.rootComment._id === req.body.comment._id) {
                    const newRating = company.rating - req.body.rootComment.pickedRating

                    const update = {
                         $set: {
                              rating: newRating
                         },
                         $pull: {
                              comments: req.body.rootComment._id
                         }
                    }

                    await Comment.deleteOne({ _id: req.body.rootComment._id })

                    await Company.updateOne(
                         { _id: company._id },
                         update
                    )
               } else {
                    const changedReplies = mutateComments(req.body.rootComment.replies, req.body.comment._id, 'delete')
                    await Comment.updateOne(
                         { _id: req.body.rootComment._id },
                         {
                              $set: {
                                   replies: changedReplies.comments
                              }
                         }
                    )
               }

               res.status(200).json(null)
          } else {
               res.status(400).json(null)
          }
     } catch (error) {
          errorHandler(res, error)
     }
}

