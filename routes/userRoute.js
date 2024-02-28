import express from 'express';
const router = express.Router();
import { getOneUser, getAllUsers, updateUserDetails, deleteUser } from '../Controllers/userController.js';

router.get('/details/:id?', getOneUser);

router.get('/all', getAllUsers);

router.put('/update/:_id', updateUserDetails);

router.delete('/delete/:_id', deleteUser);

export default router;