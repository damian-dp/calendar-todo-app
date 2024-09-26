const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: "Your App <your-email@gmail.com>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
};

exports.signup = async (req, res) => {
	try {
		console.log('Signup attempt:', req.body.email);
		let user = await User.findOne({ email: req.body.email });
		
		if (user) {
			console.log('Existing user found:', user.email, 'Verified:', user.isVerified);
			if (user.isVerified) {
				return res.status(400).json({
					status: "fail",
					message: "Email already in use. Please use a different email or try logging in."
				});
			} else {
				console.log('Updating unverified user');
				user.password = req.body.password;
				user.verificationToken = crypto.randomBytes(32).toString("hex");
			}
		} else {
			console.log('Creating new user');
			user = new User({
				email: req.body.email,
				password: req.body.password,
				verificationToken: crypto.randomBytes(32).toString("hex")
				});
		}

		const savedUser = await user.save();
		console.log('User saved successfully:', savedUser);

		const verificationURL = `${process.env.FRONTEND_URL}/#verify=${user.verificationToken}`;

		await sendEmail({
			email: user.email,
			subject: "Verify your email",
			message: `Please click on this link to verify your email: ${verificationURL}`,
		});
		console.log('Verification email sent');

		res.status(201).json({
			status: "success",
			message: "User created. Please check your email to verify your account."
		});
	} catch (err) {
		console.error('Signup error:', err);
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const user = await User.findOne({ verificationToken: req.params.token });
		if (!user) {
			return res.status(400).json({
				status: "fail",
				message: "Invalid or expired token"
			});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		await user.save({ validateBeforeSave: false });

		console.log(`User ${user.email} verified successfully`);

		// Create a token for the user
		const token = signToken(user._id);

		res.status(200).json({
			status: "success",
			message: "Email verified successfully",
			token,
			isVerified: true
		});
	} catch (err) {
		console.error('Verification error:', err);
		res.status(500).json({
			status: "error",
			message: "An error occurred during email verification"
		});
	}
};

exports.login = async (req, res) => {
	try {
		console.log('Login attempt received');
		const { email, password } = req.body;
		if (!email || !password) {
			console.log('Email or password missing');
			return res.status(400).json({ status: "fail", message: "Please provide email and password" });
		}
		console.log('Finding user');
		const user = await User.findOne({ email }).select("+password");
		if (!user || !(await user.correctPassword(password, user.password))) {
			console.log('Incorrect email or password');
			return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
		}
        
        // Check if the user is verified
        if (!user.isVerified) {
            console.log('User not verified, updating status');
            user.isVerified = true;
            await user.save({ validateBeforeSave: false });
        }

		console.log('Login successful, creating token');
		createSendToken(user, 200, res);
	} catch (err) {
		console.error('Login error:', err);
		res.status(500).json({ status: "error", message: err.message });
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "There is no user with this email address",
			});
		}
		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");
		user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
		await user.save({ validateBeforeSave: false });

		const resetURL = `${req.protocol}://${req.get(
			"host"
		)}/api/users/resetPassword/${resetToken}`;
		await sendEmail({
			email: user.email,
			subject: "Your password reset token (valid for 10 min)",
			message: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}`,
		});

		res.status(200).json({ status: "success", message: "Token sent to email" });
	} catch (err) {
		res.status(500).json({ status: "error", message: err.message });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const hashedToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			return res
				.status(400)
				.json({ status: "fail", message: "Token is invalid or has expired" });
		}
		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		createSendToken(user, 200, res);
	} catch (err) {
		res.status(500).json({ status: "error", message: err.message });
	}
};

exports.updateThemePreference = async (req, res) => {
	try {
		const { themePreference } = req.body;

		if (!["auto", "light", "dark"].includes(themePreference)) {
			return res.status(400).json({
				status: "fail",
				message: "Invalid theme preference",
			});
		}

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ themePreference },
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			status: "success",
			data: {
				themePreference: user.themePreference,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.getThemePreference = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.status(200).json({
			status: "success",
			data: {
				themePreference: user.themePreference,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.protect = async (req, res, next) => {
	try {
		// 1) Get token and check if it exists
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res
				.status(401)
				.json({
					status: "fail",
					message: "You are not logged in! Please log in to get access.",
				});
		}

		// 2) Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// 3) Check if user still exists
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			return res
				.status(401)
				.json({
					status: "fail",
					message: "The user belonging to this token no longer exists.",
				});
		}

		// 4) Check if user changed password after the token was issued
		if (currentUser.changedPasswordAfter(decoded.iat)) {
			return res
				.status(401)
				.json({
					status: "fail",
					message: "User recently changed password! Please log in again.",
				});
		}

		// GRANT ACCESS TO PROTECTED ROUTE
		req.user = currentUser;
		next();
	} catch (err) {
		res
			.status(401)
			.json({ status: "fail", message: "Invalid token. Please log in again!" });
	}
};
