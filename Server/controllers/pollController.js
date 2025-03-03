import { DbHelper } from '../Database Helper/dbHelper.js';
import { validatePoll } from '../validators/validators.js';
const db = new DbHelper(); // Instantiate DB Helper

export const createPoll = async (req, res) => {
    console.log("Received Poll Data:", req.body); // Log incoming request data

    // Validate request body
    const { error } = validatePoll(req.body);
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, deadline, location } = req.body;

    try {
        // Convert "dd-mm-yy" to JavaScript Date
        const [day, month, year] = deadline.split('-');
        const fullYear = `20${year}`; // Convert "24" to "2024"
        const formattedDate = new Date(`${fullYear}-${month}-${day}T00:00:00Z`);

        console.log("Formatted Date:", formattedDate);

        // Ensure valid date conversion
        if (isNaN(formattedDate.getTime())) {
            console.log("Invalid Date:", deadline);
            return res.status(400).json({ error: 'Invalid date format. Use dd-mm-yy' });
        }

        // Convert to SQL DATETIME format (YYYY-MM-DD HH:MM:SS)
        const sqlFormattedDate = formattedDate.toISOString().slice(0, 19).replace('T', ' ');

        console.log("SQL Formatted Date:", sqlFormattedDate);

        await db.executeProcedure('CreatePoll', {
            Title: title,
            Deadline: sqlFormattedDate,
            Location: location,
            Description: description
        });

        res.status(201).json({ message: 'Poll created successfully' });

    } catch (error) {
        console.error("Poll Creation Error:", error);
        res.status(500).json({ error: error.message });
    }
};
// Get All Active Polls
export const getAllPolls = async (req, res) => {
    try {
        let results = await db.executeProcedure('GetAllPolls', {});

        let polls = results.recordsets[0];
        res.status(200).json(polls);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Poll by ID
export const getPollById = async (req, res) => {
    const { pollId } = req.params;

    try {
        let results = await db.executeProcedure('GetPollById', { PollId: pollId });
        let poll = results.recordset[0];

        if (results.length === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json(poll);

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
    const userId = req.session.user?.Id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }

    if (!['Yes', 'No'].includes(vote)) {
        return res.status(400).json({ message: 'Invalid vote. Choose Yes or No' });
    }

    try {
        // Check if the user has already voted
        let existingVote = await db.executeProcedure('CheckUserVote', {
            PollId: pollId,
            UserId: userId
        });

        if (existingVote.recordset.length > 0) {
            return res.status(409).json({ message: 'You have already voted in this poll' });
        }

        // Proceed with voting
        await db.executeProcedure('VoteInPoll', {
            PollId: pollId,
            UserId: userId,
            Vote: vote,
        });

        res.status(200).json({ message: 'Vote submitted successfully' });

    } catch (error) {
        console.error('Error submitting vote:', error);
        res.status(500).json({ error: error.message });
    }
};

