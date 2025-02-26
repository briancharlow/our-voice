CREATE PROCEDURE AuthenticateUser
    @Email VARCHAR(255)
AS
BEGIN
    SELECT * FROM Users WHERE Email = @Email;
END;
