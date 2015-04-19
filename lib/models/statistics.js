var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var ImpactSchema = new Schema({
    createdAt : { type: Date, default: Date.now },
    itemId : {type: String},
    people : {type: Number}
});



module.exports = mongoose.model('Impact', ScreenSchema);