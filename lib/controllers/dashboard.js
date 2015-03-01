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

// Get assets
exports.assets = function(req, res){
   res.render('dashboard/assets', {active: 5});
}

// Get playlist
exports.playlist = function(req, res){
    res.render('dashboard/playlist', {active: 4});
}

// Get screens
exports.screens = function(req, res){
    res.render('dashboard/screens', {active: 3});
}

// Get groups
exports.groups = function(req, res){
    res.render('dashboard/groups', {active: 7});
}

// Get playlist
exports.newScreen = function(req, res){
    res.render('dashboard/new_screen', {active: 3});
}


// Get statistics
exports.statistics = function(req, res){
    res.render('dashboard/statistics', {active: 2});
}

//New playlist
exports.newPlaylist = function(req, res){
    res.render('dashboard/new_playlist', {active: 4});
}

//New group
exports.newGroup = function(req, res){
    res.render('dashboard/new_group', {active: 7});
}

// Get dashboard
exports.upload = function(req, res){
    type = req.files.file.type.split('/')[0];
    new_name = req.files.file.path.split('/');
    new_name = new_name[new_name.length-1];

    if (type === 'image') {
            User.findById(req.user.id, function (err, user) {
                if (user.cuota >= user.cuota_used + req.files.file.size) {
                    user.assets.push({
                        path: '/uploads/' + new_name,
                        tipo: req.files.file.type,
                        duration: 0,
                        thumbnail: '/uploads/' + new_name,
                        size: req.files.file.size,
                        name: req.files.file.name
                    })
                    user.cuota_used = user.cuota_used + req.files.file.size;
                    user.save();
                    res.status(200).send('OK')
                } else {
                    res.status(400).send('No cuota');
                }
            });
    } else {
        new_name_thumb = new_name.split('.')[0];
        ffmpeg(req.files.file.path)
            .on('end', function() {
                ffmpeg.ffprobe(req.files.file.path, function (err, metadata) {
                    User.findById(req.user.id, function (err, user) {
                        if (user.cuota >= user.cuota_used + req.files.file.size) {
                            user.assets.push({
                                path: '/uploads/' + new_name,
                                tipo: req.files.file.type,
                                duration: metadata.format.duration,
                                size: metadata.format.size,
                                name: req.files.file.name,
                                thumbnail: '/uploads/thumbnails/thumbnail_' + new_name_thumb + '.png'
                            })
                            user.cuota_used = user.cuota_used + req.files.file.size;
                            user.save();
                            res.status(200).send('OK')
                        } else {
                            res.status(400).send('No cuota');
                        }
                    });
                });
            })
            .screenshots({
                count: 1,
                folder: __dirname + '/../../public/uploads/thumbnails/',
                filename: 'thumbnail_'+ new_name_thumb + '.png',
                size: '200x150'
            });

    }
}
