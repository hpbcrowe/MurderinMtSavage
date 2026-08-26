# Genealogy Feature Prioritization (Merged + Ranked)

Scales used:

- Complexity: 1 (very low) to 5 (very high)
- Importance: 1 (nice-to-have) to 5 (critical)

Ordering logic:

- Single ranked list (one list only)
- Sorted by Complexity (low to high)
- Within same complexity, sorted by Importance (high to low)
- "Do First" and "Start Order" indicate what to build first

| Rank | Feature                                            | Complexity | Importance | Do First | Start Order | Merged detail from your notes                                                                                                                    |
| ---- | -------------------------------------------------- | ---------: | ---------: | :------: | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Research Status Tracking                           |          2 |          5 |   Yes    |           5 | Add statuses across notes/profiles: Not Started, Researching, Brick Wall, Needs Verification, Proven.                                            |
| 2    | Turn Blogs Into Structured Research Records        |          2 |          5 |   Yes    |           3 | Extend posts with Ancestor Name, Birth/Death, Location, Branch, Tags, Confidence (Proven/Likely/Possible/Theory).                                |
| 3    | Advanced Search                                    |          2 |          5 |   Yes    |           4 | Filter by person, surname, year ranges, location, record type, author, tags, confidence, status.                                                 |
| 4    | Follow Ancestors, Surnames, Locations, Branches    |          2 |          4 |   Yes    |           7 | Follow graph drives discovery and notifications when matching content appears.                                                                   |
| 5    | Family Story Mode (Researcher View vs Family View) |          2 |          4 |    No    |           - | Same data, two experiences: evidence/citations for researchers, narratives/photos/maps for relatives.                                            |
| 6    | Gamification                                       |          2 |          3 |    No    |           - | Add badges like First Research Post, Census Expert, Brick Wall Solver to increase participation.                                                 |
| 7    | Source Repository and Citation Management          |          3 |          5 |   Yes    |           2 | First-class sources: census, vital records, military, obituaries, deeds, clippings, with citation metadata and multi-source linking per finding. |
| 8    | Notifications (Real-time + Digest)                 |          3 |          5 |   Yes    |           1 | Alert users on comments, uploads, follows, surname mentions, and ancestor updates via SignalR plus daily/weekly digest.                          |
| 9    | Ancestor Profiles and Family Tree Integration      |          3 |          5 |   Yes    |           6 | Make AncestorProfile central; link relationships, sources, photos, notes, timelines, blog references.                                            |
| 10   | Platform Architecture Foundations                  |          3 |          5 |   Yes    |           8 | ASP.NET Core Identity, EF Core genealogy entities, SignalR, Hangfire, and Blob/S3-style document storage.                                        |
| 11   | Research Discussions (Threaded, Evidence-Focused)  |          3 |          4 |    No    |           - | Replace flat comments with research threads and evidence debates on findings.                                                                    |
| 12   | Private Messaging and Research Invitations         |          3 |          4 |    No    |           - | Collaboration workflows for branch invites, question resolution, and researcher-to-researcher communication.                                     |
| 13   | Research Command Center                            |          3 |          4 |    No    |           - | Dashboard for missing records, unverified links, active mysteries, collaboration requests, and next actions.                                     |
| 14   | Timeline View as Primary Experience                |          3 |          4 |    No    |           - | Event-centric ancestor timeline with historical context overlays and source-backed events.                                                       |
| 15   | Smart Duplicate Resolution                         |          3 |          4 |    No    |           - | Side-by-side merge with similarity score and conflict review (dates, names, places, parents, sources).                                           |
| 16   | Mobile-First Quick Capture                         |          3 |          4 |    No    |           - | Field capture for cemetery visits, markers, conversations, and photos with quick attachment to ancestors/sources.                                |
| 17   | Family Migration Playback                          |          4 |          3 |    No    |           - | Animated place-to-place migration playback over time using timeline event coordinates.                                                           |
| 18   | Oral History Capture                               |          4 |          4 |    No    |           - | Mobile recording for stories/letters/recipes/photos with extraction of names, places, dates, relationships.                                      |
| 19   | Drag-and-Drop Document Processing + OCR            |          4 |          5 |    No    |           - | Drop files into editor, OCR extract entities, suggest ancestor/source links, and confirm before save.                                            |
| 20   | DNA Match Integration                              |          4 |          3 |    No    |           - | Store matches (Ancestry, 23andMe, MyHeritage), shared cM, and hypothesized relationship tied to documentary evidence.                            |
| 21   | Explain Historical Context Automatically           |          5 |          3 |    No    |           - | AI-generated context for occupations, counties, migration, and period-specific conditions with citation controls.                                |
| 22   | Research Collaboration Like GitHub                 |          5 |          5 |    No    |           - | Proposed relationship changes, review/approval workflow, comments, rollback, and immutable change history.                                       |

