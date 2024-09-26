const express = require("express");
const eventController = require("../controllers/eventController");
const exportController = require("../controllers/exportController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
	.route("/")
	.get(eventController.getEvents)
	.post(eventController.createEvent);

router
	.route("/:id")
	.patch(eventController.updateEvent)
	.delete(eventController.deleteEvent);

router.post("/:id/share", eventController.shareEvent);
router.get("/shared", eventController.getSharedEvents);

router.get("/combined", eventController.getEventsAndTodos);

// New export routes
router.get("/export", exportController.exportCalendar);
router.get("/:id/export", exportController.exportEvent);

// New reminder route
router.post("/:id/reminders", eventController.setReminders);

// New conversion route
router.post("/:id/convert-to-todo", eventController.convertToTodo);

// New category assignment route
router.patch("/:id/assign-category", eventController.assignCategoryToSharedEvent);

module.exports = router;
