var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var mongo = require('mongodb'),
    assert = require('assert');
var ObjectId = mongo.ObjectID;
    

    
    
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
      db.collection('article').find({status:0 },projection).toArray(function(error,docs){
          assert.equal(error,null);
          //assert.notEqual(docs.length,0);
          //console.log(docs);
          docs.forEach(
            function(articulo){
              //console.log(typeof articulo.content);
              articulo.content = articulo.content.toString().substr(0,300)+"...";
          },
            function(err){
              assert.equal(err,null);
          });  
          console.log(req.user);
            if(req.user){
              res.render('reviewArticles', 
                          { 
                            title: 'revista Tec',
                            articles:docs,
                            logued:true,
                            userName: req.user.givenName
                          });
           }
           else{
              res.render('reviewArticles', { title: 'revista Tec', articles:docs,logued:false});
           }            
          
          db.close();
    });
     
  });
  
  
});
/* POST search home page. */
router.post('/', function(req, res, next) {
  console.log("============================");
  console.log(req.body);
  MongoClient.connect(url,function (err,db) {
       if(err)
        console.log('error al conectar con mongodb');
       else
        console.log('se ha conectado a mongodb');
            objId = ObjectId(req.body.articleId);
            db.collection('article').update({_id:objId},{$set:{status:1}},function(err,res){
              if(err) throw err;
              console.log(res);
             
          });
            
             var projection = {author:1,title:1,content:1,photo:1};
      db.collection('article').find({status:0 },projection).toArray(function(error,docs){
          assert.equal(error,null);
          //assert.notEqual(docs.length,0);
          //console.log(docs);
          docs.forEach(
            function(articulo){
              //console.log(typeof articulo.content);
              articulo.content = articulo.content.toString().substr(0,300)+"...";
          },
            function(err){
              assert.equal(err,null);
          });  
          console.log(req.user);
            if(req.user){
              res.render('reviewArticles', 
                          { 
                            title: 'revista Tec',
                            articles:docs,
                            logued:true,
                            userName: req.user.givenName
                          });
           }
           else{
              res.render('reviewArticles', { title: 'revista Tec', articles:docs,logued:false});
           }            
          
          db.close();
    });
            
    });
  
});
module.exports = router;
