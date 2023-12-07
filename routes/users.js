const controllers = require('../controllers/users');
const router = require('express').Router();

// CRUD Routes /users
router.get('/', controllers.getUsers);
router.get('/:userId', controllers.getUser);
router.post('/', controllers.createUser);

module.exports = router;