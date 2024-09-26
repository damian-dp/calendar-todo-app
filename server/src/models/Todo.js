const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		dueDate: {
			type: Date,
		},
		isAllDay: {
			type: Boolean,
			default: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category'
		},
		completed: {
			type: Boolean,
			default: false,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

todoSchema.pre('save', function(next) {
	if (this.dueDate) {
		this.isAllDay = this.dueDate.getHours() === 0 && this.dueDate.getMinutes() === 0 && this.dueDate.getSeconds() === 0;
	} else {
		this.isAllDay = undefined;
	}
	next();
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
