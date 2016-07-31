var express = require('express');
var router = express.Router();
require('dotenv').load();
//var passwordHash = require('password-hash'); //npm install --save password-hash
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

//var nano = require('nano')('http://localhost:5984');
//var nano = require('nano')('https://braga-service.cloudant.com');
//var nano = require('nano')('https://braga-service:@Cloudant2016#@braga-service.cloudant.com');
//var mean = nano.db.use('mean');

var Cloudant = require('cloudant');
var me = process.env.CLOUDANT_USERNAME;
var password = process.env.CLOUDANT_PASSWORD;
var cloudant = Cloudant({account:me, password:password});
var mean = cloudant.db.use('mean');


router.post('/', function(req, res, next) {
    var salt = crypto.randomBytes(16).toString('base64');

    var password = crypto.createHmac('sha256', salt);
    password.update(req.body.password);
    var passwordHash = password.digest('base64');

    //var passwordHash = saltHash.digest('hex');

    //console.log('salt: ' + salt);
    //console.log(hash);
    //console.log(saltHash);
    //console.log('passwordHash: ' + passwordHash);
    //var passWord = passwordHash.generate(req.body.password);

    mean.view('email','email', {key: req.body.email}, function (err, docs){
        var email = docs.rows.length;

        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (email != 0) {
            return res.status(404).json({
                title: 'Email alredy exist',
                error: {message: 'Email alredy exist MESSAGE'}
            });
        }
    

        mean.insert({email: req.body.email, password: passwordHash, firstName: req.body.firstName, lastName: req.body.lastName, salt: salt, messagesIds: []}, function (err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Saved message',
                //obj: req.body,
                id_rev: result
            });
        });
    });
})

router.post('/signin', function (req, res, next) {
    mean.view('email','email', {key: req.body.email}, function (err, docs){
         var email = docs.rows.length;
 
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (email == 0) {
            return res.status(404).json({
                title: 'No user found',
                error: {message: 'User could not be found'}
            });
        }
        //if (!passwordHash.verify(req.body.password, password)) {
        
        var password = crypto.createHmac('sha256', docs.rows[0].value[2]);
        password.update(req.body.password);

        var passwordHash = password.digest('base64');
        var _passwordHash = docs.rows[0].value[1];

        if(passwordHash != _passwordHash) {
            return res.status(404).json({
                title: 'Could not sign you in',
                error: {message: 'Invalid password'}
            });
        }

        //var secret = crypto.randomBytes(16).toString('base64');
        var token = jwt.sign({user: docs.rows[0].id}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Success',
            obj: token,
            userId: docs.rows[0].id
        })
    });
});
module.exports = router;