const { v4: uuidv4 } = require('uuid');
const DefaultConstant = require('../constants/defaultConstant');
const bcrypt = require('bcrypt');

const BY_USERNAME = {};
const BY_ID = {};
const saltrounds = 10;

/*
 * User class
 * @param {string} first - first name
 * @param {string} last - last name
 * @param {string} username - username
 * @param {string} password - password
 * @param {string} id - id
 * @param {string} defaults - default theme
*/
class User {
   constructor( username, password, first, last ) {
      //make sure the username is valid syntax for an email address
      if( !validEmail(username) ) {
         return;
      }
      //make sure the password is valid syntax (at least 8 characters and contain at least one digit)
      if( !validPass(password) ) {
         return;
      }
      this.first = first;
      this.last = last;
      this.username = username;
      this.password = bcrypt.hashSync(password, saltrounds);
      this.id = uuidv4();
      var defaultConstant = new DefaultConstant();
      this.defaults = defaultConstant.defaultTheme;
      BY_ID[ this.id ] = this;
      BY_USERNAME[ this.username ] = this;
   }
}

function validEmail(email) {
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return emailRegex.test(email);
}

function validPass(pass) {
   const passwordRegex = /^(?=.*[0-9])(?=.{8,})/;
   return passwordRegex.test(pass);
}

function getUsers() {
   let result = Object.values( BY_USERNAME );
   result.sort();
   return result.map( user => Object.assign({}, user ) ).map( u => delete u.password );
}

function getUserById( id ) {
   let user = BY_ID[ id ];
   return user && Object.assign( {}, user );
}

function getUserByUsername( username ) {
   let user = BY_USERNAME[ username ];
   return user && Object.assign( {}, user );
}

function deleteUser( id ) {
   let user = getUserById( id );
   if( user ) {
      delete BY_ID[ user.id ];
      delete BY_USERNAME[ user.email ];
   }
   return user;
}

function isUser( obj ) {
   return ["first", "last", "email", "password"]
      .reduce( (acc,val) => obj.hasOwnProperty( val ) && acc, true  );
}


module.exports = { User:User, 
   getUserByUsername:getUserByUsername, 
   getUserById:getUserById,
   getUsers:getUsers,
   isUser:isUser,
   deleteUser:deleteUser
};