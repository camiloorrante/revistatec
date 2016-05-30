var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');
var stormpath = require('express-stormpath');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/revista';

var multer = require('multer');
var upload = multer({dest:'./public/images'});

/*get insert article*/
router.get('/',stormpath.getUser, function (req, res, next) {
    if(req.user){
	    res.render('sendArticle', { title: 'Agregar un artículo',userName:req.user.givenName,logued:true });
        console.log(req.user.givenName);
    }
    else
        res.render('sendArticle',{title:'Agregar un articulo',logued:false});
    
});

/*post insert article*/
router.post('/',upload.single('articlePhoto') ,function (req, res, next) {
	console.log(req.file);
    
	

	MongoClient.connect(url, function (err, db) {
		assert.equal(err, null);
		if (err)
			console.log('Unable to connect to the mongoDB server. Error:', err);
		else
			console.log('Connection established to', url);
		
		
		//console.log(upload);
		var articulo = req.body;
		articulo.status = 0;
		articulo.admin = 1;
		articulo.photo = req.file.filename;
		db.collection('article').insert(articulo, function (err, records) {
			assert.equal(err, null);
			//console.log(records);
			db.close();
			res.render('insertArticle',{mostrarAlert:true,alertMessage:'Se guardo el articulo con exito'});
		});
		
    });
	
	
});
module.exports = router;
