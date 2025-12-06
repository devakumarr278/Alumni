const express = require('express');
const router = express.Router();
const { FollowController } = require('../controllers/followController');
const { auth } = require('../middleware/auth');

// Follow/unfollow an alumni
router.post('/', auth, FollowController.followAlumni);

// Unfollow an alumni
router.delete('/', auth, FollowController.unfollowAlumni);

// Get follow status
router.get('/status/:alumniId', auth, FollowController.getFollowStatus);

// Get followers list
router.get('/followers', auth, FollowController.getFollowersWithDetails);

// Get following list
router.get('/following', auth, FollowController.getFollowing);

// Get follow requests (for alumni)
router.get('/requests', auth, FollowController.getFollowRequests);

// Approve follow request
router.post('/requests/:requestId/approve', auth, (req, res) => {
  console.log('Received approve request with params:', req.params);
  console.log('Received approve request with requestId:', req.params.requestId);
  console.log('Type of requestId:', typeof req.params.requestId);
  console.log('Length of requestId:', req.params.requestId ? req.params.requestId.length : 'undefined');
  FollowController.approveFollowRequest(req, res);
});

// Reject follow request
router.post('/requests/:requestId/reject', auth, (req, res) => {
  console.log('Received reject request with params:', req.params);
  console.log('Received reject request with requestId:', req.params.requestId);
  console.log('Type of requestId:', typeof req.params.requestId);
  console.log('Length of requestId:', req.params.requestId ? req.params.requestId.length : 'undefined');
  FollowController.rejectFollowRequest(req, res);
});

module.exports = router;