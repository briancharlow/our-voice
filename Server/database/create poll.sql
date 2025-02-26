CREATE PROCEDURE CreatePoll
    @Title VARCHAR(255),
    @Deadline DATETIME,
    @Location VARCHAR(255)
AS
BEGIN
    INSERT INTO Polls (Id, Title, Deadline, Location, Participants, Yes, No, created_at)
    VALUES (NEWID(), @Title, @Deadline, @Location, 0, 0, 0, GETDATE());
END;
