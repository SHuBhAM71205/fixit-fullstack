const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer=require('multer')

const fetchuser = require('../middleware/fetchuser');

const User = require('../models/User/GeneralUser');
const Request = require('../models/Request/Request');
const TagMaintenance = require('../models/Tag/TagMaintenance');
const Feedback = require('../models/Request/UserFeedback');
const TagStatus = require('../models/Tag/TagStatus')
const TagArea = require('../models/Tag/TagArea');
const TaskmasterApplication = require('../models/Taskmaster/TaskmasterApplication');
const UserApplyTaskmaste = require('../models/Taskmaster/UserApplyTaskMaster');


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// end to create user
router.get('/gethystory', fetchuser,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const requests = await Request.find({ user: userId })
       .populate('taskmaster').populate('area').populate('tag').populate('status') // maintenance type
        .sort({ createdAt: -1 });

      

      res.status(200).json({requests });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

router.get('/getrequest/:id',fetchuser,async(req,res)=>{
  try {
      const userId = req.params.id;

      const requests = await Request.find({ user: userId })
       .populate('taskmaster').populate('area').populate('tag').populate('status') // maintenance type
        .sort({ createdAt: -1 });
      res.status(200).json({requests });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
})

// end to login user
router.get('/pendingfeedback', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all requests by this user
    const userRequests = await Request.find({ user: userId,status:"683ffa512cba5619ab8e082b" }).select('_id');
    const requestIds = userRequests.map(r => r._id);

    // Find feedbacks with those request IDs
    const feedbacks = await Feedback.find({ request: { $in: requestIds } }).select('request');
    const feedbackRequestIds = new Set(feedbacks.map(fb => fb.request.toString()));

    // Filter out requests which already have feedback
    const pendingRequestIds = requestIds.filter(id => !feedbackRequestIds.has(id.toString()));

    // Get full request documents for pending feedback
    const pendingRequests = await Request.find({ _id: { $in: pendingRequestIds } })
      .populate('tag', 'name') // Assuming tag is ref to TagMaintenance
      .populate('area', 'name') // Assuming area is ref to Area
      .populate('status', 'name') // Assuming status is ref
      .populate('taskmaster', 'name'); // Optional: if assigned

    res.status(200).json({ pending: pendingRequests });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// end to get user data
router.post('/createrequest', fetchuser, [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('tag').notEmpty().withMessage('Maintenance tag is required'),

  body('area').notEmpty().withMessage('Area is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const stat = await TagStatus.findOne({ name: "inactive" })
    const userId = req.user.id;
    const { description, tag, area, taskmaster } = req.body;

    // Validate referenced IDs
    const [tagExists, areaExists] = await Promise.all([
      TagMaintenance.findById(tag),
      TagArea.findById(area)
    ]);

    if (!tagExists) return res.status(400).json({ message: 'Invalid maintenance tag' });
    if (!stat) return res.status(400).json({ message: 'Invalid status' });
    if (!areaExists) return res.status(400).json({ message: 'Invalid area' });

    const newRequest = new Request({
      user: userId,
      description,
      tag,
      status: stat._id,
      area,
      taskmaster: taskmaster || null
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Request created successfully',
      request: newRequest
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/givefeedback/:id', fetchuser,
  [
    body('description').isString().notEmpty().withMessage("discription is req"),
    body('star').isNumeric().notEmpty().withMessage("star is require"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const fdbk = new Feedback(
        {
          request: req.params.id,
          star: req.body.star,
          content: req.body.description
        }

      )

      await fdbk.save()

      res.status(201).json({
        message: 'Feedback created successfully',
        feedback: fdbk
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }

  })

  
router.delete('/deleterequest/:id', fetchuser,
  async (req, res) => {
    try {
      const request = await Request.findByIdAndDelete(req.params.id)


      if (!request) {
        return res.status(400).json({ "msg": "some error has occur" });
      }

      res.status(200).json({ message: ' deleted successfully', request });
    }
    catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);


// Configure multer for file uploads

router.post(
  '/applyfortaskmaster',
  fetchuser,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document_pdf', maxCount: 1 }
  ]),
  [
    body('Adhaar_no', 'Aadhaar number must be 12 digits').isLength({ min: 12, max: 12 }).matches(/^[0-9]{12}$/),
    body('maintenance_tag', 'Maintenance tag is required').notEmpty(),
    body('status', 'Status is required').notEmpty()
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { Adhaar_no, maintenance_tag, status } = req.body;

      // Get uploaded files
      const photo = req.files['photo']?.[0]?.buffer;
      const document_pdf = req.files['document_pdf']?.[0]?.buffer;

      // Create TaskmasterApplication
      const application = new TaskmasterApplication({
        Adhaar_no,
        maintenance_tag,
        status,
        photo,
        document_pdf
      });
      const savedApplication = await application.save();

      // Link to user
      const link = new UserApplyTaskmaste({
        user: req.user.id,
        application: savedApplication._id
      });
      await link.save();

      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: savedApplication._id
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);


module.exports = router;