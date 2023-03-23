var express = require('express');
var router = express.Router();
var userDB = require('../models/users');

// FAKE DB STUFF
const Error = require( "../models/error.js" );
const Game = require( "../models/game.js" );
const Metadata = require( "../models/metadata.js" );
const Theme = require( "../models/theme.js" );
const Token = require( "../models/token.js" );
const session = require("express-session");
const { v4: uuidv4 } = require('uuid');

//Create new user
//The constructor looks as follows (username, password, first, last) the id is generated with uuid() and the default theme is set through a constant
new userDB.User('gress2123@uwlax.edu', '11111111', 'Joseph', 'Gress');
new userDB.User('bilbo@mordor.org', '111111111', 'Bilbo', 'Baggins');
new userDB.User('frodo@mordor.org', '222222222', 'Frodo', 'Baggins');
new userDB.User('samwise@mordor.org', '333333333', 'Samwise', 'Gamgee');

//This is an object that is keyed on names of players and contains the player link to url images
//player and urls
let alexiaURL = 'https://media.licdn.com/dms/image/C4E03AQEDil9gumwe8A/profile-displayphoto-shrink_100_100/0/1636642322101?e=1681948800&v=beta&t=XM3EVz7Z33rpMrwhHHcdiAjeVikpU_vGKPOMKOhYzHg';
let jakeURL = 'https://media.licdn.com/dms/image/D5603AQGAdRgpDd6fdg/profile-displayphoto-shrink_200_200/0/1674257804137?e=1681344000&v=beta&t=5tiiRDeMRv39MuxJi3pj8-Am_FPxBnpRqCy4SAHXN0A';
let carterURL = 'https://media.licdn.com/dms/image/C5603AQH31PiZaRHSLA/profile-displayphoto-shrink_200_200/0/1615994456233?e=1681948800&v=beta&t=uQLMDGJrhL9KmnzW9iFX2Yawfm4He8sHqkCLoQDLUmQ';
let jackURL = 'https://media.licdn.com/dms/image/D4D03AQH9bBSWOsSOOA/profile-displayphoto-shrink_200_200/0/1670280702982?e=1681948800&v=beta&t=BLf4XPpD9zyhkVU5rV9Y0KBozeF5_8BtsjtRGP-8SYc';
let charlieURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqe_Xinkfls1tSKdVY0IDhvOc6BZfSUaGw7Q&usqp=CAU';
let kevinURL = 'https://media.licdn.com/dms/image/D4D03AQGMEoaEcMv8GA/profile-displayphoto-shrink_200_200/0/1675972242465?e=1681948800&v=beta&t=xwxw549qp-8MbQQucKAukgCoUuQNnIFxdhVSm76Ojk0';
let jaredURL = 'https://media.licdn.com/dms/image/C4E03AQE21JahWRECJQ/profile-displayphoto-shrink_100_100/0/1632931351778?e=1681948800&v=beta&t=fBfhpRQLudFGhW37mN7OqWAuh6xAJBObC2cw45acgqI';
let demarcusURL = 'https://media.licdn.com/dms/image/C5603AQGrAzvcFeFcGQ/profile-displayphoto-shrink_100_100/0/1628650461769?e=1681948800&v=beta&t=ki_cwLOZw6uaz-hffWZOrfUAfnAEtSN11eqMq0Pux2M';

//tokens is a list of token objects that are supported by the app
var  tokens = [new Token("Alexia", alexiaURL), new Token("Jake", jakeURL), new Token("Carter", carterURL), new Token("Jack", jackURL), new Token("Charlie", charlieURL), new Token("Kevin", kevinURL), new Token("Jared", jaredURL), new Token("Demarcus", demarcusURL)];
var def = new Theme("#E66465", tokens['Alexia'], tokens["Demarcus"]);

//gameList is a list of GameList objects
var gameList = {};

//sidList is an array of all sids
//sid is the current sid being used

//check if the user is logged in 
router.all("/api/v2/*", (req, res, next) => {
  if(req.path == '/api/v2/login' || req.path == '/api/v2/logout' || req.session.user) {
    next();
  } else {
    req.session.regenerate((err) => {
      if(err) {
        res.status(500).json(new Error('error regenerating session'));
      } else {
        res.status(403).json(new Error('unauthenticated user'));
      }
    });
  }
});

// GET /api/v2/who
router.get('/api/v2/who', (req, res, next) => {
  if(req.session) {
    if(req.session.user) {
      res.status(200).json(req.session.user);
    } else {
      res.status(200).json(new Error('No authenticated User'));
    }
  } else {
    req.status(200).json(new Error('No authenticated User'));
  }
}); 

