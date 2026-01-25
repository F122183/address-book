import express from 'express';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';
import { 
  getContacts, 
  createContact, 
  updateContact,
  deleteContact,
  exportSingleContact,
  importSingleContact
} from '../controllers/contactController';

const router = express.Router();

router.route('/')
    .get(protect, getContacts)
    .post(protect, createContact);

router.post(
    '/import-one',
    protect,
    upload.single('file'),
    importSingleContact
);

router.get('/:id/export', protect, exportSingleContact);
router.route('/:id')
    .put(protect, updateContact)
    .delete(protect, deleteContact);

export default router;