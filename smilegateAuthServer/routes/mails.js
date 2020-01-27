const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const mailConfig = require('../config/mailconfig');
const uuid4 = require('uuid4');

const {User} = require('../models');

const mailer = nodeMailer.createTransport(smtpTransport({
    service: mailConfig.mailserver,
    host: "smtp.gmail.com",
    auth: {
        user: mailConfig.mailID,
        pass: mailConfig.password
    }
}));

router.get('/verifyEmail/:uuid', (req, res, next) => {
    const {uuid} = req.params;
    getEmailByUUID(req, uuid)
        .then((email) => {
            if (email === null) res.send("찾은게 없음");
            return User.update({verified: true}, {where: {email}});
        })
        .then(data => {
            res.send("변경완료쓰!");
        })
        .catch(err => {
            res.send(err);
        });
});

router.post('/createVerifiedUUID', (req, res, next) => {
    const {email} = req.body;
    const title = "회원가입 인증 완료 요청입니다.";
    const url = "https://localhost/mails/verifyEmail/";
    console.log('test', email);
    if (email === null) {
        res.status(400).send({msg: "errorCode0x01"})
    }

    //user email 조회해보고 없는 email 일경우, UUID생성해주지 않음
    createUuidInRedis(req, uuid4(), email)
        .then(uuid => sendMail(email, uuid, title, url))
        .then(() => {
            res.json({msg: 'success'});
        })
        .catch(err => res.json({msg: 'failed', why: err}));
});

router.post('/createFindPasswordUUID', (req, res, next) => {
    const {email, name} = req.body;
    const title = "비밀번호 찾기 안내 이메일 입니다.";
    const url = "https://localhost/resetPassword/";
    if (email === null || name === null) {
        res.status(400).send({msg: "errorCode0x01"});
    }

    User.findOne({where: {email: email, name: name}})
        .then(data => {
            console.log(data);
            if (data == null) {
                res.json({msg: 'failed'});

            } else {
                return createFindPasswordUUID(req, uuid4(), email);
            }
        })
        .then(uuid => {
            if (uuid === null||uuid ===undefined) return;
            return sendMail(email, uuid, title, url)
        })
        .then(() => {
            res.json({msg: 'success'});
        })
        .catch((err) => {
            res.json({msg: 'failed', err});
        });
});


function createUuidInRedis(req, uuid, email) {
    const prefix = 'verify_';
    const keyName = prefix + uuid;
    return new Promise((resolve, reject) => {
        req.cache.set(keyName, email, (err, data) => {
            if (err) reject(err);
            req.cache.expire(prefix + uuid, 60 * 60);
            resolve(uuid);
        });
    });
}

function createFindPasswordUUID(req, uuid, email) {
    const prefix = 'findPw_';
    const keyName = prefix + uuid;
    const time = 60 * 5;
    return new Promise((resolve, reject) => {
        req.cache.set(keyName, email, (err, data) => {
            if (err) reject(err);
            req.cache.expire(prefix + uuid, time);
            resolve(uuid);
        });
    });
}

function sendMail(to, uuid, title, url) {
    return new Promise((resolve, reject) => {
        mailer.sendMail({
            from: "ehdrms2034@gmail.com",
            to: [to],
            subject: title,
            text: url + uuid
        }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    })
}

function getEmailByUUID(req, uuid) {
    const prefix = 'verify_';
    const keyName = prefix + uuid;
    console.log("test", keyName);
    return new Promise(((resolve, reject) => {
        req.cache.get(keyName, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    }));
}

module.exports = router;