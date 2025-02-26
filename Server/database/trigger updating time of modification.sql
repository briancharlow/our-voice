CREATE TRIGGER trg_UpdateIssueTimestamp
ON Issues
AFTER UPDATE
AS
BEGIN
    UPDATE Issues
    SET updated_at = GETDATE()
    WHERE Id IN (SELECT Id FROM inserted);
END;
