const ical = require("ical-generator");
const Event = require("../models/Event");

exports.exportEvent = async (req, res) => {
	try {
		const event = await Event.findOne({
			_id: req.params.id,
			user: req.user._id,
		});
		if (!event) {
			return res.status(404).json({
				status: "fail",
				message: "Event not found",
			});
		}

		const calendar = ical({ name: "My Calendar" });
		addEventToCalendar(calendar, event);

		res.set("Content-Type", "text/calendar; charset=utf-8");
		res.set("Content-Disposition", `attachment; filename="${event.title}.ics"`);
		res.send(calendar.toString());
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.exportCalendar = async (req, res) => {
	try {
		const events = await Event.find({ user: req.user._id });
		const calendar = ical({ name: "My Calendar" });

		events.forEach((event) => addEventToCalendar(calendar, event));

		res.set("Content-Type", "text/calendar; charset=utf-8");
		res.set("Content-Disposition", 'attachment; filename="calendar.ics"');
		res.send(calendar.toString());
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

function addEventToCalendar(calendar, event) {
	const icalEvent = calendar.createEvent({
		start: event.start,
		end: event.end,
		summary: event.title,
		description: event.description,
		location: event.location,
		url: event.url,
	});

	if (event.rrule) {
		icalEvent.repeating(event.rrule);
	}
}
