CREATE TRIGGER trg_PreventDuplicateVote
ON Votes
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM Votes
        WHERE Poll_Id IN (SELECT Poll_Id FROM inserted) 
        AND User_Id IN (SELECT User_Id FROM inserted)
    )
    BEGIN
        PRINT 'User has already voted in this poll!';
        RETURN;
    END
    INSERT INTO Votes (Id, Poll_Id, User_Id)
    SELECT Id, Poll_Id, User_Id FROM inserted;
END;
