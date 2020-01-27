var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    const {accessToken} = req.cookies;
    console.log(accessToken);
    if (accessToken == null) {
        res.redirect('/login');
        return;
    }
    const jwtData = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (req.path!=="/verification"&&jwtData.verified === false){//이메일 인증을 받지 않았을 경우
        res.redirect('/front/verification');
        return;
    }
    next();
});

router.get('/', (req, res, next) => {
    res.render('front');
});

router.get('/verification', (req, res, next) => {
    const {accessToken} = req.cookies;
    const jwtData = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log(jwtData.email);
    res.render('verification_view', {email: jwtData.email});
});


module.exports = router;