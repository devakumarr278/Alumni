const express = require('express');
const router = express.Router();
const { InstitutionController } = require('../controllers/institutionController');
const { auth, isInstitution } = require('../middleware/auth');

// Institution routes for alumni verification
router.get('/profile', auth, isInstitution, InstitutionController.getInstitutionProfile);
router.get('/pending', auth, isInstitution, InstitutionController.getPendingAlumni);
router.post('/verify/:alumniId', auth, isInstitution, InstitutionController.verifyAlumni);
router.get('/notifications', auth, isInstitution, InstitutionController.getNotifications);

module.exports = router;