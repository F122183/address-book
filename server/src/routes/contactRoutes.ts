import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
  getContacts, 
  createContact, 
  updateContact,
  deleteContact
} from '../controllers/contactController';

const router = express.Router();

router.route('/')
    .get(protect, getContacts)
    .post(protect, createContact);

router.route('/:id')
    .put(protect, updateContact)
    .delete(protect, deleteContact);

export default router;