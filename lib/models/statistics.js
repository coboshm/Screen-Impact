var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var ImpactSchema = new Schema({
    createdAt : { type: Date},
    itemId : {type: String},
    people : {type: Number},
    motion : {type: Number},
    mac : {type: String}
});



module.exports = mongoose.model('Impact', ImpactSchema);