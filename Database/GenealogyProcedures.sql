SET ANSI_NULLS ON;


GO
SET QUOTED_IDENTIFIER ON;


GO
-- Stored procedure layer for genealogy features.
-- Apply after Database/GenealogySchema.sql so the tables exist first.
CREATE OR ALTER PROCEDURE dbo.Blog_Delete
@BlogId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE dbo.Blog
    WHERE  BlogId = @BlogId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Blog_Get
@BlogId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT b.BlogId,
           b.Title,
           b.Content,
           b.PhotoId,
           b.AncestorProfileId,
           b.SourceId,
           b.AncestorName,
           b.RecordType,
           b.Location,
           b.FamilyBranch,
           b.Tags,
           b.ConfidenceLevel,
           b.ResearchStatus,
           b.ApplicationUserId,
           u.UserName AS Username,
           b.PublishDate,
           b.UpdateDate
    FROM   dbo.Blog AS b
           LEFT OUTER JOIN
           dbo.ApplicationUser AS u
           ON u.ApplicationUserId = b.ApplicationUserId
    WHERE  b.BlogId = @BlogId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Blog_GetAll
@Offset INT, @PageSize INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   b.BlogId,
             b.Title,
             b.Content,
             b.PhotoId,
             b.AncestorProfileId,
             b.SourceId,
             b.AncestorName,
             b.RecordType,
             b.Location,
             b.FamilyBranch,
             b.Tags,
             b.ConfidenceLevel,
             b.ResearchStatus,
             b.ApplicationUserId,
             u.UserName AS Username,
             b.PublishDate,
             b.UpdateDate
    FROM     dbo.Blog AS b
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = b.ApplicationUserId
    ORDER BY b.PublishDate DESC, b.BlogId DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
    SELECT COUNT(1)
    FROM   dbo.Blog;
END


GO
CREATE OR ALTER PROCEDURE dbo.Blog_GetByUserId
@ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   b.BlogId,
             b.Title,
             b.Content,
             b.PhotoId,
             b.AncestorProfileId,
             b.SourceId,
             b.AncestorName,
             b.RecordType,
             b.Location,
             b.FamilyBranch,
             b.Tags,
             b.ConfidenceLevel,
             b.ResearchStatus,
             b.ApplicationUserId,
             u.UserName AS Username,
             b.PublishDate,
             b.UpdateDate
    FROM     dbo.Blog AS b
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = b.ApplicationUserId
    WHERE    b.ApplicationUserId = @ApplicationUserId
    ORDER BY b.PublishDate DESC, b.BlogId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.Blog_GetAllFamous
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   TOP (10) b.BlogId,
                      b.Title,
                      b.Content,
                      b.PhotoId,
                      b.AncestorProfileId,
                      b.SourceId,
                      b.AncestorName,
                      b.RecordType,
                      b.Location,
                      b.FamilyBranch,
                      b.Tags,
                      b.ConfidenceLevel,
                      b.ResearchStatus,
                      b.ApplicationUserId,
                      u.UserName AS Username,
                      b.PublishDate,
                      b.UpdateDate
    FROM     dbo.Blog AS b
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = b.ApplicationUserId
    ORDER BY b.PublishDate DESC, b.BlogId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.Blog_Upsert
