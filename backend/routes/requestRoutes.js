const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/requestController');

router.post('/', auth, ctrl.createRequest);
router.get('/my', auth, ctrl.getMyRequests);
router.get('/', auth, requireRole('admin'), ctrl.getAllRequests);
router.put('/:id/approve', auth, requireRole('admin'), ctrl.approveRequest);
router.put('/:id/reject', auth, requireRole('admin'), ctrl.rejectRequest);

module.exports = router;