CREATE TRIGGER trg_SoftDeleteExpiredPolls
ON Polls
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE Polls
    SET is_deleted = 1
    WHERE Deadline < GETDATE();
END;
