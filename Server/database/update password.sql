CREATE PROCEDURE UpdatePassword
    @Email VARCHAR(255),
    @NewPassword VARCHAR(255)
AS
BEGIN
    UPDATE Users
    SET Password = @NewPassword, ResetToken = NULL, ResetTokenExpiry = NULL
    WHERE Email = @Email;
END;



select * from Users


