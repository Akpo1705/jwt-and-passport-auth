const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../model/model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
        new JWTstrategy(
        {
                secretOrKey: 'TOP_SECRET',
                jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        },
        async (token, done) => {
                try {return done(null, token.user);}
                catch (error) {done(error);}
        }
));


passport.use(
        'signup',
        new localStrategy(
        {
                usernameField: 'email',
                passwordField: 'password'
        },
        async (email, password, done) => {
                try {
                        console.log('signup post response');
                        const user = new User({email: email, password: password });
                        await user.save();
                        return done(null, user);
                } catch (error) {
                        done(error);
                }
        })
);

passport.use(
        'login',
        new localStrategy(
        {
                usernameField: 'email',
                passwordField: 'password'
        },
        async (email, password, done) => {
                try {
                        const user = await User.findOne({ email });
                        if (!user) {
                                return done(null, false, { message: 'User not found' });
                        }
                        const validate = await user.isValidPassword(password);
                        if (!validate) {
                                return done(null, false, { message: 'Wrong Password' });
                        }
                        return done(null, user, { message: 'Logged in Successfully' });
                } catch (error) {
                        return done(error);
                }
        })
);