CREATE PROCEDURE GetDocumentById
    @DocumentId VARCHAR(255)
AS
BEGIN
    SELECT *
    FROM Documents
    WHERE Id = @DocumentId AND is_deleted = 0;
END;
