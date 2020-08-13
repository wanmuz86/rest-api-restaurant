const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

const User = require('./user')
const config = require('./config')
const passport = require('passport');

const params = {
	secretOrKey:config.secret,
	jwtFromRequest:extractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = function(){
	const strategy = new JwtStrategy(params, function(payload,done){
		User.findOne({id:payload.id}, (err,user)=>{
			if (err){
				return done(err,false)
			}
			if (user){
				done(null,user)
			} else {
				done(null,false)
			}
		})
	})
	passport.use(strategy);
	return {
		initialize: function(){
			return passport.initialize();
		},
		authenticate: function(){
			return passport.authenticate("jwt",{
				session:false
			})
		}

	}
}