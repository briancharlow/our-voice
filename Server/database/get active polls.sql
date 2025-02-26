CREATE PROCEDURE GetActivePolls
AS
BEGIN
    SELECT * FROM Polls WHERE is_deleted = 0;
END;
