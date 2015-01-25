var   mongoose = require('mongoose')
    , User = mongoose.model('User');

// Get dashboard
exports.assets = function(req, res){
    User.findById(req.user.id, function (err, user) {
        return res.json(user.assets);
    });
}

exports.assetsDelete= function(req, res){
    User.findById(req.user.id, function (err, user) {
        user.cuota_used = user.cuota_used - user.assets.id(req.body.id).size;
        user.assets.id(req.body.id).remove();
        user.save();
        res.status(200).send('OK')
    });
}

