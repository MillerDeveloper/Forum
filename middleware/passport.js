const JwtSrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = require('../models/User')
const keys = require('../config/keys')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}

module.exports = passport => {
    passport.use(
        new JwtSrategy(options, async (payload, done) => {
            try{
                // Ищем пользователя
                const user = await User.findById(payload.userId).select('email id rules companies')
            
                if(user) {
                    done(null, user) // Отправляем данные о пользователи
                } else {
                    done(null, false) // Пользователь не найден
                }
            } catch(e) {
                console.log(e);
            }
        })
    )
}