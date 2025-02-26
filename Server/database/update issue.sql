CREATE PROCEDURE UpdateIssueStatus
    @IssueId UNIQUEIDENTIFIER,
    @NewStatus VARCHAR(50)
AS
BEGIN
    UPDATE Issues
    SET Status = @NewStatus, updated_at = GETDATE()
    WHERE Id = @IssueId;
END;
