import { Response } from "express";
import Contact from "../models/Contact";

// @desc Get all contacts for the logged-in user
// @route GET /api/contacts
export const getContacts = async (req: any, res: Response): Promise<void> => {
    try {
        const contacts = await Contact.find({ user: req.user._id })
            .populate('tags', 'name color')
            .sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({
            message: (error as Error).message
        });
    }
};

// @desc Create a new contact
// @route POST /api/contacts
export const createContact = async (req: any, res: Response): Promise<void> => {
    try {
        const {
            firstName,
            lastName,
            firm,
            address,
            phone,
            mobile,
            email,
            fax,
            comment,
            tags,
            customFields
        } = req.body;

        const contact = new Contact({
            user: req.user._id,
            firstName,
            lastName,
            firm,
            address,
            phone,
            mobile,
            email,
            fax,
            comment,
            tags,
            customFields
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(400).json({
            message: (error as Error).message
        });
    }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
export const updateContact = async (req: any, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        if (contact.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        // Update fields
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
export const deleteContact = async (req: any, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        if (contact.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        await contact.deleteOne();

        res.json({ message: 'Contact removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};