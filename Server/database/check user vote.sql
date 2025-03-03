CREATE PROCEDURE CheckUserVote
    @PollId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Votes WHERE Poll_Id = @PollId AND User_Id = @UserId;
END;
