const express = require('express');
const router = express.Router();
const {User} = require('../models');
const {Salt} = require('../models/saltDB');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    const {accessToken} = req.cookies;
    if (accessToken == null) res.redirect("/login");
    const parsedToken = jwt.decode(accessToken, process.env.JWT_SECRET);

    if (parsedToken===null||parsedToken.type !== "Ad0x11") {
        res.status(403).send('Forbidden');
        return;
    }


    req.cache.get('access_'+parsedToken.email, (err, data) => {
        if (err||data!==accessToken) {
            res.status(403).send('Forbidden');
            return;
        }
        console.log('하이'+data);
        next();
    });

});

router.get('/', (req, res, next) => {
    res.render('admin');
});

router.get('/modifyUser/:id', (req, res, next) => {
    const {id} = req.params;
    User.findOne({
        where: {id: id},
        attributes: ['id', 'email', 'name', 'verified', 'createdAt']
    })
        .then(result => {
            const userData = result.dataValues;
            res.render('modifyUser_view', userData);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/getAllUserList', (req, res, next) => {
    User.findAll({
        attributes: ['id', 'email', 'name', 'userType', 'verified', 'createdAt']
    })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.send(err);
        });
});

router.put('/updateUserById', (req, res, next) => {
    const {id, name, verified, userType} = req.body;
    User.update(
        {name: name, verified: verified, userType: userType},
        {where: {id: id}})
        .then(result => {
            res.json({msg: 'success'})
        })
        .catch(err => {
            res.json({msg: 'failed'});
        });
});

router.delete('/deleteUserById', (req, res, next) => {
    const {id} = req.body;

    User.destroy({where: {id: id}})
        .then(result => Salt.destroy({id: id}))
        .then(result => {
            res.json({msg: 'success'});
        })
        .catch(err => {
            res.json({msg: 'failed'});
        })

});

module.exports = router;