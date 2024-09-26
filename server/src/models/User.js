const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	themePreference: {
		type: String,
		enum: ['auto', 'light', 'dark'],
		default: 'auto'
	}
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
