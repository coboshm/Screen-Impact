var   mongoose = require('mongoose')
    , User = mongoose.model('User');

// Get dashboard
exports.assets = function(req, res){
    User.findById(req.user.id, function (err, user) {
        return res.json(user.assets);
    });
}
