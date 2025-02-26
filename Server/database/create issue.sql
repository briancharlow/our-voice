CREATE PROCEDURE CreateIssue
    @Title VARCHAR(255),
    @Content TEXT,
    @Category VARCHAR(100),
    @Status VARCHAR(50),
    @Image VARCHAR(255),
    @Location VARCHAR(255)
AS
BEGIN
    INSERT INTO Issues (Id, Title, Content, Category, Status, Image, Location, created_at)
    VALUES (NEWID(), @Title, @Content, @Category, @Status, @Image, @Location, GETDATE());
END;
