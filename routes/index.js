var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var mongo = require('mongodb'),
    assert = require('assert');

    

    
    
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/revista";
/* GET home page. */
router.get('/', stormpath.getUser, function(req, res, next) {
  //console.log(req.user); 
  MongoClient.connect(url,function (err,db) {
       if(err)
        console.log('error al conectar con mongodb');
       else
        console.log('se ha conectado a mongodb');
     
      var projection = {author:1,title:1,content:1,photo:1};
      db.collection('article').find({status:1 },projection).toArray(function(error,docs){
          assert.equal(error,null);
          assert.notEqual(docs.length,0);
          //console.log(docs);
          docs.forEach(
            function(articulo){
              console.log(typeof articulo.content);
              articulo.content = articulo.content.toString().substr(0,300)+"...";
          },
            function(err){
              assert.equal(err,null);
          });  
          console.log(req.user);
            if(req.user){
              res.render('index', 
                          { 
                            title: 'revista Tec',
                            articles:docs,
                            logued:true,
                            userName: req.user.givenName
                          });
           }
           else{
              res.render('index', { title: 'revista Tec', articles:docs,logued:false});
           }            
          
          db.close();
    });
     
  });
  
  
});
/* POST search home page. */
router.post('/', function(req, res, next) {
  MongoClient.connect(url,function (err,db) {
       if(err)
        console.log('error al conectar con mongodb');
       else
        console.log('se ha conectado a mongodb');
     
      var projection = {author:1,title:1,content:1,photo:1};
      console.log(req.body.search);
      var query = {
                    status :1,
                    $or:[ 
                    {author:{$regex:'.*'+req.body.search+'.*',$options:'i'}},
                    {content:{$regex:'.*'+req.body.search+'.*',$options:'i'}},
                    {title:{$regex:'.*'+req.body.search+'.*',$options:'i'}}
                    ]  
                };
              
      db.collection('article').find(query,projection).toArray(function(error,docs){
          //assert.equal(error,null);
          //assert.notEqual(docs.length,0);
          //console.log(docs);
          docs.forEach(
            function(articulo){
              console.log(typeof articulo.content);
              articulo.content = articulo.content.toString().substr(0,300)+"...";
          },
            function(err){
              assert.equal(err,null);
          });
            res.render('index', { title: 'revista Tec',articles:docs});            
           
          db.close();
    });
     
  });
  
  
});
module.exports = router;
