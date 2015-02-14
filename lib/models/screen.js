var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var ScreenSchema = new Schema({
  createdAt : { type: Date, default: Date.now },
  active : {type: Number, default: 0}
});



module.exports = mongoose.model('Screen', ScreenSchema);