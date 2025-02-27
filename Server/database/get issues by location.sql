CREATE PROCEDURE GetIssuesByLocation
    @Location VARCHAR(255)
AS
BEGIN
    SELECT * FROM Issues WHERE Location = @Location AND Status != 'Deleted';
END;
