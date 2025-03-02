CREATE PROCEDURE GetAllUsers
AS
BEGIN
    SELECT Id, Email, Location, Role, created_at FROM Users;
END;
