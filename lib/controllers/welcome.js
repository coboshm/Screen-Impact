// Get homepage
exports.index = function(req, res){
  res.render('welcome/index', {active: 'home', error: false, username:'', password:''});
}

// Handle 404 gracefully
exports.not_found = function(req, res){
  res.redirect('/');
}