@Blog dbo.BlogType READONLY, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @BlogId AS INT;
    DECLARE @Title AS NVARCHAR (50);
    DECLARE @Content AS NVARCHAR (MAX);
    DECLARE @PhotoId AS INT;
    DECLARE @AncestorProfileId AS INT;
    DECLARE @SourceId AS INT;
    DECLARE @AncestorName AS NVARCHAR (100);
    DECLARE @RecordType AS NVARCHAR (100);
    DECLARE @Location AS NVARCHAR (100);
    DECLARE @FamilyBranch AS NVARCHAR (100);
    DECLARE @Tags AS NVARCHAR (200);
    DECLARE @ConfidenceLevel AS NVARCHAR (50);
    DECLARE @ResearchStatus AS NVARCHAR (50);
    SELECT TOP (1) @BlogId = NULLIF (BlogId, 0),
                   @Title = Title,
                   @Content = Content,
                   @PhotoId = PhotoId,
                   @AncestorProfileId = AncestorProfileId,
                   @SourceId = SourceId,
                   @AncestorName = AncestorName,
                   @RecordType = RecordType,
                   @Location = Location,
                   @FamilyBranch = FamilyBranch,
                   @Tags = Tags,
                   @ConfidenceLevel = ConfidenceLevel,
                   @ResearchStatus = ResearchStatus
    FROM   @Blog;
    IF @BlogId IS NOT NULL
       AND EXISTS (SELECT 1
                   FROM   dbo.Blog
                   WHERE  BlogId = @BlogId)
        BEGIN
            UPDATE dbo.Blog
            SET    Title             = @Title,
                   Content           = @Content,
                   PhotoId           = @PhotoId,
                   AncestorProfileId = @AncestorProfileId,
                   SourceId          = @SourceId,
                   AncestorName      = @AncestorName,
                   RecordType        = @RecordType,
                   Location          = @Location,
                   FamilyBranch      = @FamilyBranch,
                   Tags              = @Tags,
                   ConfidenceLevel   = @ConfidenceLevel,
                   ResearchStatus    = @ResearchStatus,
                   ApplicationUserId = @ApplicationUserId,
                   UpdateDate        = GETDATE()
            WHERE  BlogId = @BlogId;
        END
    ELSE
        BEGIN
            INSERT  INTO dbo.Blog (
                Title,
                Content,
                PhotoId,
                AncestorProfileId,
                SourceId,
                AncestorName,
                RecordType,
                Location,
                FamilyBranch,
                Tags,
                ConfidenceLevel,
                ResearchStatus,
                ApplicationUserId,
                PublishDate,
                UpdateDate
            )
            VALUES               (@Title, @Content, @PhotoId, @AncestorProfileId, @SourceId, @AncestorName, @RecordType, @Location, @FamilyBranch, @Tags, @ConfidenceLevel, @ResearchStatus, @ApplicationUserId, GETDATE(), GETDATE());
            SET @BlogId = CONVERT (INT, SCOPE_IDENTITY());
        END
    SELECT @BlogId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfile_Delete
@AncestorProfileId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE dbo.AncestorProfiles
    WHERE  AncestorProfileId = @AncestorProfileId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfile_Get
@AncestorProfileId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT a.AncestorProfileId,
           a.FirstName,
           a.MiddleName,
           a.LastName,
           a.Suffix,
           a.Gender,
           a.BirthDate,
           a.BirthLocation,
           a.DeathDate,
           a.DeathLocation,
           a.Biography,
           a.ResearchStatus,
           a.FamilyBranch,
           a.Tags,
           a.ConfidenceLevel,
           a.ProfilePhotoId,
           a.ApplicationUserId,
           u.UserName AS Username,
           a.PublishDate,
           a.UpdateDate
    FROM   dbo.AncestorProfiles AS a
           LEFT OUTER JOIN
           dbo.ApplicationUser AS u
           ON u.ApplicationUserId = a.ApplicationUserId
    WHERE  a.AncestorProfileId = @AncestorProfileId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfile_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   a.AncestorProfileId,
             a.FirstName,
             a.MiddleName,
             a.LastName,
             a.Suffix,
             a.Gender,
             a.BirthDate,
             a.BirthLocation,
             a.DeathDate,
             a.DeathLocation,
             a.Biography,
             a.ResearchStatus,
             a.FamilyBranch,
             a.Tags,
             a.ConfidenceLevel,
             a.ProfilePhotoId,
             a.ApplicationUserId,
             u.UserName AS Username,
             a.PublishDate,
             a.UpdateDate
    FROM     dbo.AncestorProfiles AS a
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = a.ApplicationUserId
    ORDER BY a.LastName, a.FirstName, a.AncestorProfileId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfile_Search
