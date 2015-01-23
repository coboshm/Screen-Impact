var ffmpeg = require('fluent-ffmpeg')
    , mongoose = require('mongoose')
    , User = mongoose.model('User');

// Get dashboard
exports.index = function(req, res){
  res.render('dashboard/index', {active: 1});
}

// Handle 404 gracefully
exports.not_found = function(req, res){
  req.flash('error', "That doesn't seem to be a page.");
  res.redirect('dashboard/index', {active: 1});
}

// Get dashboard
exports.assets = function(req, res){
    res.render('dashboard/assets', {active: 5});
}

// Get dashboard
exports.upload = function(req, res){
    ffmpeg.ffprobe(req.files.file.path, function(err, metadata) {
        User.findById(req.user.id, function (err, user) {
            user.assets.push({
                path : '/uploads/' + req.files.file.name,
                tipo : req.files.file.type,
                duration: metadata.format.duration,
                size: metadata.format.size,
                name : req.files.file.name
            })
            user.save();
        });
    });
    res.status(200).send('OK')
}