/*
 * PUT /api/v2/defaults
 * This endpoint updates the default theme object for the current authenticated user
 * The default object is in the body of the request
 * The response will include the new default object and a 200 status code on a successful update
 * The response will include an error object with the message 'invalid defaults' and a 200 status code if the request is invalid
*/
router.put("/api/v2/defaults", (req, res) => {
  var theme = req.body;
  if (!(theme == null || theme.color == null || theme.playerToken == null || theme.computerToken == null)) {
    var token = new Token(theme.token.name, theme.token.url);
    var newTheme = new Theme(theme.background, token, theme.opponent);
    def = newTheme;
    res.status(200).json(newTheme);
  } else {
    res.status(200).json({error: "invalid defaults"});
  }
});

//This is a function that returns the token with the same name as the parameter passed
function getPCToken(name) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].name == name) {
      return tokens[i];
    }
  }
  return false;
}

//This is a function that tells whether the id is in our sidList
function isValidSid(id) {
  for (let i = 0; i < sidList.length; i++) {
    if (sidList[i] == id) {
      return true;
    }
  }
  return false;
}

//this is a function that returns a 5 row by 7 column array of x's
function getEmptyBoard() {
  var board = [];
  for (var i = 0; i < 5; i++) {
    board.push([]);
    for (var j = 0; j < 7; j++) {
      board[i].push(" ");
    }
  }
  return board;
}

//END OF FAKE DB STUFF

/* GET /api/v2/meta */
// This endpoint delivers all of the user-configurable settings as a metadata object
// default theme object is renamed to def because default is a reserved word
router.get('/api/v2/meta', (req, res, next) => {
  try {
    res.status(200).json(new Metadata(tokens, def));
  } catch (error) {
    res.status(200).json(new Error("Error getting metadata"));
  }
});

/* GET /api/v2/sids */
// This endpoint delivers a list of games associated with the given SID
router.get('/api/v2/sids', (req, res, next) => {
  let sid = req.session.user.id;
  let list = [];
  if (sid in gameList) {
    for(let i = 0; i<gameList[sid].length; i++) {
      list.push(gameList[sid][i]);
    }
    res.status(200).json(list);
  } else {
    res.status(200).json(new Error("Error getting games with sid: " + sid));
  }
});

/* POST /api/v2/sids */
// This endpoint creates a new game object and adds it to the list of games associated with the user's Id
// This endpoint also delivers the new game object. it additionally validates the user input
router.post('/api/v2/sids', (req, res, next) => {
  let sid = req.session.user.id;
  const colorCodeRegex = /^#[0-9A-Fa-f]{6}$/;
  let color = req.query.color;
  let playerToken = getPCToken(req.body.selectedPlayer);
  let computerToken = getPCToken(req.body.selectedComputer);
  let theme = new Theme(color, playerToken, computerToken);
  if(!colorCodeRegex.test(color) || !playerToken || !computerToken) {
    res.status(200).json(new Error("Error with user input"));
  }else{
    var thisGame = new Game(theme, 'UNFINISHED', displayDate(), null, getEmptyBoard());
    if (sid in gameList) {
      gameList[sid].push(thisGame);
    } else {
      gameList[sid] = [thisGame];
    }
    res.status(200).json({ game :thisGame });
  }
});

//This is a function that displays the current date and time in this formate
// Day Month Day Date Year
function displayDate(){
    let date = new Date();
    let dateString = getDayName(date.getDay()) + ' ' + getMonthName(date.getMonth()) + ' ' + date.getDate() + ' ' + date.getFullYear();
    return dateString;
}

//This is a function that takes a month number and returns the month name
function getMonthName(monthNumber){
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthNumber];
}

//This is a function that takes a day number and returns a day name
function getDayName(dayNumber){
    let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[dayNumber];
}

/* GET /api/v2/gids/:gid */
// This endpoint delivers a game object associated with the given SID and GID
router.get('/api/v2/gids/:gid', (req, res, next) => {
  let sid = req.session.user.id;
  let gid = req.params.gid;
  if (sid in gameList) {
    let game = null;
    for (let i = 0; i < gameList[sid].length; i++) {
      if (gameList[sid][i].id == gid) {
        game = gameList[sid][i];
        break;
      }
    }
    if (game) {
      res.status(200).json(game);
    } else {
      res.status(200).json(new Error("Error getting game with gid: " + gid));
    }
  } else {
    res.status(200).json(new Error("Error getting games with sid: " + sid));
  }
});

