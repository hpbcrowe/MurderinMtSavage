# Genealogy Feature Prioritization (Cleaned and Build-Ready)

Scales used:

- Complexity: 1 (very low) to 5 (very high)
- Importance: 1 (nice-to-have) to 5 (critical)

Ordering logic:

- Single ranked list (one list only)
- Sorted by Complexity (low to high)
- Within same complexity, sorted by Importance (high to low)
- "Do First" and "Start Order" indicate what to build first

## Ranked Features

| Rank | Feature                                           | Complexity | Importance | Do First | Start Order | Notes                                                                                         |
| ---- | ------------------------------------------------- | ---------: | ---------: | :------: | ----------: | --------------------------------------------------------------------------------------------- |
| 1    | Research Status Tracking                          |          2 |          5 |   Yes    |           5 | Statuses on notes/profiles: Not Started, Researching, Brick Wall, Needs Verification, Proven. |
| 2    | Turn Blogs Into Structured Research Records       |          2 |          5 |   Yes    |           3 | Add genealogy metadata to existing blog records and editor flow.                              |
| 3    | Advanced Search                                   |          2 |          5 |   Yes    |           4 | Filter by person, surname, year ranges, location, type, author, tags, confidence, status.     |
| 4    | Follow Ancestors, Surnames, Locations, Branches   |          2 |          4 |   Yes    |           7 | Follow graph drives notifications and discovery.                                              |
| 5    | Family Story Mode (Researcher vs Family View)     |          2 |          4 |    No    |           - | Same data, two presentation modes.                                                            |
| 6    | Gamification                                      |          2 |          3 |    No    |           - | Defer until retention baseline is measured.                                                   |
| 7    | Source Repository and Citation Management         |          3 |          5 |   Yes    |           2 | First-class source objects with strong citation metadata.                                     |
| 8    | Notifications (Real-time + Digest)                |          3 |          5 |   Yes    |           1 | SignalR real-time plus scheduled digest.                                                      |
| 9    | Ancestor Profiles and Family Tree Integration     |          3 |          5 |   Yes    |           6 | AncestorProfile is central and links to notes, sources, events, photos.                       |
| 10   | Research Discussions (Threaded, Evidence-Focused) |          3 |          4 |    No    |           - | Replace flat comments with thread + evidence references.                                      |
| 11   | Private Messaging and Research Invitations        |          3 |          4 |    No    |           - | Invite collaborators to branches/research topics.                                             |
| 12   | Research Command Center                           |          3 |          4 |    No    |           - | Dashboard for unresolved conflicts, missing records, pending tasks.                           |
| 13   | Timeline View as Primary Experience               |          3 |          4 |    No    |           - | Event-centric ancestor timeline with source anchors.                                          |
| 14   | Smart Duplicate Resolution                        |          3 |          4 |    No    |           - | Similarity scoring plus manual merge review workflow.                                         |
| 15   | Mobile-First Quick Capture                        |          3 |          4 |    No    |           - | Fast field capture for photos, notes, cemetery visits.                                        |
| 16   | Family Migration Playback                         |          4 |          3 |    No    |           - | Animated movement map using timeline coordinates.                                             |
| 17   | Oral History Capture                              |          4 |          4 |    No    |           - | Audio capture with structured indexing.                                                       |
| 18   | Drag-and-Drop Document Processing + OCR           |          4 |          5 |    No    |           - | OCR suggestions must be human-confirmed before persistence.                                   |
| 19   | DNA Match Integration                             |          4 |          3 |    No    |           - | Defer until source/citation and relationship model are stable.                                |
| 20   | Explain Historical Context Automatically          |          5 |          3 |    No    |           - | AI narrative assist only after evidence model maturity.                                       |
| 21   | Research Collaboration Like GitHub                |          5 |          5 |    No    |           - | Full proposal/review/rollback workflow; defer to later stage.                                 |

## Deferred for Now

- Gamification
- DNA Match Integration
- Explain Historical Context Automatically
- Research Collaboration Like GitHub

Reason: these are high complexity and/or policy-heavy features that should come after strong evidence, source, and relationship foundations.

