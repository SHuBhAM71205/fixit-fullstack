const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const isadmin = require('../middleware/isadmin');

const User = require('../models/User/GeneralUser');
const TagArea = require('../models/Tag/TagArea');
const TagMaintenance = require('../models/Tag/TagMaintenance');
const TagRole = require('../models/Tag/TagRole');
const TagStatus = require('../models/Tag/TagStatus');
const Request = require('../models/Request/Request');
const Taskmaster = require('../models/Taskmaster/Taskmaster');
const Appllic = require('../models/Taskmaster/TaskmasterApplication')
const UAT = require('../models/Taskmaster/UserApplyTaskMaster');

// add tag 

// -------------------- Add Area Tag --------------------
router.post('/addtag/area',
  body('name', 'Area name is required').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const tag = new TagArea({ name });
      await tag.save();
      res.json({ success: true, tag });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// -------------------- Add Maintenance Tag --------------------
router.post('/addtag/maint',
  body('name', 'Maintenance tag is required').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const tag = new TagMaintenance({ name });
      await tag.save();
      res.json({ success: true, tag });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// -------------------- Add Role Tag --------------------
router.post('/addtag/role',
  body('name', 'Role tag is required').trim().notEmpty().isLength({ max: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const tag = new TagRole({ name });
      await tag.save();
      res.json({ success: true, tag });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// -------------------- Add Status Tag --------------------
router.post('/addtag/status',
  body('name', 'Status tag is required').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const tag = new TagStatus({ name });
      await tag.save();
      res.json({ success: true, tag });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// DELETE a tag by ID
router.delete('/deletetag/role/:id', isadmin, async (req, res) => {
  try {
    const deletedTag = await TagRole.findByIdAndDelete(req.params.id); // Or TagArea
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully', tag: deletedTag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deletetag/area/:id', isadmin, async (req, res) => {
  try {
    const deletedTag = await TagArea.findByIdAndDelete(req.params.id); // Or TagArea
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully', tag: deletedTag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deletetag/maint/:id', isadmin, async (req, res) => {
  try {
    const deletedTag = await TagMaintenance.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully', tag: deletedTag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deletetag/status/:id', isadmin, async (req, res) => {
  try {
    const deletedTag = await TagStatus.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully', tag: deletedTag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/viewusers', isadmin, async (req, res) => {
  try {
    const users = await User.find().populate('area').populate('role').select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deleteuser/:id', isadmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', user: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/updateuserrole/:id', isadmin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/viewusers', isadmin, async (req, res) => {
  try {
    const { search, role, area } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { fname: { $regex: search, $options: 'i' } },
        { lname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (area) query.area = area;

    const users = await User.find(query).populate('role').populate('area').select('-password');
    res.status(200).json({ users });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/viewrequests', async (req, res) => {
  try {
    const { status, user, area } = req.query;
    let query = {};

    if (status) query.status = status;
    if (area) query.area = area;

    // For user search, perform a lookup after fetching
    let requests = await Request.find(query)
      .populate('user', 'fname lname email')
      .populate('taskmaster',)
      .populate('area')
      .populate('status')
      .populate('tag')
      .sort({ createdAt: -1 });

    if (user) {
      const search = user.toLowerCase();
      requests = requests.filter(req =>
        req.user?.fname?.toLowerCase().includes(search) ||
        req.user?.lname?.toLowerCase().includes(search) ||
        req.user?.email?.toLowerCase().includes(search)
      );
    }

    res.status(200).json({ requests });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/makeusertaskmaster/:id/:status', isadmin, async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.params.id;
    if (!userId || !status) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!status) {
      const UAT = await UserApplyTaskMaster.findOne({ user: req.status.id })
      if (UAT) {
        const application = await Appllic.findByIdAndDelete(UAT.application);
        UAT.status = false;
        await UAT.save();
      }
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = await Taskmaster.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: 'User is already a Taskmaster' });
    }

    const newTaskmaster = new Taskmaster({ user: userId, available: false, isVerified: true });
    await newTaskmaster.save();

    res.status(201).json({
      message: 'User promoted to Taskmaster successfully',
      taskmaster: newTaskmaster
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/showuserapplytaskmaster', isadmin, async (req, res) => {
  try {
    const uatFinal = await Taskmaster
      .find({ isVerified: false })
      .populate('user').populate('application');

    res.status(200).json({
      message: 'Fetched all user applications for taskmaster',
      applications: uatFinal
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/stats', isadmin, async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const totalUsers = await User.countDocuments();
    const totalRequests = await Request.countDocuments();

    const pendingStatusTag = await TagStatus.findOne({ name: /inactive/i });
    let pendingCount = 0;

    if (pendingStatusTag) {
      pendingCount = await Request.countDocuments({ status: pendingStatusTag._id });
    }

    const monthlyRequests = await Request.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const monthlyPending = await Request.aggregate([
      {
        $match: pendingStatusTag
          ? { status: pendingStatusTag._id, createdAt: { $gte: startOfYear } }
          : { createdAt: { $gte: startOfYear } }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          pending: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // Build cumulative user count
    const monthlyTotalUsers = [];
    let runningTotal = 0;
    for (let i = 1; i <= 12; i++) {
      const found = usersByMonth.find(u => u._id.month === i);
      if (found) runningTotal += found.count;
      monthlyTotalUsers.push({ month: i, totalUsers: runningTotal });
    }

    // Combine all monthly stats
    const result = [];
    for (let i = 1; i <= 12; i++) {
      const totalObj = monthlyRequests.find(m => m._id.month === i);
      const pendingObj = monthlyPending.find(m => m._id.month === i);
      const userObj = monthlyTotalUsers.find(u => u.month === i);

      result.push({
        month: i,
        totalRequests: totalObj ? totalObj.total : 0,
        pendingRequests: pendingObj ? pendingObj.pending : 0,
        totalUsers: userObj ? userObj.totalUsers : 0
      });
    }

    res.status(200).json({
      stats: result,
      totalUsers,
      totalRequests,
      pendingCount
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deleteuser/:id', isadmin, async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      res.status(401).message({ message: 'invalid creds' });
    }

    const user = User.findById(id).populate('role');
    if (!user) {
      res.status(401).message({ message: 'invalid creds' });
    }

    if (user.role === 'taskmaster') {
      await Taskmaster.findOneAndDelete({ user: id });
      const UAT = await UAT.findOne({ user: id })
      const Applic = await Applic.findByIdAndDelete(UAT.application);
      await UAT.deleteOne();
    }

    await user.deleteOne();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
})

router.get('/gettaskmasters', isadmin, (req, res) => {
  Taskmaster.find()
    .populate('user', '-password')
    .then(taskmasters => res.status(200).json({ taskmasters }))
    .catch(error => res.status(500).json({ message: 'Server error', error: error.message }));
})

router.post('/assigntask', isadmin, async (req, res) => {

  const { taskmasterId, requestId } = req.body;

  try {
    const assignedStatus = await TagStatus.findOne({ name: "active" });

    if (!assignedStatus) {
      return res.status(404).json({ message: 'Assigned status not found' });
    }

    const updateFields = {
      taskmaster: taskmasterId,
      status: assignedStatus._id
    };

    const updatedRequest = await Request.findByIdAndUpdate(requestId, updateFields, {
      new: true
    })
      .populate('taskmaster')
      .populate('status');

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: 'Taskmaster assigned and status updated to assigned',
      request: updatedRequest
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
