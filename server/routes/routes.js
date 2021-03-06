'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    debug          = require('../lib/debug'),
    security       = require('../lib/security'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users'),
    decks          = require('../controllers/decks'),
    challenges     = require('../controllers/challenges'),
    histories      = require('../controllers/histories');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../../public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  //guest users
  app.get('/home', home.index);
  app.post('/register', users.register);
  app.post('/login', users.login);

  //session check
  app.get('/checkSession', users.checkSession);

  //logged in users
  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.get('/getOwner/:ownerId', users.getOwner);
  app.get('/getLeaders', users.getLeaders);

  //deck routes
  app.post('/deck/create', decks.new);
  app.get('/decks/all', decks.localDecks);
  app.get('/deck/:deckId/view', decks.select);
  app.get('/quiz/:deckId', decks.quiz);
  app.post('/deck/save', decks.saveChanges);
  app.get('/searchDecks', decks.search);
  app.post('/deck/rate', decks.rateDeck);
  app.delete('/deck/delete/:deckId', decks.remove);

  //challenge routes
  app.post('/challenge/new', challenges.new);
  app.get('/challenges/all', challenges.getChallenges);
  app.delete('/challenge/decline/:challengeId', challenges.decline);
  app.post('/challenge/complete/:challengeId', challenges.complete);

  //history routes
  app.get('/history/all', histories.index);

  console.log('Express: Routes Loaded');
};