Notes on MVP scope embedded in this same ranking:

- If you want a lean first release, prioritize the rows marked Do First in Start Order sequence.
- This supports your recommended core schema direction: AncestorProfiles, AncestorRelationships, Sources, AncestorSources, ResearchNotes, AncestorFollowers, Notifications, then expand outward.

You already have a solid foundation: accounts, blogs, photos, comments, and a "most commented" home page. The challenge with genealogy is that people are usually searching for connections, evidence, collaboration, and notifications, not just reading articles.

If I were redesigning the application specifically for family genealogical research, I'd organize enhancements into five areas:

1. Turn Blogs Into Research Records
   Right now, a blog post is likely treated as free-form content. Consider adding genealogy-specific fields:

Research Entry
Title
Ancestor Name
Birth Date
Death Date
Location
Family Branch
Tags (Smith, Crowe, Utah, England, Military, Census, etc.)
Confidence Level
Proven
Likely
Possible
Theory
Benefits
Users can:

Search by ancestor
Search by location
Search by surname
Filter by evidence level
Example:

Blog Post:
"Found Benjamin Crowe in the 1880 Census"

Metadata:

Person: Benjamin Crowe
Location: Salt Lake City
Record Type: Census
Confidence: Proven
This makes information much easier to discover years later.

2. Source & Citation Management
   Genealogy lives and dies on source documentation.

Create a Source Repository
Instead of just attaching photos, allow users to upload:

Census records
Birth certificates
Death certificates
Marriage records
Military records
Obituaries
Newspaper clippings
Land deeds
Each document could contain:

Source Name
Source Type
Date Created
Place
Repository
Citation
Attached File
Better Yet
Allow a research note to reference multiple sources.

Example:

Research Finding: "William Crowe moved to Utah in 1879"

Supporting Sources: ✓ Census 1880 ✓ Newspaper Article 1879 ✓ Land Record 1881

This gives the site real genealogical value.

3. Family Tree Integration
   This would be the biggest enhancement.

Create Person Profiles
Instead of only blog posts:

Person
├── Birth
├── Death
├── Parents
├── Children
├── Photos
├── Sources
├── Research Notes
Then allow users to link content.

Example:

Blog: "Possible father of William Crowe"

Linked To:

William Crowe
John Crowe
Now users can navigate the family tree instead of searching through articles.

4. Collaboration Features
   This could significantly increase engagement.

Private Messaging
Allow users to:

Contact researchers
Ask questions
Share findings
Resolve conflicting information
Example:

Message:
I noticed your census record for William Crowe.
I have a marriage record that may connect him to John Crowe.
Research Invitations
Invite users to collaborate:

Collaborators on Crowe Family Branch

Ben
Sarah
Emily
Shared editing permissions could help build a branch collaboratively.

5. Notifications (Very Important)
   This is probably the highest-impact improvement.

Notify Users When:
Someone comments
Sarah commented on your research note.
Someone uploads a document
New marriage record added for William Crowe.
Someone follows an ancestor
You are following Benjamin Crowe.
New information was added.
Someone mentions a surname
A new post mentions Crowe.
Implementation options:

Real-time SignalR notifications
Email notifications
Daily digest email
Weekly digest email 6. Drag & Drop Document Processing
I love this idea.

Current
Upload document.

Improved
Drag document onto editor:

Drop birth certificate here...
System:

Uploads document
OCR extracts text
Suggests:
Person Names
Dates
Locations
Relationships
Example:

User drops a census image.

System extracts:

Benjamin Crowe
Age 42
Salt Lake County
1880 Census
User confirms and saves.

This could save researchers enormous amounts of typing.

7. Research Discussions Instead of Comments
   Traditional comments get messy.

Consider:

Research Thread
Example:

Finding: William Crowe was born in England.

Discussion:

Sarah: Found supporting census.
Ben: Birth certificate says Scotland.
Emily: Passenger list indicates Liverpool departure.

Research often involves evidence debates, so threaded discussions work better than simple comments.

---

# 8. Follow Ancestors and Surnames

Like social media, but genealogy-focused.

### Follow

- Ancestor
- Surname
- Geographic Location
- Family Branch

