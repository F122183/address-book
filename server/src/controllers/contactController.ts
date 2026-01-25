import { Response } from "express";
import Contact from "../models/Contact";
import { Parser } from "json2csv";
import csv from 'csvtojson';
import fs from 'fs';

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

// export contact
export const exportSingleContact = async (req: any, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            user: req.user._id
        }).lean();

        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        const exportData = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            mobile: contact.mobile,
            fax: contact.fax,
            firm: contact.firm,
            address: contact.address,
            comment: contact.comment,
            customFields: JSON.stringify(contact.customFields || {})
        };

        const fields = Object.keys(exportData);

        const parser = new Parser({ fields });
        const csv = parser.parse([exportData]);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${contact.firstName}_${contact.lastName}.csv`
        );

        res.status(200).send(csv);
    } catch {
        res.status(500).json({ message: 'Failed to export contact' });
    }
};

//import contact
export const importSingleContact = async (req: any, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No CSV file uploaded' });
            return;
        }

        const rows = await csv().fromFile(req.file.path);

        fs.unlinkSync(req.file.path);

        if (rows.length !== 1) {
            res.status(400).json({
                message: 'CSV must contain exactly one contact'
            });
            return;
        }

        const row = rows[0];

        let customFields: Record<string, string> = {};
        if (row.customFields) {
            try {
                customFields = JSON.parse(row.customFields);
            } catch (err) {
                customFields = {};
            }
        }

        res.json({
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            email: row.email || '',
            phone: row.phone || '',
            mobile: row.mobile || '',
            fax: row.fax || '',
            firm: row.firm || '',
            address: row.address || '',
            comment: row.comment || '',
            customFields
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to import CSV' });
    }
};