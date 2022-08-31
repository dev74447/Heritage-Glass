const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//in our model we dont need to add usename or pasword cause
// this plugin add them to our model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
