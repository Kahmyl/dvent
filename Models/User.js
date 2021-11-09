import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required:true},
    date: { type: Date }
});

UserSchema.pre('save', function(next){
    let now = new Date();
    if ( !this.date ) {
      this.date = now;
    }
    next();
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });

});


const User = mongoose.model('User', UserSchema);

export default User