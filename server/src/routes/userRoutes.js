import { Router } from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";
import { validate, userValidation } from "../middleware/validationMiddleware";
import{pagination}from'../middleware/paginationMiddleware';

const router = Router();

router
  .route("/")
  .post(protect, admin, validate(userValidation.reister), registerUser)
  .get(protect, pagination, admin, getUsers);

router.post("/login", validate(userValidation.login), authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validate(userValidation.update), updateUserProfile);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, validate(userValidation.update), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
