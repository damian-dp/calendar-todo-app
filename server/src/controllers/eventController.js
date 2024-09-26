const Event = require("../models/Event");
const Todo = require("../models/Todo");
const RRule = require("rrule");
const reminderController = require('./reminderController');
const Category = require('../models/Category');

exports.createEvent = async (req, res) => {
	try {
		const newEvent = new Event({
			...req.body,
			owner: req.user._id,
			user: req.user._id
		});
		if (req.body.category) {
			const category = await Category.findOne({ _id: req.body.category, user: req.user._id });
			if (!category) {
				return res.status(400).json({
					status: 'fail',
					message: 'Invalid category'
				});
			}
		}
		await newEvent.save();
		await reminderController.scheduleReminders(newEvent);
		res.status(201).json({
			status: "success",
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

exports.getEvents = async (req, res) => {
	try {
		const { start, end } = req.query;
		const ownEvents = await Event.find({
			owner: req.user._id,
			$or: [
				{ start: { $gte: new Date(start), $lte: new Date(end) } },
				{ end: { $gte: new Date(start), $lte: new Date(end) } },
				{ rrule: { $exists: true } },
			],
		}).populate('category');

		const sharedEvents = await Event.find({
			'shared.user': req.user._id,
			$or: [
				{ start: { $gte: new Date(start), $lte: new Date(end) } },
				{ end: { $gte: new Date(start), $lte: new Date(end) } },
				{ rrule: { $exists: true } },
			],
		}).populate('owner', 'name email').populate('category');

		const allEvents = [...ownEvents, ...sharedEvents];

		const expandedEvents = allEvents.flatMap((event) => {
			if (event.rrule) {
				const rule = RRule.fromString(event.rrule);
				const occurrences = rule.between(new Date(start), new Date(end));
				return occurrences.map((date) => ({
					...event.toObject(),
					start: date,
					end: new Date(date.getTime() + (event.end - event.start)),
				}));
			}
			return event;
		});

		res.status(200).json({
			status: "success",
			data: {
				events: expandedEvents,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.updateEvent = async (req, res) => {
	try {
		const event = await Event.findOneAndUpdate(
			{ _id: req.params.id, user: req.user._id },
			req.body,
			{ new: true, runValidators: true }
		);
		if (!event) {
			return res.status(404).json({
				status: "fail",
				message: "No event found with that ID",
			});
		}
		if (req.body.category) {
			const category = await Category.findOne({ _id: req.body.category, user: req.user._id });
			if (!category) {
				return res.status(400).json({
					status: 'fail',
					message: 'Invalid category'
				});
			}
		}
		await reminderController.scheduleReminders(event);
		res.status(200).json({
			status: "success",
			data: {
				event,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.deleteEvent = async (req, res) => {
	try {
		const event = await Event.findOneAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});
		if (!event) {
			return res.status(404).json({
				status: "fail",
				message: "No event found with that ID",
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

exports.getEventsAndTodos = async (req, res) => {
	try {
		const { start, end } = req.query;
		const startDate = new Date(start);
		const endDate = new Date(end);

		const events = await Event.find({
			user: req.user._id,
			$or: [
				{ start: { $gte: startDate, $lte: endDate } },
				{ end: { $gte: startDate, $lte: endDate } },
				{ rrule: { $exists: true } },
			],
		}).populate('category');

		const todos = await Todo.find({
			user: req.user._id,
			dueDate: { $gte: startDate, $lte: endDate },
		});

		const expandedEvents = events.flatMap((event) => {
			if (event.rrule) {
				const rule = RRule.fromString(event.rrule);
				const occurrences = rule.between(startDate, endDate);
				return occurrences.map((date) => ({
					...event.toObject(),
					start: date,
					end: new Date(date.getTime() + (event.end - event.start)),
					type: 'event'
				}));
			}
			return { ...event.toObject(), type: 'event' };
		});

		const formattedTodos = todos.map(todo => ({
			...todo.toObject(),
			type: 'todo',
			start: todo.dueDate,
			end: todo.isAllDay ? new Date(todo.dueDate.setHours(23, 59, 59, 999)) : todo.dueDate,
			allDay: todo.isAllDay
		}));

		const combinedItems = [...expandedEvents, ...formattedTodos].sort((a, b) => a.start - b.start);

		res.status(200).json({
			status: "success",
			data: {
				items: combinedItems,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.shareEvent = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId, permission } = req.body;

		const event = await Event.findOne({ _id: id, owner: req.user._id });
		if (!event) {
			return res.status(404).json({
				status: "fail",
				message: "Event not found or you don't have permission to share it"
			});
		}

		const userToShare = await User.findById(userId);
		if (!userToShare) {
			return res.status(404).json({
				status: "fail",
				message: "User to share with not found"
			});
		}

		const existingShare = event.shared.find(share => share.user.toString() === userId);
		if (existingShare) {
			existingShare.permission = permission;
		} else {
			event.shared.push({ user: userId, permission });
		}

		await event.save();

		res.status(200).json({
			status: "success",
			message: "Event shared successfully"
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message
		});
	}
};

exports.getSharedEvents = async (req, res) => {
	try {
		const sharedEvents = await Event.find({ 'shared.user': req.user._id })
			.populate('owner', 'name email');

		res.status(200).json({
			status: "success",
			data: {
				events: sharedEvents
			}
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message
		});
	}
};

exports.convertToTodo = async (req, res) => {
	try {
		const { id } = req.params;
		const { action, createMultiple } = req.body; // action can be 'convert' or 'copy'

		const event = await Event.findOne({ _id: id, $or: [{ user: req.user._id }, { 'shared.user': req.user._id }] });
		if (!event) {
			return res.status(404).json({
				status: "fail",
				message: "Event not found",
			});
		}

		// Check if the event is shared and the user is not the owner
		const isSharedEvent = event.owner.toString() !== req.user._id.toString();

		if (isSharedEvent && action === 'convert') {
			return res.status(403).json({
				status: "fail",
				message: "Shared events can only be copied, not converted",
			});
		}

		let todos = [];

		if (event.rrule && createMultiple) {
			// Handle recurring events
			const rule = RRule.fromString(event.rrule);
			const occurrences = rule.all().slice(0, 10); // Limit to 10 occurrences
			todos = occurrences.map((date) => ({
				title: event.title,
				description: event.description,
				dueDate: date,
				isAllDay: event.allDay,
				category: 'Converted from Event',
				user: req.user._id,
			}));
		} else {
			// Handle single event
			todos = [{
				title: event.title,
				description: event.description,
				dueDate: event.start,
				isAllDay: event.allDay,
				category: 'Converted from Event',
				user: req.user._id,
			}];
		}

		const createdTodos = await Todo.insertMany(todos);

		if (action === 'convert' && !isSharedEvent) {
			await Event.findByIdAndDelete(id);
		}

		res.status(200).json({
			status: "success",
			message: `Event ${action === 'convert' && !isSharedEvent ? 'converted to' : 'copied as'} todo(s)`,
			data: {
				todos: createdTodos,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.assignCategoryToSharedEvent = async (req, res) => {
	try {
		const { id } = req.params;
		const { categoryId } = req.body;

		const event = await Event.findOne({ 
			_id: id, 
			$or: [{ user: req.user._id }, { 'shared.user': req.user._id }] 
		});

		if (!event) {
			return res.status(404).json({
				status: 'fail',
				message: 'Event not found'
			});
		}

		const category = await Category.findOne({ _id: categoryId, user: req.user._id });
		if (!category) {
			return res.status(400).json({
				status: 'fail',
				message: 'Invalid category'
			});
		}

		if (event.user.toString() === req.user._id.toString()) {
			event.category = category._id;
		} else {
			// For shared events, store the category in the shared array
			const sharedIndex = event.shared.findIndex(s => s.user.toString() === req.user._id.toString());
			if (sharedIndex !== -1) {
				event.shared[sharedIndex].category = category._id;
			}
		}

		await event.save();

		res.status(200).json({
			status: 'success',
			message: 'Category assigned successfully'
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
};

exports.setReminders = async (req, res) => {
	try {
		// Implementation here
		res.status(200).json({
			status: 'success',
			message: 'Reminders set successfully'
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
};
