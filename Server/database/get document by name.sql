CREATE PROCEDURE GetDocumentByName
    @DocumentTitle VARCHAR(255)
AS
BEGIN
    SELECT Id, Title, Description, created_at
    FROM Documents
    WHERE Title = @DocumentTitle AND is_deleted = 0;
END;
