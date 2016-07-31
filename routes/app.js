var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');

var mean = nano.db.use('mean');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function (req, res, next) {
    /** var message = new Message({
        content: req.body.content
    });*/
    
    mean.insert(req.body, function (err, result) {
        if (err) {
            return res.status(404).json({
                title: 'Um erro ocorreu',
                error: err
            });
        }
        res.status(201).json({
            message: 'Saved message',
            obj: result
        });
    });
});
module.exports = router;
