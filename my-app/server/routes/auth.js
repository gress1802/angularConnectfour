let express = require('express');
let users = require('../models/users');
let router = express.Router();
let session = require("express-session");
let bcrypt = require('bcrypt');



router.post("/login", (req, res) => {
   let user = users.getUserByUsername(req.body.username);
   const ERROR = "Invalid credentials";
   if( user ) {
      req.session.regenerate( () => {
         bcrypt.compare(req.body.password, user.password, (err, success) => {
            if( success ) {
               req.session.user = user;
               res.status(200).json(user);
            } else {
               res.status(401).json(ERROR);
            }
         });
      });
   } else {
      res.status(401).json(ERROR);
   }
});

router.post("/logout", (req, res) => {
   req.session.destroy( () => {
      res.status(200).send({});
   });
});


module.exports = router; 