Examples:

````text
Follow:
Crowe
Utah
England
When new content appears:

New research matches your interests.
9. Advanced Search
Essential as the database grows.

Search filters:

Person Name
Surname
Birth Year
Death Year
Location
Record Type
Author
Tags
Example:

Crowe
England
1850-1900
Military Records
10. Research Status Tracking
Researchers often leave investigations unfinished.

Create statuses:

Not Started
Researching
Brick Wall
Needs Verification
Proven
Example:

Question:
Who were William Crowe's parents?

Status:
Brick Wall
Others can jump in and help.

11. DNA Match Integration
Future enhancement.

Allow users to record:

Ancestry DNA matches
23andMe matches
MyHeritage matches
Example:

Shared DNA:
72 cM

Possible Relationship:
3rd Cousin
``
This becomes powerful when combined with documentary evidence.

12. Gamification
Encourages contributions.

Award badges:

First Research Post
10 Sources Uploaded
Census Expert
Military Records Contributor
Brick Wall Solver
This can keep family members engaged.

13. Suggested Architecture Enhancements
Given your ASP.NET Core + Angular stack:

ASP.NET Core
Identity for authentication
SignalR for notifications
Hangfire for scheduled digest emails
EF Core for genealogy entities
Azure Blob Storage or S3-compatible storage for documents
Angular
Angular Material
CDK Drag-and-Drop
Rich text editor (Quill or TinyMCE)
SignalR client for live notifications
OCR
Azure AI Document Intelligence
Tesseract OCR (free option)
If I were prioritizing features
Phase 1 (Highest Value)

Notifications
Private Messaging
Tags/Surnames
Drag-and-drop document upload
Advanced Search
Phase 2 6. Source Repository 7. Ancestor Profiles 8. Follow Ancestors/Surnames

Phase 3 9. Family Tree Visualization 10. OCR Extraction 11. DNA Integration

The single feature that would most differentiate your site from a typical blogging platform is creating structured Ancestor Profiles linked to Sources and Research Notes, because genealogy researchers think in terms of people and evidence, not blog posts. Blogs then become one way of documenting discoveries rather than the primary object in the system.


You already have a solid foundation: accounts, blogs, photos, comments, and a "most commented" home page. The challenge with genealogy is that people are usually searching for connections, evidence, collaboration, and notifications, not just reading articles.

If I were redesigning the application specifically for family genealogical research, I'd organize enhancements into five areas:

1. Turn Blogs Into Research Records
Right now, a blog post is likely treated as free-form content. Consider adding genealogy-specific fields:

Research Entry
Title
Ancestor Name
Birth Date
Death Date
Location
Family Branch
Tags (Smith, Crowe, Utah, England, Military, Census, etc.)
Confidence Level
Proven
Likely
Possible
Theory
Benefits
Users can:

Search by ancestor
Search by location
Search by surname
Filter by evidence level
Example:

Blog Post:
"Found Benjamin Crowe in the 1880 Census"

Metadata:

Person: Benjamin Crowe
Location: Salt Lake City
Record Type: Census
Confidence: Proven
This makes information much easier to discover years later.

2. Source & Citation Management
Genealogy lives and dies on source documentation.

Create a Source Repository
Instead of just attaching photos, allow users to upload:

Census records
Birth certificates
Death certificates
Marriage records
Military records
Obituaries
Newspaper clippings
Land deeds
Each document could contain:

Source Name
Source Type
Date Created
Place
Repository
Citation
Attached File
Better Yet
Allow a research note to reference multiple sources.

Example:

Research Finding: "William Crowe moved to Utah in 1879"

Supporting Sources: ✓ Census 1880 ✓ Newspaper Article 1879 ✓ Land Record 1881

This gives the site real genealogical value.

3. Family Tree Integration
This would be the biggest enhancement.

Create Person Profiles
Instead of only blog posts:

Person
├── Birth
├── Death
├── Parents
├── Children
├── Photos
├── Sources
├── Research Notes
Then allow users to link content.

Example:

Blog: "Possible father of William Crowe"

Linked To:

William Crowe
John Crowe
Now users can navigate the family tree instead of searching through articles.

4. Collaboration Features
This could significantly increase engagement.

Private Messaging
Allow users to:

Contact researchers
Ask questions
Share findings
Resolve conflicting information
Example:

Message:
I noticed your census record for William Crowe.
I have a marriage record that may connect him to John Crowe.
Research Invitations
Invite users to collaborate:

