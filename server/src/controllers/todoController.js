const Todo = require("../models/Todo");
const Category = require("../models/Category");

exports.createTodo = async (req, res) => {
	try {
		const { category, ...todoData } = req.body;
		
		if (category) {
			const existingCategory = await Category.findOne({ _id: category, user: req.user._id });
			if (!existingCategory) {
				return res.status(400).json({
					status: "fail",
					message: "Invalid category",
				});
			}
		}

		const newTodo = new Todo({
			...todoData,
			category,
			user: req.user._id,
		});
		await newTodo.save();
		res.status(201).json({
			status: "success",
			data: {
				todo: newTodo,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.getTodos = async (req, res) => {
	try {
		const { sort, filter, category } = req.query;
		let query = { user: req.user._id };

		// Apply filters
		if (filter) {
			switch (filter) {
				case 'completed':
					query.completed = true;
					break;
				case 'incomplete':
					query.completed = false;
					break;
				case 'high':
				case 'medium':
				case 'low':
					query.priority = filter;
					break;
			}
		}

		if (category) {
			query.category = category;
		}

		// Create the base query
		let todosQuery = Todo.find(query);

		// Apply sorting
		if (sort) {
			switch (sort) {
				case 'dueDate':
					todosQuery = todosQuery.sort({ dueDate: 1, title: 1 });
					break;
				case 'priority':
					todosQuery = todosQuery.sort({ priority: -1, dueDate: 1, title: 1 });
					break;
				case 'title':
					todosQuery = todosQuery.sort({ title: 1 });
					break;
				default:
					todosQuery = todosQuery.sort({ createdAt: -1 });
			}
		} else {
			// Default sort
			todosQuery = todosQuery.sort({ createdAt: -1 });
		}

		const todos = await todosQuery.populate('category');

		// Separate todos with no due date
		const todosWithDueDate = todos.filter(todo => todo.dueDate);
		const todosWithoutDueDate = todos.filter(todo => !todo.dueDate);

		res.status(200).json({
			status: "success",
			data: {
				todos: [...todosWithDueDate, ...todosWithoutDueDate],
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.updateTodo = async (req, res) => {
	try {
		if (req.body.category) {
			const existingCategory = await Category.findOne({ _id: req.body.category, user: req.user._id });
			if (!existingCategory) {
				return res.status(400).json({
					status: "fail",
					message: "Invalid category",
				});
			}
		}

		const todo = await Todo.findOneAndUpdate(
			{ _id: req.params.id, user: req.user._id },
			req.body,
				{ new: true, runValidators: true }
		).populate('category');

		if (!todo) {
			return res.status(404).json({
				status: "fail",
				message: "No todo found with that ID",
			});
		}
		res.status(200).json({
			status: "success",
			data: {
				todo,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.deleteTodo = async (req, res) => {
	try {
		const todo = await Todo.findOneAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});
		if (!todo) {
			return res.status(404).json({
				status: "fail",
				message: "No todo found with that ID",
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

exports.convertToEvent = async (req, res) => {
	try {
		const { id } = req.params;
		const { action } = req.body; // action can be 'convert' or 'copy'

		const todo = await Todo.findOne({ _id: id, user: req.user._id });
		if (!todo) {
			return res.status(404).json({
				status: "fail",
				message: "Todo not found",
			});
		}

		const eventEnd = todo.isAllDay 
			? new Date(todo.dueDate.setHours(23, 59, 59, 999))
			: new Date(todo.dueDate.getTime() + 60 * 60 * 1000); // 1 hour duration

		const newEvent = new Event({
			title: todo.title,
			description: todo.description,
			start: todo.dueDate,
			end: eventEnd,
			allDay: todo.isAllDay,
			user: req.user._id,
			owner: req.user._id,
		});

		await newEvent.save();

		if (action === 'convert') {
			await Todo.findByIdAndDelete(id);
		}

		res.status(200).json({
			status: "success",
			message: `Todo ${action === 'convert' ? 'converted to' : 'copied as'} event`,
			data: {
				event: newEvent,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.dragDropTodo = async (req, res) => {
	try {
		const { id } = req.params;
		const { dueDate, isAllDay } = req.body;

		const todo = await Todo.findOne({ _id: id, user: req.user._id });
		if (!todo) {
			return res.status(404).json({
				status: "fail",
				message: "Todo not found",
			});
		}

		todo.dueDate = new Date(dueDate);
		todo.isAllDay = isAllDay;

		if (isAllDay) {
			// Set time to start of day
			todo.dueDate.setHours(0, 0, 0, 0);
		} else {
			// If not all day, assume it's a 1-hour event
			todo.dueDate.setHours(todo.dueDate.getHours(), 0, 0, 0);
		}

		await todo.save();

		res.status(200).json({
			status: "success",
			data: {
				todo,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};
