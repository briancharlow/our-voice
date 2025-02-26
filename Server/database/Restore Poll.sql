CREATE PROCEDURE RestorePoll
    @PollId UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE Polls SET is_deleted = 0 WHERE Id = @PollId;
END;
