import express from 'express';
import {deleteUser, getUsers, signout, test, updateUser} from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router= express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyUser, updateUser);
router.delete('/delete/:userId', verifyUser, deleteUser);
router.post('/signout',signout);
router.get('/getusers', verifyUser,getUsers);



export default router;