## Implementation Prerequisites (Not Feature Ranked)

- Identity and permissions model for public/private profiles, branch-level collaboration, and moderation actions.
- Genealogy data model baseline: `AncestorProfile`, `AncestorRelationship`, `Source`, `AncestorSource`, `ResearchNote`, `FollowSubscription`, `Notification`.
- Background processing for digest notifications and indexing jobs.
- Blob storage standards for document uploads and stable URLs.
- Audit/logging strategy for edits to relationships and evidence links.

## Build Specs for First Wave (Do First)

Use this structure for each ticket: scope, API contract, data model changes, authorization, acceptance criteria, and success metric.

### 1) Notifications (Start Order 1)

- Scope: comments, follows, surname mention, ancestor update.
- Channels: in-app real-time and daily digest email.
- Acceptance criteria:
  - User can opt in/out per notification type.
  - Real-time event appears in under 5 seconds.
  - Digest includes only unseen events in last 24 hours.
- Success metric: 30-day notification click-through rate.

### 2) Source Repository and Citation Management (Start Order 2)

- Scope: create/view/search source records and attach many sources to one finding.
- Required fields: title, source type, record date, place, repository, citation text, file link.
- Acceptance criteria:
  - A finding can reference one-to-many sources.
  - Source page shows reverse links to all attached findings.
  - Citation format is enforced before save.
- Success metric: percentage of findings with at least one citation.

### 3) Structured Research Records (Start Order 3)

- Scope: extend existing blog entry form with genealogy metadata.
- Fields: ancestor, event date, event place, branch, tags, confidence.
- Acceptance criteria:
  - Existing posts remain readable (backward compatible).
  - New filters can query the added fields.
  - Confidence value is required for new research posts.
- Success metric: percentage of posts created with complete metadata.

### 4) Advanced Search (Start Order 4)

- Scope: multi-filter search over notes, ancestors, and sources.
- Minimum filters: surname, location, year range, confidence, status.
- Acceptance criteria:
  - Any filter combination returns results in under 1.5 seconds for target dataset.
  - Results clearly indicate record type and confidence.
  - Empty-state suggests which filter to relax.
- Success metric: search-to-click conversion and failed-search rate.

### 5) Research Status Tracking (Start Order 5)

- Scope: status on notes and ancestor claims.
- Status set: Not Started, Researching, Brick Wall, Needs Verification, Proven.
- Acceptance criteria:
  - Status history is preserved with editor and timestamp.
  - Users can filter dashboards by status.
  - Proven status requires at least one source link.
- Success metric: reduction in unresolved/unstated research items.

### 6) Ancestor Profiles and Family Tree Integration (Start Order 6)

- Scope: profile page + relationship links (parent, child, spouse).
- Relationship rules: prevent impossible cycles and enforce date sanity checks.
- Acceptance criteria:
  - Profile shows linked notes, sources, photos, and relationships.
  - Relationship create/edit enforces validation rules.
  - Profile merge handles duplicate references safely.
- Success metric: profile completeness score and duplicate profile rate.

### 7) Follow Ancestors/Surnames/Locations/Branches (Start Order 7)

- Scope: users subscribe to entities and receive relevant updates.
- Acceptance criteria:
  - Follow/unfollow works for each entity type.
  - New matching content triggers notification pipeline.
  - User can review and edit all follow subscriptions.
- Success metric: active follows per user and revisit rate.

## Suggested Delivery Phases

- Phase 1 (MVP): Start Order 1 through 4.
- Phase 2: Start Order 5 through 7.
- Phase 3: discussions, command center, timeline, duplicate resolution.
- Phase 4: OCR, oral history, migration playback.
- Phase 5: DNA, AI context, GitHub-style collaboration, gamification.

## Open Clarifications Before Build

- Citation standard: choose one required format (for example Evidence Explained style).
- Relationship conflict policy: who can override and how conflicts are resolved.
- Search indexing approach: SQL full-text, external index, or hybrid.
- OCR review policy: confidence threshold and mandatory human verification.
- Notification policy: default subscription behavior for new users.
