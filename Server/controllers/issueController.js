import { DbHelper } from '../Database Helper/dbHelper.js';
const db = new DbHelper(); // Instantiate DB Helper

// Create Issue
export const createIssue = async (req, res) => {
    const { title, content, category, status, image, location } = req.body;

    try {
        await db.executeProcedure('CreateIssue', {
            Title: title,
            Content: content,
            Category: category,
            Status: status,
            Image: image,
            Location: location,
        });

        res.status(201).json({ message: 'Issue reported successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Issue Status
export const updateIssueStatus = async (req, res) => {
    const { issueId, newStatus } = req.body;

    try {
        await db.executeProcedure('UpdateIssueStatus', {
            IssueId: issueId,
            NewStatus: newStatus,
        });

        res.status(200).json({ message: 'Issue status updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Issues
export const getAllIssues = async (req, res) => {
    try {
        let results = await db.executeProcedure('GetAllIssues');
        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Issues by Location
export const getIssuesByLocation = async (req, res) => {
    const { location } = req.params;

    try {
        let results = await db.executeProcedure('GetIssuesByLocation', { Location: location });

        if (results.length === 0) {
            return res.status(404).json({ message: 'No issues found for this location' });
        }

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Issue by ID
export const getIssueById = async (req, res) => {
    const { issueId } = req.params;

    try {
        let results = await db.executeProcedure('GetIssueById', { IssueId: issueId });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.status(200).json(results[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
