import { Response } from "express";
import Contact from "../models/Contact";

// @desc Get all contacts for the logged-in user
// @route GET /api/contacts
export const getContacts = async (req: any, res: Response): Promise<void> => {
    try {
        const contacts = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });
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