let mongoose = require('mongoose');
let bcrypt = require('bcrypt-node');
let userSchema = new mongoose.Schema({
	username:{type:String, unique:true, required:true},
	password:{type:String, required:true}
})

userSchema.pre('save', function(callback){
	var user = this;

	if (!user.isModified('password')) return callback();

	bcrypt.genSalt(5, (err,salt)=>{
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, (err,hash)=>{
			if (err) return callback(err);
			user.password = hash;
			callback();
		})
	})
})
// It will check if the encrypted password inside out date 
// is an encryption of password sent

//It will not decrypt - > Normally a password that is hashed + salt will take years to be decrypted
userSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) throw callback(err);
        callback(null, isMatch)
    });
}

module.exports = mongoose.model('User',userSchema);