@Query NVARCHAR (200)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Search AS NVARCHAR (204) = N'%' + ISNULL(@Query, N'') + N'%';
    SELECT   a.AncestorProfileId,
             a.FirstName,
             a.MiddleName,
             a.LastName,
             a.Suffix,
             a.Gender,
             a.BirthDate,
             a.BirthLocation,
             a.DeathDate,
             a.DeathLocation,
             a.Biography,
             a.ResearchStatus,
             a.FamilyBranch,
             a.Tags,
             a.ConfidenceLevel,
             a.ProfilePhotoId,
             a.ApplicationUserId,
             u.UserName AS Username,
             a.PublishDate,
             a.UpdateDate
    FROM     dbo.AncestorProfiles AS a
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = a.ApplicationUserId
    WHERE    a.FirstName LIKE @Search
             OR a.MiddleName LIKE @Search
             OR a.LastName LIKE @Search
             OR a.BirthLocation LIKE @Search
             OR a.DeathLocation LIKE @Search
             OR a.Biography LIKE @Search
             OR a.ResearchStatus LIKE @Search
             OR a.FamilyBranch LIKE @Search
             OR a.Tags LIKE @Search
             OR a.ConfidenceLevel LIKE @Search
    ORDER BY a.LastName, a.FirstName, a.AncestorProfileId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfile_Upsert
@AncestorProfileId INT, @FirstName NVARCHAR (50), @MiddleName NVARCHAR (50), @LastName NVARCHAR (50), @Suffix NVARCHAR (20), @Gender NVARCHAR (20), @BirthDate DATETIME, @BirthLocation NVARCHAR (100), @DeathDate DATETIME, @DeathLocation NVARCHAR (100), @Biography NVARCHAR (MAX), @ResearchStatus NVARCHAR (50), @FamilyBranch NVARCHAR (100), @Tags NVARCHAR (200), @ConfidenceLevel NVARCHAR (50), @ProfilePhotoId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @AncestorProfileId IS NOT NULL
       AND @AncestorProfileId > 0
       AND EXISTS (SELECT 1
                   FROM   dbo.AncestorProfiles
                   WHERE  AncestorProfileId = @AncestorProfileId)
        BEGIN
            UPDATE dbo.AncestorProfiles
            SET    FirstName         = @FirstName,
                   MiddleName        = @MiddleName,
                   LastName          = @LastName,
                   Suffix            = @Suffix,
                   Gender            = @Gender,
                   BirthDate         = @BirthDate,
                   BirthLocation     = @BirthLocation,
                   DeathDate         = @DeathDate,
                   DeathLocation     = @DeathLocation,
                   Biography         = @Biography,
                   ResearchStatus    = @ResearchStatus,
                   FamilyBranch      = @FamilyBranch,
                   Tags              = @Tags,
                   ConfidenceLevel   = @ConfidenceLevel,
                   ProfilePhotoId    = @ProfilePhotoId,
                   ApplicationUserId = @ApplicationUserId,
                   UpdateDate        = GETDATE()
            WHERE  AncestorProfileId = @AncestorProfileId;
        END
    ELSE
        BEGIN
            INSERT  INTO dbo.AncestorProfiles (
                FirstName,
                MiddleName,
                LastName,
                Suffix,
                Gender,
                BirthDate,
                BirthLocation,
                DeathDate,
                DeathLocation,
                Biography,
                ResearchStatus,
                FamilyBranch,
                Tags,
                ConfidenceLevel,
                ProfilePhotoId,
                ApplicationUserId,
                PublishDate,
                UpdateDate
            )
            VALUES                           (@FirstName, @MiddleName, @LastName, @Suffix, @Gender, @BirthDate, @BirthLocation, @DeathDate, @DeathLocation, @Biography, @ResearchStatus, @FamilyBranch, @Tags, @ConfidenceLevel, @ProfilePhotoId, @ApplicationUserId, GETDATE(), GETDATE());
            SET @AncestorProfileId = CONVERT (INT, SCOPE_IDENTITY());
        END
    SELECT @AncestorProfileId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorFollower_Upsert
@AncestorProfileId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1
                   FROM   dbo.AncestorFollowers
                   WHERE  AncestorProfileId = @AncestorProfileId
                          AND ApplicationUserId = @ApplicationUserId)
        BEGIN
            INSERT  INTO dbo.AncestorFollowers (
                AncestorProfileId,
                ApplicationUserId,
                CreatedDate
            )
            VALUES                            (@AncestorProfileId, @ApplicationUserId, GETDATE());
        END
    SELECT @@ROWCOUNT;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorFollower_Delete
