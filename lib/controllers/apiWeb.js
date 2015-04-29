var   mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Screen = mongoose.model('Screen')
    , Impact = mongoose.model('Impact')
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


exports.newGroup = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.groups.push(req.body);
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
        user.playLists.id(req.body.id).groups = req.body.groups;
        user.playLists.id(req.body.id).from = req.body.from;
        user.playLists.id(req.body.id).to = req.body.to;
        user.save(function(err) {
            if (err) res.status(500).send(err);
            res.status(200).send('OK')
        });
    });
};

exports.editGroup = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.groups.id(req.body.id).title = req.body.title;
        user.groups.id(req.body.id).screens = req.body.screens;
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

exports.groupDelete = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        user.groups.id(req.body.id).remove();
        for (var i = 0; i < user.playLists.length; ++i) {
            if (user.playLists[i].groups.id(req.body.id) !== null) {
                user.playLists[i].groups.id(req.body.id).remove();
            }
        }
        user.save(function (err) {
            res.status(200).send('OK');
        });
    });
};

exports.screenDelete = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        for (var i = 0; i < user.groups.length; ++i) {
            for (var j = 0; j < user.groups[i].screens.length; j++ ) {
                if (user.groups[i].screens[j].code === req.body.code) {
                    user.groups[i].screens.id(user.groups[i].screens[j]._id).remove();
                }
            }
        }
        Screen.findById(user.screens.id(req.body.id).code, function(err, screen) {
            now = new Date();
            screen.deletedAt = now;
            screen.save(function (err) {
                user.screens.id(req.body.id).remove();
                user.save(function (err) {
                    res.status(200).send('OK');
                });
            });
        });
    });
};

exports.active_screen = function(req, res) {
    Screen.findById(req.body.code, function(err, screen) {
        if (err) res.status(500).send('Screen not found');
        else {
            screen.active = 1;
            screen.userId = req.user.id;
            screen.save(function (err) {
                User.findById(req.user.id, function (err, user) {
                    user.screens.push({
                        'title': req.body.title,
                        'mac': screen.mac,
                        'code': req.body.code
                    });
                    user.groups[0].screens.push({
                        'title': req.body.title,
                        'mac': screen.mac,
                        'code': req.body.code
                    });
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

exports.data_statistics = function(req, res) {

    var list_mac = [];
    if (req.body.screens.length > 0) {
        for (var i = 0; i < req.body.screens.length; i++) {
            list_mac.push(req.body.screens[i].mac);
        }

        if (req.body.groups.length > 0) {
            var finded = false;
            for (var i = 0; i < req.body.groups.length; i++) {
                aux_group = req.body.groups[i];
                for (var k = 0; k < list_mac.length; k++) {
                    for (var j = 0; j < aux_group.screens.length; j++) {
                        if (aux_group.screens[i].mac == list_mac[k]) {
                            finded = true;
                            break;
                        }
                    }
                    if (!finded) {
                        list_mac.splice(k, 1);
                    }
                    finded = false;
                }
            }
        }

    } else {

        if (req.body.groups.length > 0) {
            for (var i = 0; i < req.body.groups.length; i++) {
                aux_group = req.body.groups[i];
                for (var j = 0; j < aux_group.screens.length; j++) {
                    list_mac.push(aux_group.screens[j].mac);
                }
            }
        }

    }

    var list_assets = [];
    if (req.body.assets.length > 0) {
        for (var i = 0; i < req.body.assets.length; i++) {
            list_assets.push(String(req.body.assets[i]._id));
        }
    }

    if (list_assets.length > 0 && list_mac.length > 0) {
        Impact.find({
            $and: [
                { createdAt: { $gte: req.body.from, $lt: req.body.to}},
                { itemId: {$in: list_assets}},
                { mac: {$in: list_mac}}
            ]
        }, function (err, results) {
            reslt = set_zero_dates(req.body.from, req.body.to, results);
            return res.json(reslt);
        });



    } else if (list_assets.length > 0) {
        Impact.find({
            $and: [
                { createdAt: { $gte: req.body.from, $lt: req.body.to}},
                { itemId: {$in: list_assets}}
            ]
        }, function (err, results) {
            reslt = set_zero_dates(req.body.from, req.body.to, results);
            return res.json(reslt);
        });



    } else if (list_mac.length > 0) {
        Impact.find({
            $and: [
                { createdAt: { $gte: req.body.from, $lt: req.body.to}},
                { mac: {$in: list_mac}}
            ]
        }, function (err, results) {
            reslt = set_zero_dates(req.body.from, req.body.to, results);
            return res.json(reslt);
        });



    }


};


function set_zero_dates(from, to, results) {
    var res = results.slice();

    var date_aux = new Date(from);
    var to_aux = new Date(to);

    var aux = 0;

    if (results.length > 0 ) {
        if (date_aux <= new Date(results[0].createdAt.getTime() - 5000)) {
            res.splice(aux, 0, {
                'createdAt': date_aux,
                'people': 0
            });
            aux++;
            res.splice(aux, 0, {
                'createdAt': new Date(results[0].createdAt.getTime() - 3000),
                'people': 0
            });
            aux++;
        }

        for (var j = 0; j < results.length - 1; ++j) {
            if (j >= 1) {
                if (results[j].createdAt > new Date(results[j - 1].createdAt.getTime() + 5000)) {
                    res.splice(j + aux, 0, {
                        'createdAt': new Date(results[j].createdAt.getTime() - 3000),
                        'people': 0
                    });
                    aux++;
                }

                if (results[j].createdAt < new Date(results[j - 1].createdAt.getTime() + 6000) && results[j].createdAt >= new Date(results[j + 1].createdAt.getTime() - 6000) &&
                    results[j].people == results[j - 1].people && results[j].people == results[j + 1].people) {
                    res.splice(j + aux, 1);
                    aux--;
                }
            }
            if (results[j].createdAt <= new Date(results[j + 1].createdAt.getTime() - 5000)) {
                res.splice(j + 1 + aux, 0, {
                    'createdAt': new Date(results[j].createdAt.getTime() + 3000),
                    'people': 0
                });
                aux++;
            }

        }

        if (results[results.length - 1].createdAt > new Date(results[results.length - 2].createdAt.getTime() + 5000)) {
            res.splice(j + aux, 0, {
                'createdAt': new Date(results[j].createdAt.getTime() - 3000),
                'people': 0
            });
            aux++;
        }

        if ((results[results.length - 1].createdAt.getTime() + 3000) <= to_aux) {
            res.push({
                'createdAt': new Date(results[results.length - 1].createdAt.getTime() + 3000),
                'people': 0
            });
            res.push({
                'createdAt': to_aux,
                'people': 0
            });
        }
    }

    return res;

}