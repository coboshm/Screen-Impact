var   mongoose = require('mongoose')
    , Screen = mongoose.model('Screen')
    , User = mongoose.model('User')
    , logger = require('../logger/logger.js')
    , randtoken = require('rand-token');

var log = logger.logger;


// new screen
exports.new_screen = function(req, res){
   var newScreen = new Screen();
   newScreen.mac = req.body.mac;
   newScreen.save(function(err, screen){
       if (err) res.json('He have some error please, reboot your screen');
       return res.json(screen._id);
   });
};

exports.is_active_screen = function(req , res){
    Screen.findById(req.body.code, function(err, screen){
        res.json(screen.active)
    });
};

exports.set_impact = function(req, res){
    console.log(req.body);
    res.json({});
};


// Get playlist
exports.get_playlist = function(req, res){
    Screen.find({$and:[ {'_id': req.body.code}, {'mac': req.body.mac}]}, function(err, screen){
        if (err) res.json({});
        else {
            User.findById(screen[0].userId, function (err, user) {
                var assets = new Array();
                for (var i = 1; i < user.groups.length; ++i) {
                    if (user.groups[i].screens.id(screen[0]._id) !== null) {
                        for (var j = 0; j < user.playLists.length; ++j) {
                            if (user.playLists[j].groups.id(user.groups[i]._id) !== null) {
                                if (user.playLists[j].from <= Date.now() && user.playLists[j].to >= Date.now()) {
                                    assets.push(user.playLists[j].assets);
                                }
                            }
                        }
                    }
                }
                if (assets.length == 0) {
                    //All the assets of the playlist associet at group 'All screens'
                    for (var i = 1; i < user.playLists.length; ++i) {
                        if (user.playLists[i].groups.id(user.groups[0]._id) !== null) {
                            if (user.playLists[i].from <= Date.now() && user.playLists[i].to >= Date.now()) {
                                assets.push(user.playLists[i].assets);
                            }
                        }
                    }

                    //All the assets of playlist 'all screens'
                    if (assets.length == 0) {
                        assets.push(user.playLists[0].assets);
                    }
                }
                return res.json(assets);
            });
        }
    });
};



