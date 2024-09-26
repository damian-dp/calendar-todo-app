const User = require('../models/User');

exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            status: 'success',
            data: {
                theme: user.themePreference
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { theme } = req.body;
        
        if (!['light', 'dark'].includes(theme)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid theme preference'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { themePreference: theme },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: {
                theme: user.themePreference
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};