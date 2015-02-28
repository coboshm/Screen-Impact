var   mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Screen = mongoose.model('Screen')
    , fs = require('fs')
    , logger = require('../logger/logger.js');

var log = logger.logger;


// Get assets
exports.assets = function(req, res){
    User.findById(req.user.id, function (err, user) {
        return res.json(user.assets);
    });
};

exports.userCuota = function(req, res){
    User.findById(req.user.id, function (err, user) {
        cuota = {
                cuota_used : user.cuota_used,
                cuota : user.cuota
            };
        return res.json(cuota);
    });
};

exports.assetsDelete = function(req, res){
    User.findById(req.user.id, function (err, user) {
        fs.unlink(__dirname + '/../../public'+ user.assets.id(req.body.asset._id).path, function (err) {
            tipo = user.assets.id(req.body.asset._id).tipo.split('/')[0];
            if (tipo == 'image') {
                user.cuota_used = user.cuota_used - user.assets.id(req.body.asset._id).size;
                user.assets.id(req.body.asset._id).remove();
                for (var i = 0; i < user.playLists.length; ++i) {
                    if (user.playLists[i].assets.id(req.body.asset._id) !== null) {
                        user.playLists[i].assets.id(req.body.asset._id).remove();
                    }
                }
                user.save(function (err) {
                    res.status(200).send('OK');
                });
            } else {
                fs.unlink(__dirname + '/../../public' + user.assets.id(req.body.asset._id).thumbnail, function (err) {
                    user.cuota_used = user.cuota_used - user.assets.id(req.body.asset._id).size;
                    user.assets.id(req.body.asset._id).remove();
                    for (var i = 0; i < user.playLists.length; ++i) {
                        if (user.playLists[i].assets.id(req.body.asset._id) !== null) {
                            user.playLists[i].assets.id(req.body.asset._id).remove();
                        }
                    }
                    user.save(function (err) {
                       res.status(200).send('OK');
                    });
                });
            }
        });
    });
};

exports.newPlaylist = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.playLists.push(req.body);
        user.save(function(err) {
            if (err) res.status(500).send(err);
            res.status(200).send('OK')
        });
    });
};

exports.editPlaylist = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.playLists.id(req.body.id).title = req.body.title;
        user.playLists.id(req.body.id).assets = req.body.assets;
        user.playLists.id(req.body.id).from = req.body.from;
        user.playLists.id(req.body.id).to = req.body.to;
        user.save(function(err) {
            if (err) res.status(500).send(err);
            res.status(200).send('OK')
        });
    });
};

// Get playlists
exports.playLists = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        return res.json(user.playLists);
    });
};

exports.playlistDelete = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.playLists.id(req.body.id).remove();
        user.save(function (err) {
            res.status(200).send('OK');
        });
    });
};

exports.active_screen = function(req, res) {
    Screen.findById(req.body.code, function(err, screen) {
        if (screen === null) res.status(500).send('screen not found');
        else {
            screen.active = 1;
            screen.save(function (err) {
                User.findById(req.user.id, function (err, user) {
                    user.screens.push(req.body);
                    user.groups[0].screens.push(req.body);
                    user.save(function (err) {
                        if (err) res.status(500).send(err);
                        res.status(200).send('OK')
                    });
                });
            });
        }
    });
};

// Get screens
exports.screens = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        return res.json(user.screens);
    });
};

// Get groups
exports.groups = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        return res.json(user.groups);
    });
};


// Get group
exports.get_group = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        var x = 0;
        var ret = '';
        console.log(user);
        for (var i = 1; i < user.groups.length; ++i) {
            console.log(user.groups[i].screens.id(req.body.id));
            if (user.groups[i].screens.id(req.body.id) !== null) {
                if (x !== 0) {
                    ret += ', '+user.groups[i].title;
                } else {
                    ret += user.groups[i].title;
                }
                x++;
            }
        }
        if (x !== 0) res.status(200).send(ret);
        else res.status(500);
    });
};
