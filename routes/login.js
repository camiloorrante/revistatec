var express = require('express');
var router = express.Router();

/* GET articles listing. */
router.get('/', function(req, res, next) {
  res.render('login',{errorMessage:'Iniciar sesion'});
});

module.exports = router;
