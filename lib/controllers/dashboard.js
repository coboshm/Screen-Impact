// Get dashboard
exports.index = function(req, res){
  res.render('dashboard/index', {});
}

// Handle 404 gracefully
exports.not_found = function(req, res){
  req.flash('error', "That doesn't seem to be a page.");
  res.redirect('/');
}

// Get dashboard
exports.assets = function(req, res){
    res.render('dashboard/assets', {});
}

// Get dashboard
exports.upload = function(req, res){
    console.log("file name", req.files.file);

    res.send('Ok', {});
}