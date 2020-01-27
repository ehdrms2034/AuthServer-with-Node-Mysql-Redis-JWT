var express = require('express');
var router = express.Router();
const {User} = require('../models');
const {Salt} = require('../models/saltDB');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const randomString = require('../Common/randomString');

const Type_User = 'Tp0x01';
const Type_Admin = 'Ad0x11';

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/createUser', (req, res, next) => {
    const {email, password, name} = req.body;
    const saltStr = randomString.createString(8, 8);

    if ((email && password && name) === 0) {
        res.status(400).send('bad Request');
    }

    crypto.pbkdf2(password, saltStr, 3, 64, 'sha256', ((err, derivedKey) => {
            if (err) return;
            const hashedPw = derivedKey.toString('base64');
            saveSalt(email, saltStr)
                .then(() => {
                    createUser(email, hashedPw, name)
                        .then(() => {
                            res.json({msg: "success"});
                        })
                        .catch((err) => {
                            console.log(err);
                            res.json({msg: "failed"});
                        })
                })
                .catch((err) => {
                    res.json({msg: "failed"});
                });
        }
    ));
});

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;

    findSalt(email)
        .then((salt) => createHash(password, salt.salt))
        .then(hashedPassword => {
            return User.findOne(
                {
                    where: {
                        "email": email,
                        "password": hashedPassword
                    }
                });
        })
        .then((user) => {
            if (user == null) {
                res.json({msg: "failed", code: "0x01"}); //회원정보 없음
                return;
            }
            const _verified = user.verified;
            let _userType;
            if (user.userType === "User") _userType = Type_User;
            else _userType = Type_Admin;

            let _token = jwt.sign({email, type: _userType, verified: _verified}, process.env.JWT_SECRET);

            return _token

        })
        .then(token => {
            const parsedKey = 'access_' + email;
            return createJWTInRedis(req, parsedKey, token, 60 * 5);
        })
        .then(token => {
            res.cookie('accessToken', token, {secure: true, httpOnly: true,readOnly : true});
            res.json({msg: 'success', code: '0x00'}); // 성공
        })
        .catch(err => {
            res.json({msg: "failed", err});
        });
});

router.post('/findUserByEmail', (req, res, next) => {
    const {email} = req.body;

    if (email == null)
        res.status(400).send('bad Request');

    User.findOne({where: {"email": email}})
        .then((result) => {
            if (result != null)
                res.json({"msg": "success"});
            else
                res.json({"msg": "failed"});
        })
        .catch(() => {
            res.json({"msg": "failed"});
        });
});

router.put('/modifyPassword', (req, res, next) => {
    const {email, password} = req.body;
    const saltStr = randomString.createString(8, 8);

    Salt.update( //salt 변경
        {salt: saltStr},
        {where: {email}})
        .then(data => {
            if (data === null) {
                res.json({msg: 'failed'});
                return;
            }
            return createHash(password, saltStr);
        })
        .then(hashedKey => {
            console.log('변경', hashedKey);
            //유저 비밀번호 변경
            return User.update({
                password: hashedKey
            }, {
                where: {
                    email: email
                }
            })
        })
        .then(data => {
            res.json({msg: 'success'});
        })
        .catch(err => {
            res.json({msg: 'failed'});
        });

});


function saveSalt(email, salt) {
    return new Promise(((resolve, reject) => {
        Salt.create({email, salt})
            .then(() => {
                resolve();
            })
            .catch(err => reject(err));
    }));
}

function createUser(email, password, name) {
    return new Promise((resolve, reject) => {
        User.create({
            email,
            password,
            name
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    })
}

function findSalt(email) {
    return new Promise((resolve, reject) => {
        Salt.findOne({where: {email}})
            .then(result => {
                    resolve(result);
                }
            )
            .catch(err => {
                resolve(err);
            });
    })
}

function createHash(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 3, 64, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            const hashedKey = derivedKey.toString('base64');
            resolve(hashedKey);
        });
    });
}

function createJWTInRedis(req, key, token, expire) {
    return new Promise((resolve, reject) => {
        req.cache.set(key, token, (err, data) => {
            if (err) reject(err);
            req.cache.expire(key, expire);
            console.log('in', token);
            resolve(token);
        })
    })
}


module.exports = router;