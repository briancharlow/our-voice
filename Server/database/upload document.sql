CREATE PROCEDURE UploadDocument
    @Title VARCHAR(255),
    @Description TEXT,
    @DocumentFile VARBINARY(MAX)
AS
BEGIN
    INSERT INTO Documents (Id, Title, Description, DocumentFile, created_at)
    VALUES (NEWID(), @Title, @Description, @DocumentFile, GETDATE());
END;

