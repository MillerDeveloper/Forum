import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../../interfaces/Comment'

@Injectable({
  providedIn: 'root'
}) 
export class CommentService {

  constructor(private http: HttpClient) { }
  
  commentReply: BehaviorSubject<{comment: Comment, rootComment: Comment}> = new BehaviorSubject(null)

  getComments(idCompany: string, params?: Params): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.server}/api/comments/${idCompany}`, {
      params: new HttpParams({ 
          fromObject: params  
      })
    }) 
  }

  addComment(comment): Observable<Comment> { 
    return this.http.post<Comment>(`${environment.server}/api/comments`, comment) 
  }

  reply(comment: Comment, rootComment: Comment) {       
    this.commentReply.next({comment, rootComment})
  }

  updateComment(comment: Comment, rootComment: Comment) {
    return this.http.put<Comment>(`${environment.server}/api/comments/${comment._id}`, {comment, rootComment})
  }

  hideComment(comment: Comment, rootComment: Comment) {
    return this.http.put<Comment>(`${environment.server}/api/comments/hideComment`, {comment, rootComment})
  }

  getNotVerifiedComments(): Observable<Comment[]> { 
    return this.http.get<Comment[]>(`${environment.server}/api/comments/verify/getNotVerifiedComments`)
  }

  allowComment(rootComment: Comment, comment: Comment): Observable<any> {
    return this.http.put<any>(`${environment.server}/api/comments/verify/allowComment`, {rootComment, comment})
  }

  disAllowComment(comment: Comment, rootComment: Comment): Observable<any> {
    return this.http.put<any>(`${environment.server}/api/comments/verify/disAllowComment`, {comment, rootComment})
  }

  countMoodComments(idCompany: string): Observable<any> {
    return this.http.get<any>(`${environment.server}/api/comments/count/countMoodComments/${idCompany}`) 
  }

  countComments(idCompany: string): Observable<number> {
    return this.http.get<number>(`${environment.server}/api/comments/count/countComments/${idCompany}`)
  }
}
 