/* POST /api/v2/gids/:gid */
// This endpoint is used to make a move in the connectfour game
router.post('/api/v2/gids/:gid', (req, res, next) => {
  let sid = req.session.user.id;
  let gid = req.params.gid;
  let move = req.query.move;
  let game = null;
  if (sid in gameList) {
    for (let i = 0; i < gameList[sid].length; i++) {
      if (gameList[sid][i].id == gid) {
        game = gameList[sid][i];
        break;
      }
    }
    if (game) {
      game = makeMove(game, move);
      res.status(200).json(game);
    } else {
      res.status(200).json(new Error("Error getting game with gid: " + gid));
    }
  } else {
    res.status(200).json(new Error("Error getting games with sid: " + sid));
  }
});

/*
 * This is a function that makes the move and edits the game object (player move)
 * it first checks if the move is valid, then it makes the move for the player and the computer.
 * it then checks if the game is over and updates the game object accordingly and returns the game object
*/
function makeMove(game, move) {
  var grid = game.grid;
  var isFull = 0;
  for(let i = 0; i<grid.length; i++){
    if(grid[i][move] != ' '){
      isFull++;
    }
  }
  if(isFull == 5){
    return game;
  }
  var gameOverFull = false;
  var gameOverX = false;
  var gameOverO = false;
  grid = gridMove(grid, move, 'x');
  let rand = Math.floor(Math.random()*7);
  grid = gridMove(grid, rand, 'o');
  gameOverFull = isFullBoard(grid);
  gameOverX = fourInARow(grid, 'x');
  gameOverO = fourInARow(grid, 'o');
  if(gameOverFull || gameOverX || gameOverO){
    game.finish = displayDate();
    gameOverX ? game.status = 'VICTORY' : game.status = 'LOSS';
    if(gameOverFull){
      game.status = 'TIE';
    }
  }
  return game;
}

//Helper functions
//This function takes a grid and a move and returns the new grid
//This function is used to make the move for the 'token' (x or o)
function gridMove(grid, move, token){
  if(token == 'x'){
    for(let i = grid.length-1; i>=0; i--){
      if(grid[i][move] == ' '){
        grid[i][move] = token;
        break;
      }
    }
  }else{
    let moveDone = false;
    let full = isFullOne(grid);
    while(!moveDone && !full){
      for(let i = grid.length-1; i>=0; i--){
        if(grid[i][move] == ' '){
          grid[i][move] = token;
          moveDone = true;
          break;
        }
      }
      move = Math.floor(Math.random()*7);
    }
  }
  return grid
}

//This function returns true if the grid is full - 1
function isFullOne(grid){
  var full = false;
  var count = 0;
  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid[i].length; j++){
      if(grid[i][j] != ' '){
        count++;
      }
    }
  }
  if(count == 35){
    full = true;
  }
  return full;
}

//This is a function that returns true if the grid is full
function isFullBoard(grid){
  var full = false;
  var count = 0;
  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid[i].length; j++){
      if(grid[i][j] != ' '){
        count++;
      }
    }
  }
  if(count == 35){
    full = true;
  }
  return full;
}

//This function checks if the game is over by checking if the player or computer has gotten 4 in a row vertically horizontally or diagonally
//Parameters: grid: the grid of the game; token: either 'x' or 'o'
function fourInARow(grid, token){
  //check vertically
  for(var i = 0; i < grid.length-3; i++){
    for(var j = 0; j < grid[i].length; j++){
      if(grid[i][j] == token && grid[i+1][j] == token && grid[i+2][j] == token && grid[i+3][j] == token){
        return true;
      }
    }
  }
  //check horizontally
  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid[i].length-3; j++){
      if(grid[i][j] == token && grid[i][j+1] == token && grid[i][j+2] == token && grid[i][j+3] == token){
        return true;
      }
    }
  }
  //check diagonally from right to left
  for(var i = 0; i < grid.length-3; i++){
    for(var j = 0; j < grid[i].length-3; j++){
      if(grid[i][j] == token && grid[i+1][j+1] == token && grid[i+2][j+2] == token && grid[i+3][j+3] == token){
        return true;
      }
    }
  }
  //check diagonally left to right
  for(var i = 0; i < grid.length-3; i++){
    for(var j = 3; j < grid[i].length; j++){
      if(grid[i][j] == token && grid[i+1][j-1] == token && grid[i+2][j-2] == token && grid[i+3][j-3] == token){
        return true;
      }
    }
  }
}

module.exports = router;