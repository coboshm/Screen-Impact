// Module Dependencies and Setup

var express = require('express')
  , mongoose = require('mongoose')
  , UserModel = require('./lib/models/user')
  , User = mongoose.model('User')
  , ScreenModel = require('./lib/models/screen')
  , Screen = mongoose.model('Screen')
  , welcome = require('./lib/controllers/welcome')
  , dashboard = require('./lib/controllers/dashboard')
  , apiWeb = require('./lib/controllers/apiWeb')
  , api = require('./lib/controllers/api')
  , users = require('./lib/controllers/users')
  , http = require('http')
  , path = require('path')
  , qt = require('quickthumb')
  , engine = require('ejs-locals')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , mailer = require('express-mailer')
  , config = require('./lib/config/config')
  , app = express();

app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'ejs');
app.use('/public/uploads/', qt.static(__dirname + '/public/uploads'));
app.use(express.favicon());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/uploads" }));
app.use(expressValidator);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.cookieSession({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// Helpers

app.use(function(req, res, next){
  res.locals.userIsAuthenticated = req.isAuthenticated(); // check for user authentication
  res.locals.user = req.user; // make user available in all views
  app.locals.layoutPath = "../shared/layout";
  app.locals.layoutPathLogged = "../shared/layout_logged";
  next();
});

// Mailer Setup

mailer.extend(app, {
  from: 'no-reply@screensds.com',
  host: 'smtp.mandrillapp.com', // hostname
  // secureConnection: true, // use SSL
  port: 587, // port for Mandrill
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: config[app.get('env')].MANDRILL_USERNAME,
    pass: config[app.get('env')].MANDRILL_API_KEY
  }
});

// Routing Initializers

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Error Handling

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} else {
  app.use(function(err, req, res, next) {
    res.render('errors/500', { status: 500 });
  });
}

// Database Connection

if ('development' == app.get('env')) {
  mongoose.connect('mongodb://localhost/screenImpact');
} else {
  // insert db connection for production
}

// Authentication
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username, active: 1 }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Are you sure this user is active?" });
      user.validPassword(password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch) return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) return next();
  var postAuthDestination = req.url;
  res.redirect('/login?postAuthDestination='+postAuthDestination);
}

function redirectAuthenticated(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  next();
}

// Routing

app.get('/', welcome.index);
app.get('/login', redirectAuthenticated, users.login);
app.get('/activate_user', redirectAuthenticated, users.process_activate);
app.post('/login', redirectAuthenticated, users.authenticate);
app.get('/register', redirectAuthenticated, users.register);
app.post('/register', redirectAuthenticated, users.userValidations, users.create);
app.get('/dashboard', ensureAuthenticated, dashboard.index);
app.get('/assets', ensureAuthenticated, dashboard.assets);
app.get('/playlist', ensureAuthenticated, dashboard.playlist);
app.get('/screens', ensureAuthenticated, dashboard.screens);
app.get('/groups', ensureAuthenticated, dashboard.groups);
app.get('/audience', ensureAuthenticated, dashboard.statistics);
app.get('/new_playlist', ensureAuthenticated, dashboard.newPlaylist);
app.get('/new_group', ensureAuthenticated, dashboard.newGroup);
app.get('/new_screen', ensureAuthenticated, dashboard.newScreen);
app.get('/logout', users.logout);
app.post('/upload', dashboard.upload);

app.get('/apiWeb/assets', apiWeb.assets);
app.get('/apiWeb/playLists', apiWeb.playLists);
app.get('/apiWeb/screens', apiWeb.screens);
app.get('/apiWeb/groups', apiWeb.groups);
app.get('/apiWeb/userCuota', apiWeb.userCuota);
app.post('/apiWeb/playlistDelete', apiWeb.playlistDelete);
app.post('/apiWeb/groupDelete', apiWeb.groupDelete);
app.post('/apiWeb/screenDelete', apiWeb.screenDelete);
app.post('/apiWeb/assetsDelete', apiWeb.assetsDelete);
app.post('/apiWeb/new_playlist', apiWeb.newPlaylist);
app.post('/apiWeb/new_group', apiWeb.newGroup);
app.post('/apiWeb/edit_playlist', apiWeb.editPlaylist);
app.post('/apiWeb/edit_group', apiWeb.editGroup);
app.post('/apiWeb/add_screen', apiWeb.active_screen);


app.post('/api/new_screen', api.new_screen);
app.post('/api/playlist', api.get_playlist);


app.all('*',redirectAuthenticated, welcome.not_found);

// Start Server w/ DB Connection

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});