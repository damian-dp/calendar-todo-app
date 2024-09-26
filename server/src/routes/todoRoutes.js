const express = require("express");
const todoController = require("../controllers/todoController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/")
  .get(todoController.getTodos)
  .post(todoController.createTodo);

router.route("/:id")
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

router.post("/:id/convert-to-event", todoController.convertToEvent);

// New route for drag-and-drop functionality
router.patch("/:id/drag-drop", todoController.dragDropTodo);

module.exports = router;