@AncestorProfileId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE dbo.AncestorFollowers
    WHERE  AncestorProfileId = @AncestorProfileId
           AND ApplicationUserId = @ApplicationUserId;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorRelationship_Upsert
@AncestorRelationshipId INT, @AncestorProfileId INT, @RelatedAncestorProfileId INT, @RelationshipType NVARCHAR (50), @CreatedDate DATETIME=NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @AncestorRelationshipId IS NOT NULL
       AND @AncestorRelationshipId > 0
       AND EXISTS (SELECT 1
                   FROM   dbo.AncestorRelationships
                   WHERE  AncestorRelationshipId = @AncestorRelationshipId)
        BEGIN
            UPDATE dbo.AncestorRelationships
            SET    AncestorProfileId        = @AncestorProfileId,
                   RelatedAncestorProfileId = @RelatedAncestorProfileId,
                   RelationshipType         = @RelationshipType
            WHERE  AncestorRelationshipId = @AncestorRelationshipId;
        END
    ELSE
        BEGIN
            INSERT  INTO dbo.AncestorRelationships (
                AncestorProfileId,
                RelatedAncestorProfileId,
                RelationshipType,
                CreatedDate
            )
            VALUES                                (@AncestorProfileId, @RelatedAncestorProfileId, @RelationshipType, ISNULL(@CreatedDate, GETDATE()));
        END
    SELECT @@ROWCOUNT;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfilePhoto_GetByAncestorProfileId
@AncestorProfileId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   p.PhotoId,
             p.ApplicationUserId,
             p.PublicId,
             p.ImageUrl,
             p.Description,
             p.PublishDate,
             p.UpdateDate
    FROM     dbo.AncestorProfilePhotos AS ap
             INNER JOIN
             dbo.Photo AS p
             ON p.PhotoId = ap.PhotoId
    WHERE    ap.AncestorProfileId = @AncestorProfileId
    ORDER BY ap.CreatedDate DESC, p.PhotoId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfilePhoto_Upsert
@AncestorProfileId INT, @PhotoId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1
               FROM   dbo.AncestorProfiles
               WHERE  AncestorProfileId = @AncestorProfileId
                      AND ApplicationUserId = @ApplicationUserId)
       AND EXISTS (SELECT 1
                   FROM   dbo.Photo
                   WHERE  PhotoId = @PhotoId
                          AND ApplicationUserId = @ApplicationUserId)
       AND NOT EXISTS (SELECT 1
                       FROM   dbo.AncestorProfilePhotos
                       WHERE  AncestorProfileId = @AncestorProfileId
                              AND PhotoId = @PhotoId)
        BEGIN
            INSERT  INTO dbo.AncestorProfilePhotos (
                AncestorProfileId,
                PhotoId,
                CreatedDate
            )
            VALUES                                (@AncestorProfileId, @PhotoId, GETDATE());
        END
    SELECT @@ROWCOUNT;
END


GO
CREATE OR ALTER PROCEDURE dbo.AncestorProfilePhoto_Delete
@AncestorProfileId INT, @PhotoId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE ap
    FROM   dbo.AncestorProfilePhotos AS ap
           INNER JOIN
           dbo.AncestorProfiles AS a
           ON a.AncestorProfileId = ap.AncestorProfileId
    WHERE  ap.AncestorProfileId = @AncestorProfileId
           AND ap.PhotoId = @PhotoId
           AND a.ApplicationUserId = @ApplicationUserId;
    IF @@ROWCOUNT > 0
       AND EXISTS (SELECT 1
                   FROM   dbo.AncestorProfiles
                   WHERE  AncestorProfileId = @AncestorProfileId
                          AND ProfilePhotoId = @PhotoId)
        BEGIN
            UPDATE dbo.AncestorProfiles
            SET    ProfilePhotoId = NULL,
                   UpdateDate     = GETDATE()
            WHERE  AncestorProfileId = @AncestorProfileId;
        END
    SELECT @@ROWCOUNT;
END


GO
CREATE OR ALTER PROCEDURE dbo.Source_Delete
@SourceId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE dbo.Sources
    WHERE  SourceId = @SourceId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Source_Get
