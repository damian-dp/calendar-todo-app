const Event = require("../models/Event");
const Todo = require("../models/Todo");

exports.search = async (req, res) => {
	try {
		const { query } = req.query;
		const userId = req.user._id;

		const events = await Event.find({
			user: userId,
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } }
			]
		}).limit(5);

		const todos = await Todo.find({
			user: userId,
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } }
			]
		}).limit(5);

		res.status(200).json({
			status: 'success',
			results: [
				...events.map(event => ({ ...event.toObject(), type: 'event' })),
				...todos.map(todo => ({ ...todo.toObject(), type: 'todo' }))
			]
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error.message
		});
	}
};
