CREATE OR ALTER PROCEDURE GetUserByResetToken
    @ResetToken VARCHAR(255)
AS
BEGIN
    SELECT * 
    FROM Users 
    WHERE ResetToken = @ResetToken 
      AND ResetTokenExpiry > GETUTCDATE(); -- Ensures token is still valid
END;