@SourceId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.SourceId,
           s.Title,
           s.SourceType,
           s.Citation,
           s.Description,
           s.DocumentDate,
           s.Location,
           s.Repository,
           s.AttachedFileUrl,
           s.FileId,
           s.ApplicationUserId,
           u.UserName AS Username,
           s.PublishDate,
           s.UpdateDate
    FROM   dbo.Sources AS s
           LEFT OUTER JOIN
           dbo.ApplicationUser AS u
           ON u.ApplicationUserId = s.ApplicationUserId
    WHERE  s.SourceId = @SourceId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Source_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   s.SourceId,
             s.Title,
             s.SourceType,
             s.Citation,
             s.Description,
             s.DocumentDate,
             s.Location,
             s.Repository,
             s.AttachedFileUrl,
             s.FileId,
             s.ApplicationUserId,
             u.UserName AS Username,
             s.PublishDate,
             s.UpdateDate
    FROM     dbo.Sources AS s
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = s.ApplicationUserId
    ORDER BY s.Title, s.SourceId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Source_Search
@Query NVARCHAR (200)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Search AS NVARCHAR (204) = N'%' + ISNULL(@Query, N'') + N'%';
    SELECT   s.SourceId,
             s.Title,
             s.SourceType,
             s.Citation,
             s.Description,
             s.DocumentDate,
             s.Location,
             s.Repository,
             s.AttachedFileUrl,
             s.FileId,
             s.ApplicationUserId,
             u.UserName AS Username,
             s.PublishDate,
             s.UpdateDate
    FROM     dbo.Sources AS s
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = s.ApplicationUserId
    WHERE    s.Title LIKE @Search
             OR s.SourceType LIKE @Search
             OR s.Citation LIKE @Search
             OR s.Description LIKE @Search
             OR s.Location LIKE @Search
             OR s.Repository LIKE @Search
    ORDER BY s.Title, s.SourceId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Source_Upsert
@SourceId INT, @Title NVARCHAR (100), @SourceType NVARCHAR (50), @Citation NVARCHAR (1000), @Description NVARCHAR (MAX), @DocumentDate DATETIME, @Location NVARCHAR (100), @Repository NVARCHAR (100), @AttachedFileUrl NVARCHAR (500), @FileId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @SourceId IS NOT NULL
       AND @SourceId > 0
       AND EXISTS (SELECT 1
                   FROM   dbo.Sources
                   WHERE  SourceId = @SourceId)
        BEGIN
            UPDATE dbo.Sources
            SET    Title             = @Title,
                   SourceType        = @SourceType,
                   Citation          = @Citation,
                   Description       = @Description,
                   DocumentDate      = @DocumentDate,
                   Location          = @Location,
                   Repository        = @Repository,
                   AttachedFileUrl   = @AttachedFileUrl,
                   FileId            = @FileId,
                   ApplicationUserId = @ApplicationUserId,
                   UpdateDate        = GETDATE()
            WHERE  SourceId = @SourceId;
        END
    ELSE
        BEGIN
            INSERT  INTO dbo.Sources (
                Title,
                SourceType,
                Citation,
                Description,
                DocumentDate,
                Location,
                Repository,
                AttachedFileUrl,
                FileId,
                ApplicationUserId,
                PublishDate,
                UpdateDate
            )
            VALUES                  (@Title, @SourceType, @Citation, @Description, @DocumentDate, @Location, @Repository, @AttachedFileUrl, @FileId, @ApplicationUserId, GETDATE(), GETDATE());
            SET @SourceId = CONVERT (INT, SCOPE_IDENTITY());
        END
    SELECT @SourceId;
END


GO
CREATE OR ALTER PROCEDURE dbo.ResearchNote_Delete
@ResearchNoteId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE dbo.ResearchNotes
    WHERE  ResearchNoteId = @ResearchNoteId;
END


