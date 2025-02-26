CREATE PROCEDURE VoteInPoll
    @PollId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @Vote VARCHAR(3) -- Either 'Yes' or 'No'
AS
BEGIN
    -- Prevent duplicate votes
    IF EXISTS (SELECT 1 FROM Votes WHERE Poll_Id = @PollId AND User_Id = @UserId)
    BEGIN
        PRINT 'User has already voted in this poll.';
        RETURN;
    END

    -- Insert vote
    INSERT INTO Votes (Id, Poll_Id, User_Id)
    VALUES (NEWID(), @PollId, @UserId);

    -- Update poll vote counts
    IF @Vote = 'Yes'
        UPDATE Polls SET Yes = Yes + 1, Participants = Participants + 1 WHERE Id = @PollId;
    ELSE
        UPDATE Polls SET No = No + 1, Participants = Participants + 1 WHERE Id = @PollId;
END;
