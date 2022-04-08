require('dotenv').config()
const express = require('express');
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const NaverStrategy = require('passport-naver').Strategy
const { upload } = require('../../utils/profileMulter')
const router = express.Router();
const userController = require('./userController.js');

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_clientID,
    clientSecret: process.env.KAKAO_clientSecret,
    callbackURL: "http://localhost:4001/api/user/oauth/kakao/callback"
}, (accessToken, refreshToken, profile, done) => {

    return done(null, profile)
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_clientID,
    clientSecret: process.env.GOOGLE_clientSecret,
    callbackURL: "http://localhost:4001/api/user/oauth/google/callback"
}, (accessToken, refreshToken, profile, done) => {

    return done(null, profile)
}))

passport.use(new NaverStrategy({
    clientID: process.env.NAVER_clientID,
    clientSecret: process.env.NAVER_clientSecret,
    callbackURL: "http://localhost:4001/api/user/oauth/naver/callback"
}, (accessToken, refreshToken, profile, done) => {

    return done(null, profile)
}))

router.post('/login', userController.login);

router.post('/join', upload.single('upload'), userController.join);

router.post('/quit', userController.quit);

router.post('/profile', userController.profile);

router.post('/profile/update', upload.single('upload'), userController.profileUpdate);

router.post('/profile/myboard', userController.myboard)

router.post('/profile/mycomment', userController.mycomment)

router.post('/profile/myscrap', userController.myscrap)

router.post('/idchk', userController.idchk);

router.post('/nickchk', userController.nickchk);

// kakao login
router.get('/oauth/kakao', passport.authenticate('kakao'))

router.get('/oauth/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: 'http://localhost:3001/user/login',
    session: false
}), userController.kakaoLogin)

// google login
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/oauth/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3001/user/login',
    session: false
}), userController.googleLogin)

// naver login
router.get('/oauth/naver', passport.authenticate('naver'))

router.get('/oauth/naver/callback', passport.authenticate('naver', {
    failureRedirect: 'http://localhost:3001/user/login',
    session: false
}), userController.naverLogin)

module.exports = router;
