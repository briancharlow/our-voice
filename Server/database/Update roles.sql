CREATE PROCEDURE UpdateUserRole
    @UserId UNIQUEIDENTIFIER,
    @NewRole VARCHAR(50)
AS
BEGIN
    -- Ensure only valid roles are assigned
    IF @NewRole NOT IN ('Citizen', 'Government Official', 'Admin')
    BEGIN
        PRINT 'Invalid role. Allowed roles: Citizen, Government Official, Admin.';
        RETURN;
    END

    UPDATE Users
    SET Role = @NewRole
    WHERE Id = @UserId;
END;
