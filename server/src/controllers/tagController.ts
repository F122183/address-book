import { Response } from "express";
import Tag from "../models/Tag";

// @desc Get all tags for the logged-in user
// @route GET /api/tags

export const getTags = async (req: any, res: Response): Promise<void> => {

    try {
        const tags = await Tag.find({ user: req.user._id }).populate('parent', 'name color');
        res.json(tags);
    } catch (error) {
        res.status(500).json({
            message: (error as Error).message
        });
    }
};

// @desc Create a new tag
// @route POST /api/tags
export const createTag = async (req: any, res: Response): Promise<void> => {

    try {
        const { name, color, parent } = req.body;

        const tag = new Tag({
            user: req.user._id,
            name,
            color,
            parent: parent || null
        });

        const createdTag = await tag.save();
        res.status(201).json(createdTag);
    } catch (error) {
        if ((error as any).code === 11000) {
            res.status(400).json({
                message: 'Tag name already exists'
            });
        } else {
            res.status(400).json({
                message: (error as Error).message
            });
        }
    }
};

// @desc Delete a tag
// @route DELETE /api/tags/:id
export const deleteTag = async (req: any, res: Response): Promise<void> => {
    try {
        const tag = await Tag.findById(req.params.id);

        if(!tag){
            res.status(404).json({
                message:'Tag not found'
            });
            return;
        }

        if(tag.user.toString() !== req.user._id.toString()) {
            res.status(401).json({
                message: 'Not authorized'
            });
            return;
        }

        await Tag.updateMany({parent: tag._id}, { parent: null});
        await Tag.deleteOne();
        res.json({
            message: 'Tag removed'
        });
    } catch (error) {
        res.status(500).json({
            message: (error as Error).message
        });
    }
};