//login
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');
//var login = require('./routes/login');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/revista';

/*POST for login */
router.post('/', function(req, res, next) {
    
    MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);
        var user = req.body.username;
        var password = req.body.password;
        var query = {"email":user,"password":password};
        
        db.collection('administradores').find(query).toArray(function(err,docs){
            assert.equal(err,null);
            if(docs.length>0)
                res.redirect('/insertArticle');
            else 
                res.render('login',{errorMessage:'Error email/contraseña incorrectos'});
            db.close();
        });
        
    }
    });
});

module.exports = router;

// Use connect method to connect to the Server
