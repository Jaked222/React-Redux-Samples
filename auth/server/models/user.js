const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model
const userSchema = new Schema({
	email: {type: String, unique: true, lowercase: true },
	password: String
});

//on save hook, encrypt password:

// before saving a model, run this function.
userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this; //user.email or user.password would work here

	// generate a salt, then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		// hash (encrypt) our password using salt, then run callback
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			// overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callBack) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {return callBack(err); }

		callBack(null, isMatch);
	});
}
// create model class
const ModelClass = mongoose.model('user', userSchema);

// export model
module.exports = ModelClass;