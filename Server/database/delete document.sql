CREATE PROCEDURE SoftDeleteDocument
    @DocumentId UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE Documents
    SET is_deleted = 1
    WHERE Id = @DocumentId;
END;



