const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
	allDay: {
		type: Boolean,
		default: false,
	},
	rrule: {
		type: String,
	},
	color: {
		type: String,
		default: "#3498db",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	reminders: [
		{
			time: Date,
			sent: {
				type: Boolean,
				default: false
			}
		}
	],
	shared: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			permission: {
				type: String,
				enum: ['view', 'edit'],
				default: 'view'
			},
			status: {
				type: String,
				enum: ['pending', 'accepted'],
				default: 'pending'
			}
		}
	],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	reminderSettings: {
		sendForEachOccurrence: {
			type: Boolean,
			default: true
		},
		times: [Number] // minutes before event start
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	}
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
