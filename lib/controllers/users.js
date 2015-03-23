var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , passport = require('passport');


// Get login page
exports.login = function(req, res){
  res.render('users/login', {error: false});
}


// Authenticate user
exports.authenticate = function(req, res, next) {
  passport.authenticate('local', { badRequestMessage: 'Incorrect User & Password' }, function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.render('welcome/index', {error: true, error_msg: info.message});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(req.body.postAuthDestination ? req.body.postAuthDestination : '/dashboard');
    });
  })(req, res, next);
}

// Get registration page
exports.register = function(req, res){
  res.render('users/new', {done: false, user: new User({}), error: false});
}

// Log user out and redirect to home page
exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
}


// Create user
exports.create = function(req, res, next){
  var newUser = new User(req.body);
  newUser.save(function(err, user){
    
    // Uniqueness and save validations
    if (err && err.code == 11000){
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      return res.render('users/new', {done: false, user : newUser, error: true, error_msg: "That " + duplicatedAttribute + " is already in use.", active : 'register'});
    }
    if(err) return next(err);
    
    // New user created successfully, activated
      res.mailer.send('mailer/activate_user', {
          to: newUser.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
          subject: 'Registration Mail - Screens Impact Measure', // REQUIRED.
          username: user.username,
          token: user._id,
          urlBase: "http://"+req.headers.host+"/activate_user"
      }, function (err) {
          if (err) next(err);
          return res.render('users/new', {done: true, user: new User({}), error: false});
      });

  });
}

// Validations for user objects upon user update or create
exports.userValidations = function(req, res, next){
  var creatingUser = req.url == "/register";
  var updatingUser = !creatingUser; // only to improve readability
  req.assert('email', 'You must provide an email address.').notEmpty();
  req.assert('firstName', 'First Name is required.').notEmpty();
  req.assert('lastName', 'Last Name is required.').notEmpty();
  req.assert('email', 'Your email address must be valid.').isEmail();
  req.assert('username', 'Username is required.').notEmpty();
  if(creatingUser || (updatingUser && req.body.password)){
    req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
  }
  var validationErrors = req.validationErrors() || [];
  if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0){

    // Create handling if errors present
    if (creatingUser) return res.render('users/new', {done: false, user : new User(req.body), error: true, error_msg: 'Error creating user', active : 'register'});
    // Update handling if errors present
    else return res.redirect("/account");
  } else next();
}


exports.process_activate = function(req, res, next){
    User.findById(req.query.token, function(err, user) {
        if (err) {
            next(err);
        } else {
            user.active = 1;
            user.save();
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/dashboard');
            });
        }
    });
}