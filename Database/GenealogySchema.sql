SET ANSI_NULLS ON;


GO
SET QUOTED_IDENTIFIER ON;


GO
-- Schema-only migration. This script only adds missing columns, tables, and indexes.
-- Stored procedures live in Database/GenealogyProcedures.sql so schema deployment does not touch data-bearing routines.
IF COL_LENGTH('dbo.Blog', 'AncestorProfileId') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD AncestorProfileId INT NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'SourceId') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD SourceId INT NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'AncestorName') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD AncestorName NVARCHAR (100) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'RecordType') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD RecordType NVARCHAR (100) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'Location') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD Location NVARCHAR (100) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'FamilyBranch') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD FamilyBranch NVARCHAR (100) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'Tags') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD Tags NVARCHAR (200) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'ConfidenceLevel') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD ConfidenceLevel NVARCHAR (50) NULL;
    END


GO
IF COL_LENGTH('dbo.Blog', 'ResearchStatus') IS NULL
    BEGIN
        ALTER TABLE dbo.Blog
            ADD ResearchStatus NVARCHAR (50) NULL;
    END


GO
IF OBJECT_ID('dbo.Blog_Upsert', 'P') IS NOT NULL
    BEGIN
        DROP PROCEDURE dbo.Blog_Upsert;
    END


GO
IF TYPE_ID('dbo.BlogType') IS NOT NULL
    BEGIN
        DROP TYPE dbo.BlogType;
    END


