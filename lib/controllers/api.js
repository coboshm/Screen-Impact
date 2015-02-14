var   mongoose = require('mongoose')
    , Screen = mongoose.model('Screen')
    , logger = require('../logger/logger.js')
    , randtoken = require('rand-token');

var log = logger.logger;


// Get assets
exports.new_screen = function(req, res){
   var newScreen = new Screen();
   newScreen.save(function(err, screen){
       if (err) res.json('He have some error please, reboot your screen');
       return res.json(screen._id);
   });
};
