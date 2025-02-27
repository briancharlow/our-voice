CREATE PROCEDURE GetAllDocuments
AS
BEGIN
    SELECT *
    FROM Documents
    WHERE is_deleted = 0;
END;
