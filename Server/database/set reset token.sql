CREATE PROCEDURE SetResetToken
    @Email VARCHAR(255),
    @ResetToken VARCHAR(255),
    @Expiry DATETIME
AS
BEGIN
    UPDATE Users
    SET ResetToken = @ResetToken, ResetTokenExpiry = @Expiry
    WHERE Email = @Email;
END;
