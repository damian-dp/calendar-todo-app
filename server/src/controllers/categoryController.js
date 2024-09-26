const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
	try {
		const newCategory = new Category({
			...req.body,
			user: req.user._id,
		});
		await newCategory.save();
		res.status(201).json({
			status: "success",
			data: {
				category: newCategory,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.getCategories = async (req, res) => {
	try {
		const categories = await Category.find({ user: req.user._id });
		res.status(200).json({
			status: "success",
			data: {
				categories,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.updateCategory = async (req, res) => {
	try {
		const category = await Category.findOneAndUpdate(
			{ _id: req.params.id, user: req.user._id },
			req.body,
			{ new: true, runValidators: true }
		);
		if (!category) {
			return res.status(404).json({
				status: "fail",
				message: "No category found with that ID",
			});
		}
		res.status(200).json({
			status: "success",
			data: {
				category,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const category = await Category.findOneAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});
		if (!category) {
			return res.status(404).json({
				status: "fail",
				message: "No category found with that ID",
			});
		}
		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};
