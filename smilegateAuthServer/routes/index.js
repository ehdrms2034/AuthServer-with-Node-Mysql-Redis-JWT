var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get('/findpassword', (req, res, next) => {
    res.render('findpassword_view');
});

router.get('/resetPassword/:uuid', (req, res, next) => {
    const {uuid} = req.params;
    const prefix = 'findPw_';
    const processedUuid = prefix + uuid;
    isActiveUUID(req, processedUuid)
        .then(data => {
            if (data === null || data === undefined)
                res.send("유효하지 않은 링크거나, 만료된 링크입니다.");
            res.render('resetPassword_view', {email: data});
        })
        .catch(err => {
            console.log(err);
            res.send("유효하지 않은 링크거나, 만료된 링크입니다.");
        });
});

function isActiveUUID(req, uuid) {
    return new Promise((resolve, reject) => {
        req.cache.get(uuid, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}


module.exports = router;