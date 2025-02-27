import { DbHelper } from '../Database Helper/dbHelper.js';
const db = new DbHelper(); // Instantiate DB Helper

// Create Poll
export const createPoll = async (req, res) => {
    const { title, deadline, location } = req.body;

    try {
        await db.executeProcedure('CreatePoll', {
            Title: title,
            Deadline: deadline,
            Location: location,
        });

        res.status(201).json({ message: 'Poll created successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Active Polls
export const getAllPolls = async (req, res) => {
    try {
        let results = await db.executeProcedure('GetAllPolls');
        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Poll by ID
export const getPollById = async (req, res) => {
    const { pollId } = req.params;

    try {
        let results = await db.executeProcedure('GetPollById', { PollId: pollId });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json(results[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft Delete Poll
export const softDeletePoll = async (req, res) => {
    const { pollId } = req.params;

    try {
        await db.executeProcedure('SoftDeletePoll', { PollId: pollId });

        res.status(200).json({ message: 'Poll deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vote in a Poll
export const voteInPoll = async (req, res) => {
    const { pollId, vote } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }

    if (!['Yes', 'No'].includes(vote)) {
        return res.status(400).json({ message: 'Invalid vote. Choose Yes or No' });
    }

    try {
        await db.executeProcedure('VoteInPoll', {
            PollId: pollId,
            UserId: userId,
            Vote: vote,
        });

        res.status(200).json({ message: 'Vote submitted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};