import { DbHelper } from '../Database Helper/dbHelper.js';
import { validateIssue } from '../validators/validators.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';

const db = new DbHelper();

// Middleware to handle image upload
const uploadImage = uploadFile('images').single('image');

export const createIssue = async (req, res) => {
    // Handle image upload
    uploadImage(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Validate request body
        const { error } = validateIssue(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const { title, content, category, location } = req.body;
            const image = req.file ? req.file.location : null; // S3 Image URL

            await db.executeProcedure('CreateIssue', {
                Title: title,
                Content: content,
                Category: category,
                Status: 'Open', // Default status for new issues
                Image: image,
                Location: location,
            });

            res.status(201).json({ message: 'Issue reported successfully', Image: image });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Update Issue Status
export const updateIssueStatus = async (req, res) => {
    const { issueId, newStatus } = req.body;

    try {
        await db.executeProcedure('UpdateIssueStatus', {
            IssueId: issueId,
            NewStatus: newStatus,
        });

        res.status(200).json({ 
            NewStatus: newStatus,
            message: 'Issue status updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Issues
export const getAllIssues = async (req, res) => {
    try {
        let results = await db.executeProcedure('GetAllIssues', {});
        let issues = results.recordsets[0];
        res.status(200).json(issues);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Issues by Location
export const getIssuesByLocation = async (req, res) => {
    const { location } = req.params;

    try {
        let results = await db.executeProcedure('GetIssuesByLocation', { Location: location });

        let issues = results.recordsets[0];

        if (issues.length === 0) {
            return res.status(404).json({ message: 'No issues found for this location' });
        }

        res.status(200).json(issues);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Issue by ID
export const getIssueById = async (req, res) => {
    const { issueId } = req.params;

    try {
        let results = await db.executeProcedure('GetIssueById', { IssueId: issueId });
        let issues = results.recordsets[0];
        let issue = issues[0];

        console.log('Issue:', issue);

        if (issue.length === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.status(200).json(issue);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
