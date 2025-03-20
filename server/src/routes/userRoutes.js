const express = require('express');
const { 
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, userValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, admin, validate(userValidation.register), registerUser)
  .get(protect, admin, getUsers);

router.post('/login', validate(userValidation.login), authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validate(userValidation.update), updateUserProfile);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, validate(userValidation.update), updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;