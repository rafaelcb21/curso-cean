var express = require('express');
var jwt = require('jsonwebtoken');
require('dotenv').load();
//var crypto = require('crypto');

var router = express.Router();
/*var Message = require('../public/js/app/message/message');*/
//var nano = require('nano')('http://localhost:5984');
//var nano = require('nano')('https://braga-service.cloudant.com');
//var mean = nano.db.use('mean');

var Cloudant = require('cloudant');
var me = process.env.CLOUDANT_USERNAME;
var password = process.env.CLOUDANT_PASSWORD;
var cloudant = Cloudant({account:me, password:password});
var mean = cloudant.db.use('mean');

//console.log(process.env);
//console.log(me);
//console.log(password);

router.get('/', function (req, res, next) {   
    mean.view('message','type_message', function (err, docs) {
        if(err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: docs.rows
        })
    })
});

router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if(err) {
            return res.status(401).json({
                title: 'Authentication failed',
                error: {message: 'Authentication failed'}
            });
        }
        next();
    })
});

router.post('/', function (req, res, next) {
    /** var message = new Message({
        content: req.body.content
    });*/
    //var id = crypto.randomBytes(16).toString('hex');
    //console.log(req.body);
    //{_id: id, content: req.body.content, username: req.body.username, messageId: req.body.messageId}


    var decoded = jwt.decode(req.query.token);
    //console.log(decoded.user);
    mean.get(decoded.user, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }

        //juntar req.body com o usuario
        //console.log(decoded.user);
        //console.log('********************');
        //console.log(req.body);
        //console.log('********************');
        //console.log(doc);
        //console.log(doc._id);
        //console.log(doc.firstName);

        mean.insert({type: req.body.type, content: req.body.content, username: doc.firstName, messageId: doc._id, userId: doc._id}, function (err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            
            doc.messagesIds.push(result.id);
            mean.insert({_id: doc._id, _rev: doc._rev, email: doc.email, password: doc.password, firstName: doc.firstName, lastName: doc.lastName, salt: doc.salt, messagesIds: doc.messagesIds}
    , function (err, result) {
                if (err) {
                    return res.status(404).json({
                        title: 'An error occurred',
                        error: err
                    });
                }    
            });
            //console.log(req.body);
            //console.log({type: req.body.type, content: req.body.content, username: doc.firstName, messageId: doc._id})
            res.status(201).json({
                message: 'Saved message',
                obj: {type: req.body.type, content: req.body.content, username: doc.firstName, userId: doc._id, messageId: doc._id},
                id_rev: result
            });
        });
    });
});

router.patch('/:_id', function (req, res, next) {
    //console.log(req.body);
    //console.log(req.body._id);
    //console.log(req.body.content);
    var decoded = jwt.decode(req.query.token);
    mean.view('message', 'doc_keys', {key: req.body._id}, function(err, docs) {
        if (err) {
            return res.status(404).json({
                title: 'No message found GET',
                error: err
            });
        }

        //console.log(docs.rows[0].value.userId);
        //console.log(req.query.userId);
        //console.log(req.body);

        if (docs.rows[0].value.userId != req.query.userId) {
            return res.status(401).json({
                title: 'Not Authorize',
                error: {message: 'Message created by other user'}
            });
        }

        
        mean.insert({type: "message", _id: docs.rows[0].value._id, _rev: docs.rows[0].value._rev, content: req.body.content, username: docs.rows[0].value.username, messageId: docs.rows[0].value.userId, userId: docs.rows[0].value.userId}, docs.rows[0].value._id, function(err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'No message found patch',
                    error: err,
                    result: result
                });
            }
            //console.log(docs.rows[0].value);
            res.status(201).json({
                message: 'Success',
                obj: {type: "message", _id: docs.rows[0].value._id, _rev: docs.rows[0].value._rev, content: req.body.content, username: docs.rows[0].value.username, messageId: docs.rows[0].value.userId, userId: docs.rows[0].value.userId}
            });
        });
    });
});

router.patch('/:id/:rev', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //console.log(req.body.userId);

    mean.view('message', 'doc_keys', {key: req.body._id}, function(err, result) {
        //console.log(result);
        //console.log(result.rows[0].value);
        //console.log(result.rows[0].value.userId);
        //console.log(result.rows[0].id);
        //console.log(req.body._id);
        //console.log(result.rows[0].userId);

        if(err) {
            return res.status(404).json({
                    title: 'No message found DELETE',
                    error: err
                });
        }
        if (result.rows[0].value._id != req.body._id) {
            return res.status(401).json({
                title: 'Not Authorize',
                error: {message: 'Message created by other user'}
            });
        }       

        mean.view('user','user', {key: result.rows[0].value.userId}, function (err, docs) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            var message = req.body._id;
            var messages = docs.rows[0].value.messagesIds;
            
            var _id = docs.rows[0].value._id;
            var _rev = docs.rows[0].value._rev;
            var email = docs.rows[0].value.email;
            var firstName = docs.rows[0].value.firstName;
            var lastName = docs.rows[0].value.lastName;

            var messagesIds = docs.rows[0].value.messagesIds;
            var password = docs.rows[0].value.password;
            var salt = docs.rows[0].value.salt;

            messages.splice(messages.indexOf(message), 1);
            //console.log(messages);
            mean.insert({_id: _id, _rev: _rev, email: email, firstName: firstName, lastName: lastName, messagesIds: messages, password: password, salt: salt}, _id, function(err, result) {
                if (err) {
                    return res.status(404).json({
                        title: 'No message found patch',
                        error: err,
                        result: result
                    });
                }
            });
        });

        //console.log(result.rows[0].value);
        //console.log(result.rows[0].value._id);
        //console.log(result.rows[0].value._rev);
        
        mean.destroy(result.rows[0].value._id, result.rows[0].value._rev, function(err, doc) {
            if (err) {
                return res.status(404).json({
                    title: 'No message found',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Deleted',
                obj: result
            });
        });
    })

});



module.exports = router;