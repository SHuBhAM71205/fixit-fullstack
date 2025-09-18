const express = require('express')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Request = require('../models/Request/Request');
const Taskmaster = require('../models/Taskmaster/Taskmaster');
const TagStatus = require('../models/Tag/TagStatus')


router.get('/getunasignrequest', fetchuser,
    async (req, res) => {
        try {
            const requests = await Request.find({ taskmaster: null })
                .populate([
                    { path: 'tag' },
                    { path: 'user', select: '-password' },  // optionally exclude password
                    { path: 'status' },
                    { path: 'area' }
                ]) // maintenance type
                .sort({ createdAt: -1 });

            if (!requests) {
                return res.status(400).json({ error: "data not found" });
            }

            res.status(200).json({ requests });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

router.post('/toggleAvablity', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ message: 'Taskmaster not found' });
    }

    taskmaster.isAvailable = !taskmaster.isAvailable;
    await taskmaster.save();

    res.status(200).json({
      message: `Availability toggled to ${taskmaster.isAvailable}`,
      isAvailable: taskmaster.isAvailable
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/completedrequests', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the taskmaster linked to this user
    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ message: 'Taskmaster not found' });
    }

    // Find all requests assigned to this taskmaster that are completed
    const completedStatus = await TagStatus.findOne({ name: 'active' });//dont mis understand active here in the request ative meaans complete while in usere or tm it means actually active
    if (!completedStatus) {
      return res.status(500).json({ message: 'Completed status not found in TagStatus collection' });
    }

    const completedRequests = await Request.find({
      taskmaster: taskmaster._id,
      status: completedStatus._id
    })
    .populate('user', '-password')
    .populate('tag')
    .populate('area')
    .populate('status')
    .sort({ updatedAt: -1 });

    res.status(200).json({ completedRequests });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/summary', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the taskmaster linked to this user
    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ message: 'Taskmaster not found' });
    }

    // Aggregation query to count total, completed, and pending requests
    const summary = await Request.aggregate([
      {
        $match: { taskmaster: taskmaster._id }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $ne: ['$completedAt', null] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$completedAt', null] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          completed: 1,
          pending: 1
        }
      }
    ]);

    // If no requests found, send default 0s
    if (summary.length === 0) {
      return res.status(200).json({ total: 0, completed: 0, pending: 0 });
    }

    res.status(200).json(summary[0]);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// alternate of the above
// router.get('/taskmaster/summary', fetchuser, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const taskmaster = await Taskmaster.findOne({ user: userId });
//     if (!taskmaster) {
//       return res.status(404).json({ message: 'Taskmaster not found' });
//     }

//     // Main summary counts
//     const summary = await Request.aggregate([
//       { $match: { taskmaster: taskmaster._id } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           completed: {
//             $sum: { $cond: [{ $ne: ['$completedAt', null] }, 1, 0] }
//           },
//           pending: {
//             $sum: { $cond: [{ $eq: ['$completedAt', null] }, 1, 0] }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0, total: 1, completed: 1, pending: 1
//         }
//       }
//     ]);

//     // Monthly breakdown for charts (based on createdAt)
//     const monthlyStats = await Request.aggregate([
//       { $match: { taskmaster: taskmaster._id } },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' }
//           },
//           total: { $sum: 1 },
//           completed: {
//             $sum: {
//               $cond: [{ $ne: ['$completedAt', null] }, 1, 0]
//             }
//           },
//           pending: {
//             $sum: {
//               $cond: [{ $eq: ['$completedAt', null] }, 1, 0]
//             }
//           }
//         }
//       },
//       {
//         $sort: { '_id.year': 1, '_id.month': 1 }
//       },
//       {
//         $project: {
//           month: {
//             $concat: [
//               { $toString: '$_id.month' },
//               '/',
//               { $toString: '$_id.year' }
//             ]
//           },
//           total: 1, completed: 1, pending: 1, _id: 0
//         }
//       }
//     ]);

//     res.status(200).json({
//       ...summary[0] || { total: 0, completed: 0, pending: 0 },
//       monthlyStats
//     });

//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

router.post('/acceptrequest/:id', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    // Find Taskmaster by userId
    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ message: 'Taskmaster not found' });
    }

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.taskmaster) {
      return res.status(400).json({ message: 'Request already assigned' });
    }

    // Get "assigned" status ID
    const assignedStatus = await TagStatus.findOne({ name: 'assigned' });
    if (!assignedStatus) {
      return res.status(500).json({ message: 'Assigned status not found in TagStatus' });
    }

    // Update request
    request.taskmaster = taskmaster._id;
    request.status = assignedStatus._id;
    request.updatedAt = new Date();
    await request.save();

    res.status(200).json({ message: 'Request accepted successfully', request });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/getfeedback',fetchuser,async(req,res)=>{
try {
    const userId = req.user.id;
    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ message: 'Taskmaster not found' });
    }

    const requests = await Request.find({ taskmaster: taskmaster._id }).select('_id');
    const requestIds = requests.map(r => r._id);

    const Feedback = require('../models/Request/UserFeedback');
    const feedbacks = await Feedback.find({ request: { $in: requestIds } })
      .populate({
        path: 'request',
        populate: [
          { path: 'user', select: '-password' },
          { path: 'tag' },
          { path: 'area' }
        ]
      });

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/worklist', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    const taskmaster = await Taskmaster.findOne({ user: userId });
    if (!taskmaster) {
      return res.status(404).json({ error: 'Taskmaster not found' });
    }

    const requests = await Request.find({ taskmaster: taskmaster._id })
      .populate('tag')
      .populate('status')
      .populate('area')
      .populate('taskmaster')
      .populate('user', '-password');

      
    res.status(200).json(requests);

  } catch (error) {
    console.error('Error fetching worklist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// to get the hystory of taskmaster,getall request feedback,current tasklist
module.exports = router;