Collaborators on Crowe Family Branch

Ben
Sarah
Emily
Shared editing permissions could help build a branch collaboratively.

5. Notifications (Very Important)
This is probably the highest-impact improvement.

Notify Users When:
Someone comments
Sarah commented on your research note.
Someone uploads a document
New marriage record added for William Crowe.
Someone follows an ancestor
You are following Benjamin Crowe.
New information was added.
Someone mentions a surname
A new post mentions Crowe.
Implementation options:

Real-time SignalR notifications
Email notifications
Daily digest email
Weekly digest email
6. Drag & Drop Document Processing
I love this idea.

Current
Upload document.

Improved
Drag document onto editor:

Drop birth certificate here...
System:

Uploads document
OCR extracts text
Suggests:
Person Names
Dates
Locations
Relationships
Example:

User drops a census image.

System extracts:

Benjamin Crowe
Age 42
Salt Lake County
1880 Census
User confirms and saves.

This could save researchers enormous amounts of typing.

7. Research Discussions Instead of Comments
Traditional comments get messy.

Consider:

Research Thread
Example:

Finding: William Crowe was born in England.

Discussion:

Sarah: Found supporting census.
Ben: Birth certificate says Scotland.
Emily: Passenger list indicates Liverpool departure.

Research often involves evidence debates, so threaded discussions work better than simple comments.

---

# 8. Follow Ancestors and Surnames

Like social media, but genealogy-focused.

### Follow

- Ancestor
- Surname
- Geographic Location
- Family Branch

Examples:

