const express = require('express');
const router = express.Router();
const { ConnectionController } = require('../controllers/connectionController');
const { auth } = require('../middleware/auth');

// Connect with a student (alumni initiates connection)
router.post('/connect', auth, ConnectionController.connectWithStudent);

// Get connection status with a student
router.get('/status/:studentId', auth, ConnectionController.getConnectionStatus);

// Get all connections for the current user
router.get('/', auth, ConnectionController.getConnections);

// Accept a connection request (student accepts alumni request)
router.post('/:connectionId/accept', auth, ConnectionController.acceptConnection);

// Reject a connection request (student rejects alumni request)
router.post('/:connectionId/reject', auth, ConnectionController.rejectConnection);

module.exports = router;