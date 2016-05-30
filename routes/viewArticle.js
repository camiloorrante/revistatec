var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var MongoClient = mongo.MongoClient,
    url = "mongodb://localhost:27017/revista";
var ObjectId = mongo.ObjectID;
/* GET view articles  */
router.get('/:article', function(req, res, next) {
  console.log(req.params.article);
  MongoClient.connect(url,function(err , db) {
    
    objId = ObjectId(req.params.article);
    
    assert.equal(24, objId.toHexString().length);
    db.collection('article').findOne({"_id":objId},function(err,doc){
      console.log(doc);
      res.render('viewArticle',{title:'Articulo',articleTitle:doc.title,author:doc.author,content:doc.content});   
    });
  })
  
});
module.exports = router;
