CREATE PROCEDURE CreateUser
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @Location VARCHAR(255),
    @Role VARCHAR(50)
AS
BEGIN
    INSERT INTO Users (Id, Email, Password, Location, Role, created_at)
    VALUES (NEWID(), @Email, @PasswordHash, @Location, @Role, GETDATE());
END;