GO
CREATE OR ALTER PROCEDURE dbo.ResearchNote_Get
@ResearchNoteId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT r.ResearchNoteId,
           r.AncestorProfileId,
           r.Title,
           r.Content,
           r.Status,
           r.ConfidenceLevel,
           r.Tags,
           r.ApplicationUserId,
           u.UserName AS Username,
           r.PublishDate,
           r.UpdateDate
    FROM   dbo.ResearchNotes AS r
           LEFT OUTER JOIN
           dbo.ApplicationUser AS u
           ON u.ApplicationUserId = r.ApplicationUserId
    WHERE  r.ResearchNoteId = @ResearchNoteId;
END


GO
CREATE OR ALTER PROCEDURE dbo.ResearchNote_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   r.ResearchNoteId,
             r.AncestorProfileId,
             r.Title,
             r.Content,
             r.Status,
             r.ConfidenceLevel,
             r.Tags,
             r.ApplicationUserId,
             u.UserName AS Username,
             r.PublishDate,
             r.UpdateDate
    FROM     dbo.ResearchNotes AS r
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = r.ApplicationUserId
    ORDER BY r.UpdateDate DESC, r.ResearchNoteId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.ResearchNote_GetByAncestorProfileId
@AncestorProfileId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   r.ResearchNoteId,
             r.AncestorProfileId,
             r.Title,
             r.Content,
             r.Status,
             r.ConfidenceLevel,
             r.Tags,
             r.ApplicationUserId,
             u.UserName AS Username,
             r.PublishDate,
             r.UpdateDate
    FROM     dbo.ResearchNotes AS r
             LEFT OUTER JOIN
             dbo.ApplicationUser AS u
             ON u.ApplicationUserId = r.ApplicationUserId
    WHERE    r.AncestorProfileId = @AncestorProfileId
    ORDER BY r.UpdateDate DESC, r.ResearchNoteId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.ResearchNote_Upsert
@ResearchNoteId INT, @AncestorProfileId INT, @Title NVARCHAR (100), @Content NVARCHAR (MAX), @Status NVARCHAR (50), @ConfidenceLevel NVARCHAR (50), @Tags NVARCHAR (200), @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @ResearchNoteId IS NOT NULL
       AND @ResearchNoteId > 0
       AND EXISTS (SELECT 1
                   FROM   dbo.ResearchNotes
                   WHERE  ResearchNoteId = @ResearchNoteId)
        BEGIN
            UPDATE dbo.ResearchNotes
            SET    AncestorProfileId = @AncestorProfileId,
                   Title             = @Title,
                   Content           = @Content,
                   Status            = @Status,
                   ConfidenceLevel   = @ConfidenceLevel,
                   Tags              = @Tags,
                   ApplicationUserId = @ApplicationUserId,
                   UpdateDate        = GETDATE()
            WHERE  ResearchNoteId = @ResearchNoteId;
        END
    ELSE
        BEGIN
            INSERT  INTO dbo.ResearchNotes (
                AncestorProfileId,
                Title,
                Content,
                Status,
                ConfidenceLevel,
                Tags,
                ApplicationUserId,
                PublishDate,
                UpdateDate
            )
            VALUES                        (@AncestorProfileId, @Title, @Content, @Status, @ConfidenceLevel, @Tags, @ApplicationUserId, GETDATE(), GETDATE());
            SET @ResearchNoteId = CONVERT (INT, SCOPE_IDENTITY());
        END
    SELECT @ResearchNoteId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Notification_GetByApplicationUserId
@ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   n.NotificationId,
             n.ApplicationUserId,
             n.NotificationType,
             n.Message,
             n.ReferenceId,
             n.IsRead,
             n.CreatedDate
    FROM     dbo.Notifications AS n
    WHERE    n.ApplicationUserId = @ApplicationUserId
    ORDER BY n.CreatedDate DESC, n.NotificationId DESC;
END


GO
CREATE OR ALTER PROCEDURE dbo.Notification_MarkRead
@NotificationId INT, @ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Notifications
    SET    IsRead = 1
    WHERE  NotificationId = @NotificationId
           AND ApplicationUserId = @ApplicationUserId;
END


GO
CREATE OR ALTER PROCEDURE dbo.Notification_MarkAllRead
@ApplicationUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Notifications
    SET    IsRead = 1
    WHERE  ApplicationUserId = @ApplicationUserId
           AND IsRead = 0;
END