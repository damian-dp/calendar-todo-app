const Event = require("../models/Event");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const RRule = require("rrule");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

exports.setReminders = async (req, res) => {
	try {
		const { id } = req.params;
		const { times, sendForEachOccurrence } = req.body;

		const event = await Event.findOne({ _id: id, user: req.user._id });
		if (!event) {
			return res
				.status(404)
				.json({ status: "fail", message: "Event not found" });
		}

		event.reminderSettings = { times, sendForEachOccurrence };
		await event.save();

		res
			.status(200)
			.json({ status: "success", message: "Reminders set successfully" });
	} catch (err) {
		res.status(400).json({ status: "fail", message: err.message });
	}
};

exports.processReminders = async () => {
	const now = new Date();
	const events = await Event.find({
		"reminders.time": { $lte: now },
		"reminders.sent": false,
	}).populate("user");

	for (let event of events) {
		for (let reminder of event.reminders.filter(
			(r) => !r.sent && r.time <= now
		)) {
			await sendReminderEmail(event, reminder, event.user);
			reminder.sent = true;
		}
		await event.save();
	}
};

async function sendReminderEmail(event, reminder, user) {
	const mailOptions = {
		from: process.env.EMAIL_USERNAME,
		to: user.email,
		subject: `Reminder: ${event.title}`,
		text: `Don't forget about your event "${
			event.title
		}" starting at ${event.start.toLocaleString()}.`,
	};

	await transporter.sendMail(mailOptions);
}

exports.scheduleReminders = async (event) => {
	event.reminders = [];
	const now = new Date();

	if (event.rrule) {
		const rule = RRule.fromString(event.rrule);
		const occurrences = rule.between(
			now,
			new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
		); // Next 30 days

		for (let occurrence of occurrences) {
			if (
				event.reminderSettings.sendForEachOccurrence ||
				event.reminders.length === 0
			) {
				for (let minutes of event.reminderSettings.times) {
					event.reminders.push({
						time: new Date(occurrence.getTime() - minutes * 60 * 1000),
						sent: false,
					});
				}
			}
		}
	} else {
		for (let minutes of event.reminderSettings.times) {
			event.reminders.push({
				time: new Date(event.start.getTime() - minutes * 60 * 1000),
				sent: false,
			});
		}
	}

	await event.save();
};
