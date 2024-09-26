const Event = require('../models/Event');

exports.getInvites = async (req, res) => {
    try {
        const invites = await Event.find({
            'shared.user': req.user._id,
            'shared.status': 'pending'
        }).populate('owner', 'email');

        res.status(200).json({
            status: 'success',
            data: invites
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.acceptInvite = async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            {
                _id: req.params.id,
                'shared.user': req.user._id,
                'shared.status': 'pending'
            },
            {
                $set: { 'shared.$.status': 'accepted' }
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invite not found or already processed'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Invite accepted'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.declineInvite = async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            {
                _id: req.params.id,
                'shared.user': req.user._id,
                'shared.status': 'pending'
            },
            {
                $pull: { shared: { user: req.user._id } }
            }
        );

        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invite not found or already processed'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Invite declined'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};