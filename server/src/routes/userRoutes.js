import { Router } from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .post(protect, admin, registerUser)
  .get(protect, admin, getUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;