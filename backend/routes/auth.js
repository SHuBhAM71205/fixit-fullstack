const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User/GeneralUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer')
const TaskmasterApplication = require('../models/Taskmaster/TaskmasterApplication');
const Taskmaster = require('../models/Taskmaster/Taskmaster');
const UAT = require('../models/Taskmaster/UserApplyTaskMaster')
const storage = multer.memoryStorage(); // <- use memory storage
const upload = multer({ storage });

router.post('/createuser',
    [
        body('fname').exists().withMessage('requie fname'),

        body('lname').exists().withMessage('requie lname'),

        body('area').exists().withMessage('requie area'),

        body('role').exists().withMessage('requie role'),

        body('contact').matches(/^[0-9]{10}$/).withMessage('invalid contactno'),

        body('email').isEmail().withMessage('Invalid email'),

        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPass;
        const user = null;
        try {
            const user = new User(req.body);
            await user.save();
            return res.status(201).json({ message: 'User created successfully', user });

        } catch (error) {
            console.error('Error creating user:', error.message);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });

router.post('/login', [
    body('email').isEmail().withMessage('email required'),
    body('password').exists().isLength({ min: 5 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await User.findOne({ email })
            .populate('area')
            .populate('role');

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // If role is taskmaster, check isVerified
        if (user.role.name === 'taskmaster') {
            const Tm = await Taskmaster.findOne({ user: user._id });
            if (!Tm || Tm.isVerified !== true) {
                return res.status(400).json({ message: "Taskmaster not verified" });
            }
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        jwt.sign(
            { user: { id: user._id } },
            JWT_SECRET,
            (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Error generating token', error: err.message });
                }
                res.header('auth-token', token);
                const userObj = user.toObject();
                delete userObj.password;
                res.status(200).json({
                    message: 'Login successful',
                    user: userObj
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/getuser', fetchuser, async (req, res) => {
    try {

        const id = req.user.id;
        // Get the user ID from the request object
        const user = await User.findById(id).select("-password");
        res.status(200).json({
            message: 'User details fetched successfully',
            user: user
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/applytaskmaster', upload.single('document'), async (req, res) => {
    try {
        const {
            addhar,
            tag,
            email
        } = req.body;

        const file = req.file;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status('400').json({ 'message': 'user dont exist create user' })
        }

        if (!file || file.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: "Only PDF document required." });
        }

        const application = new TaskmasterApplication({
            Adhaar_no: addhar,
            maintenance_tag: tag,
            document_pdf: file.buffer
        });

        await application.save();

        const Taskm = new Taskmaster({
            user: user._id,
            application: application._id,
            maintenance_tag: tag
        })
        await Taskm.save();

        const Uat = new UAT({
            taskmaster: Taskmaster._id,
            application: application._id
        })

        await Uat.save();

        res.status(201).json({
            message: "Application submitted successfully",
            id: application._id
        });

    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;