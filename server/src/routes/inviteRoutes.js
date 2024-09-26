const express = require('express');
const inviteController = require('../controllers/inviteController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', inviteController.getInvites);
router.post('/:id/accept', inviteController.acceptInvite);
router.post('/:id/decline', inviteController.declineInvite);

module.exports = router;