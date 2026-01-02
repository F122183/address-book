import express from 'express';
import { getContacts, createContact } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getContacts)
    .post(createContact);

export default router;