```text
Follow:
Crowe
Utah
England
When new content appears:

New research matches your interests.
9. Advanced Search
Essential as the database grows.

Search filters:

Person Name
Surname
Birth Year
Death Year
Location
Record Type
Author
Tags
Example:

Crowe
England
1850-1900
Military Records
10. Research Status Tracking
Researchers often leave investigations unfinished.

Create statuses:

Not Started
Researching
Brick Wall
Needs Verification
Proven
Example:

Question:
Who were William Crowe's parents?

Status:
Brick Wall
Others can jump in and help.

11. DNA Match Integration
Future enhancement.

Allow users to record:

Ancestry DNA matches
23andMe matches
MyHeritage matches
Example:

Shared DNA:
72 cM

Possible Relationship:
3rd Cousin
``
This becomes powerful when combined with documentary evidence.

12. Gamification
Encourages contributions.

Award badges:

First Research Post
10 Sources Uploaded
Census Expert
Military Records Contributor
Brick Wall Solver
This can keep family members engaged.

13. Suggested Architecture Enhancements
Given your ASP.NET Core + Angular stack:

ASP.NET Core
Identity for authentication
SignalR for notifications
Hangfire for scheduled digest emails
EF Core for genealogy entities
Azure Blob Storage or S3-compatible storage for documents
Angular
Angular Material
CDK Drag-and-Drop
Rich text editor (Quill or TinyMCE)
SignalR client for live notifications
OCR
Azure AI Document Intelligence
Tesseract OCR (free option)
If I were prioritizing features
Phase 1 (Highest Value)

Notifications
Private Messaging
Tags/Surnames
Drag-and-drop document upload
Advanced Search
Phase 2 6. Source Repository 7. Ancestor Profiles 8. Follow Ancestors/Surnames

Phase 3 9. Family Tree Visualization 10. OCR Extraction 11. DNA Integration

The single feature that would most differentiate your site from a typical blogging platform is creating structured Ancestor Profiles linked to Sources and Research Notes, because genealogy researchers think in terms of people and evidence, not blog posts. Blogs then become one way of documenting discoveries rather than the primary object in the system.

For a genealogy application, I recommend treating AncestorProfile as the central entity and linking everything else (sources, photos, comments, relationships, notifications) to it.

Core Tables
AspNetUsers
Use ASP.NET Identity for authentication.

AspNetUsers
-----------
Id (PK)
UserName
Email
FirstName
LastName
CreatedDate
AncestorProfiles
AncestorProfiles
----------------
AncestorId (PK)
CreatedByUserId (FK)
FirstName
MiddleName
LastName
Suffix
Gender
BirthDate
BirthLocation
DeathDate
DeathLocation
Biography
ResearchStatus
ProfilePhotoId (FK)
CreatedDate
ModifiedDate
``
ResearchStatus Values

Proven
Likely
Possible
Needs Verification
Brick Wall
Family Relationships
Instead of storing parents and children directly in the ancestor record, use a relationship table.

AncestorRelationships
---------------------
RelationshipId (PK)
AncestorId (FK)
RelatedAncestorId (FK)
RelationshipType
CreatedDate
Relationship Types
Parent
Child
Spouse
Sibling
Adoptive Parent
Adoptive Child
Example:

John Crowe
Parent → William Crowe

William Crowe
Child → John Crowe
This provides unlimited flexibility for building a family tree.

Sources / Documents
Sources
Sources
-------
SourceId (PK)
CreatedByUserId (FK)
Title
SourceType
Citation
Description
DocumentDate
Location
FileId (FK)
CreatedDate
Source Types
Birth Certificate
Death Certificate
Marriage Record
Census
Military
Obituary
Land Record
Newspaper
Immigration Record
Other
AncestorSources
Many ancestors can be connected to many documents.

AncestorSources
---------------
AncestorSourceId (PK)
AncestorId (FK)
SourceId (FK)
RelationshipNote
ConfidenceLevel
Example:

1880 Census
-> William Crowe
-> Mary Crowe
-> Sarah Crowe
Media
Files
Files
-----
FileId (PK)
FileName
StoragePath
ContentType
FileSize
UploadedByUserId
UploadedDate
Photos
Photos
------
PhotoId (PK)
AncestorId (FK)
FileId (FK)
Caption
PhotoDate
Location
CreatedDate
Research Notes
More structured than blog posts.

ResearchNotes
-------------
ResearchNoteId (PK)
AncestorId (FK)
CreatedByUserId (FK)
Title
Content
Status
CreatedDate
ModifiedDate
Status:

Draft
Active Research
Solved
Archived
Blogs
Keep your existing blog functionality.

Blogs
-----
BlogId (PK)
CreatedByUserId (FK)
AncestorId (FK) NULL
Title
Content
CreatedDate
ModifiedDate
ViewCount
A blog can optionally be linked to an ancestor.

Example:

Blog:
"New Evidence for William Crowe"

Linked Ancestor:
William Crowe
Comments
Comments
--------
CommentId (PK)
BlogId (FK) NULL
ResearchNoteId (FK) NULL
CreatedByUserId (FK)
CommentText
CreatedDate
You could later support threaded comments:

ParentCommentId
Tags
Tags
Tags
----
TagId (PK)
TagName
``
Examples:

Crowe
England
Utah
Military
Immigration
AncestorTags
AncestorTags
------------
AncestorId (FK)
TagId (FK)
Followers
Allows users to follow ancestors.

AncestorFollowers
-----------------
FollowerId (PK)
AncestorId (FK)
UserId (FK)
CreatedDate
Example:

Ben follows William Crowe
Notifications
Notifications
-------------
NotificationId (PK)
UserId (FK)
NotificationType
Message
ReferenceId
IsRead
CreatedDate
Notification Types
CommentAdded
BlogCreated
DocumentUploaded
PhotoUploaded
ResearchUpdated
AncestorUpdated
Private Messaging
Conversations
Conversations
-------------
ConversationId (PK)
CreatedDate
ConversationParticipants
ConversationParticipants
------------------------
ConversationId (FK)
UserId (FK)
Messages
Messages
--------
MessageId (PK)
ConversationId (FK)
SenderUserId (FK)
MessageText
CreatedDate
ReadDate
Timeline Events
This is one of the most valuable genealogy features.

TimelineEvents
--------------
TimelineEventId (PK)
AncestorId (FK)
EventType
EventDate
Location
Description
SourceId (FK)
Event Types
Birth
Marriage
Census
Military Service
Immigration
Residence
Occupation
Death
Burial
Example:

1848 - Marriage
1870 - Census
1879 - Immigration
1891 - Death
Entity Relationship Overview
User
│
├── Blogs
├── Research Notes
├── Messages
└── Notifications

Ancestor Profile
│
├── Relationships
├── Sources
├── Photos
├── Timeline Events
├── Research Notes
├── Blogs
├── Followers
└── Tags

Sources
│
└── Files

Conversations
│
└── Messages
MVP Schema (Recommended First Release)
If you want to keep the project manageable, start with:

AncestorProfiles
AncestorRelationships
Sources
AncestorSources
ResearchNotes
AncestorFollowers
Notifications
These seven tables will give you the core genealogy functionality while allowing you to reuse your existing ASP.NET Identity, blog, photo, and comment infrastructure. Later, you can add family tree visualization, OCR extraction, DNA matches, and advanced collaboration features without redesigning the schema.



````