GO
IF TYPE_ID('dbo.BlogType') IS NULL
    BEGIN
        EXECUTE ('CREATE TYPE dbo.BlogType AS TABLE
    (
        BlogId INT NOT NULL,
        Title NVARCHAR(50) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        PhotoId INT NULL,
        AncestorProfileId INT NULL,
        SourceId INT NULL,
        AncestorName NVARCHAR(100) NULL,
        RecordType NVARCHAR(100) NULL,
        Location NVARCHAR(100) NULL,
        FamilyBranch NVARCHAR(100) NULL,
        Tags NVARCHAR(200) NULL,
        ConfidenceLevel NVARCHAR(50) NULL,
        ResearchStatus NVARCHAR(50) NULL
    )');
    END


GO
-- Genealogy schema
IF OBJECT_ID('dbo.AncestorProfiles', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.AncestorProfiles (
            AncestorProfileId INT            IDENTITY (1, 1) NOT NULL CONSTRAINT PK_AncestorProfiles PRIMARY KEY,
            FirstName         NVARCHAR (50)  NOT NULL,
            MiddleName        NVARCHAR (50)  NULL,
            LastName          NVARCHAR (50)  NOT NULL,
            Suffix            NVARCHAR (20)  NULL,
            Gender            NVARCHAR (20)  NULL,
            BirthDate         DATETIME       NULL,
            BirthLocation     NVARCHAR (100) NULL,
            DeathDate         DATETIME       NULL,
            DeathLocation     NVARCHAR (100) NULL,
            Biography         NVARCHAR (MAX) NULL,
            ResearchStatus    NVARCHAR (50)  NULL,
            FamilyBranch      NVARCHAR (100) NULL,
            Tags              NVARCHAR (200) NULL,
            ConfidenceLevel   NVARCHAR (50)  NULL,
            ProfilePhotoId    INT            NULL,
            ApplicationUserId INT            NOT NULL,
            PublishDate       DATETIME       CONSTRAINT DF_AncestorProfiles_PublishDate DEFAULT GETDATE() NOT NULL,
            UpdateDate        DATETIME       CONSTRAINT DF_AncestorProfiles_UpdateDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT FK_AncestorProfiles_AspNetUsers FOREIGN KEY (ApplicationUserId) REFERENCES dbo.ApplicationUser (ApplicationUserId)
        );
    END


GO
IF OBJECT_ID('dbo.AncestorRelationships', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.AncestorRelationships (
            AncestorRelationshipId   INT           IDENTITY (1, 1) NOT NULL CONSTRAINT PK_AncestorRelationships PRIMARY KEY,
            AncestorProfileId        INT           NOT NULL,
            RelatedAncestorProfileId INT           NOT NULL,
            RelationshipType         NVARCHAR (50) NOT NULL,
            CreatedDate              DATETIME      CONSTRAINT DF_AncestorRelationships_CreatedDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT CK_AncestorRelationships_DifferentAncestors CHECK (AncestorProfileId <> RelatedAncestorProfileId),
            CONSTRAINT FK_AncestorRelationships_AncestorProfile FOREIGN KEY (AncestorProfileId) REFERENCES dbo.AncestorProfiles (AncestorProfileId),
            CONSTRAINT FK_AncestorRelationships_RelatedAncestorProfile FOREIGN KEY (RelatedAncestorProfileId) REFERENCES dbo.AncestorProfiles (AncestorProfileId)
        );
    END


GO
IF OBJECT_ID('dbo.AncestorFollowers', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.AncestorFollowers (
            AncestorFollowerId INT      IDENTITY (1, 1) NOT NULL CONSTRAINT PK_AncestorFollowers PRIMARY KEY,
            AncestorProfileId  INT      NOT NULL,
            ApplicationUserId  INT      NOT NULL,
            CreatedDate        DATETIME CONSTRAINT DF_AncestorFollowers_CreatedDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT UQ_AncestorFollowers_Ancestor_User UNIQUE (AncestorProfileId, ApplicationUserId),
            CONSTRAINT FK_AncestorFollowers_AncestorProfile FOREIGN KEY (AncestorProfileId) REFERENCES dbo.AncestorProfiles (AncestorProfileId) ON DELETE CASCADE,
            CONSTRAINT FK_AncestorFollowers_AspNetUsers FOREIGN KEY (ApplicationUserId) REFERENCES dbo.ApplicationUser (ApplicationUserId) ON DELETE CASCADE
        );
    END


GO
IF OBJECT_ID('dbo.Sources', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Sources (
            SourceId          INT             IDENTITY (1, 1) NOT NULL CONSTRAINT PK_Sources PRIMARY KEY,
            Title             NVARCHAR (100)  NOT NULL,
            SourceType        NVARCHAR (50)   NULL,
            Citation          NVARCHAR (1000) NULL,
            Description       NVARCHAR (MAX)  NULL,
            DocumentDate      DATETIME        NULL,
            Location          NVARCHAR (100)  NULL,
            Repository        NVARCHAR (100)  NULL,
            AttachedFileUrl   NVARCHAR (500)  NULL,
            FileId            INT             NULL,
            ApplicationUserId INT             NOT NULL,
            PublishDate       DATETIME        CONSTRAINT DF_Sources_PublishDate DEFAULT GETDATE() NOT NULL,
            UpdateDate        DATETIME        CONSTRAINT DF_Sources_UpdateDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT FK_Sources_AspNetUsers FOREIGN KEY (ApplicationUserId) REFERENCES dbo.ApplicationUser (ApplicationUserId)
        );
    END


GO
IF OBJECT_ID('dbo.ResearchNotes', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.ResearchNotes (
            ResearchNoteId    INT            IDENTITY (1, 1) NOT NULL CONSTRAINT PK_ResearchNotes PRIMARY KEY,
            AncestorProfileId INT            NULL,
            Title             NVARCHAR (100) NOT NULL,
            Content           NVARCHAR (MAX) NOT NULL,
            Status            NVARCHAR (50)  NULL,
            ConfidenceLevel   NVARCHAR (50)  NULL,
            Tags              NVARCHAR (200) NULL,
            ApplicationUserId INT            NOT NULL,
            PublishDate       DATETIME       CONSTRAINT DF_ResearchNotes_PublishDate DEFAULT GETDATE() NOT NULL,
            UpdateDate        DATETIME       CONSTRAINT DF_ResearchNotes_UpdateDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT FK_ResearchNotes_AncestorProfiles FOREIGN KEY (AncestorProfileId) REFERENCES dbo.AncestorProfiles (AncestorProfileId) ON DELETE SET NULL,
            CONSTRAINT FK_ResearchNotes_AspNetUsers FOREIGN KEY (ApplicationUserId) REFERENCES dbo.ApplicationUser (ApplicationUserId)
        );
    END


GO
IF OBJECT_ID('dbo.Notifications', 'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Notifications (
            NotificationId    INT             IDENTITY (1, 1) NOT NULL CONSTRAINT PK_Notifications PRIMARY KEY,
            ApplicationUserId INT             NOT NULL,
            NotificationType  NVARCHAR (50)   NOT NULL,
            Message           NVARCHAR (1000) NOT NULL,
            ReferenceId       INT             NULL,
            IsRead            BIT             CONSTRAINT DF_Notifications_IsRead DEFAULT 0 NOT NULL,
            CreatedDate       DATETIME        CONSTRAINT DF_Notifications_CreatedDate DEFAULT GETDATE() NOT NULL,
            CONSTRAINT FK_Notifications_AspNetUsers FOREIGN KEY (ApplicationUserId) REFERENCES dbo.ApplicationUser (ApplicationUserId) ON DELETE CASCADE
        );
    END


GO
IF NOT EXISTS (SELECT 1
               FROM   sys.indexes
               WHERE  name = 'IX_AncestorProfiles_LastName_FirstName'
                      AND object_id = OBJECT_ID('dbo.AncestorProfiles'))
    BEGIN
        CREATE INDEX IX_AncestorProfiles_LastName_FirstName
            ON dbo.AncestorProfiles(LastName, FirstName);
    END


GO
IF NOT EXISTS (SELECT 1
               FROM   sys.indexes
               WHERE  name = 'IX_Sources_Title'
                      AND object_id = OBJECT_ID('dbo.Sources'))
    BEGIN
        CREATE INDEX IX_Sources_Title
            ON dbo.Sources(Title);
    END


GO
IF NOT EXISTS (SELECT 1
               FROM   sys.indexes
               WHERE  name = 'IX_ResearchNotes_AncestorProfileId'
                      AND object_id = OBJECT_ID('dbo.ResearchNotes'))
    BEGIN
        CREATE INDEX IX_ResearchNotes_AncestorProfileId
            ON dbo.ResearchNotes(AncestorProfileId);
    END


GO
IF NOT EXISTS (SELECT 1
               FROM   sys.indexes
               WHERE  name = 'IX_Notifications_ApplicationUserId_IsRead'
                      AND object_id = OBJECT_ID('dbo.Notifications'))
    BEGIN
        CREATE INDEX IX_Notifications_ApplicationUserId_IsRead
            ON dbo.Notifications(ApplicationUserId, IsRead, CreatedDate DESC);
    END