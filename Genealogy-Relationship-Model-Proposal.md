# Genealogy Relationship Model Proposal

## Problem Summary

The current schema mixes two different relationship patterns:

1. Parent links are stored as direct columns on `AncestorProfiles` (`FatherAncestorProfileId`, `MotherAncestorProfileId`).
2. Sibling links are stored in `AncestorRelationships` with `RelationshipType = 'Sibling'`.

This split model makes spouse support inconsistent and makes it harder to guarantee correct bidirectional behavior.

## Goal

Use one uniform database pattern for all person-to-person links:

- Parent/child
- Spouse
- Sibling

The UI labels `Father`, `Mother`, `Husband`, `Wife`, `Brother`, `Sister`, `Son`, and `Daughter` should be derived from:

- relationship type
- direction
- the other person's gender

The database should store canonical relationship facts, not gendered display labels.

## Canonical Data Model

Keep `dbo.AncestorRelationships` as the single source of truth and normalize it:

- `AncestorProfileId INT NOT NULL`
- `RelatedAncestorProfileId INT NOT NULL`
- `RelationshipType NVARCHAR(20) NOT NULL`
  - allowed values: `Parent`, `Spouse`, `Sibling`
- `CreatedDate DATETIME NOT NULL`
- optional metadata for future quality workflows:
  - `SourceId INT NULL`
  - `ConfidenceLevel NVARCHAR(50) NULL`
  - `Notes NVARCHAR(500) NULL`

### Canonical Direction Rules

1. `Parent` is directional and stored as `Parent -> Child`.
2. `Spouse` is symmetric and stored once per pair (not twice).
3. `Sibling` is symmetric and stored once per pair (not twice).

### Required Constraints

1. `CHECK (AncestorProfileId <> RelatedAncestorProfileId)`.
2. `CHECK (RelationshipType IN ('Parent','Spouse','Sibling'))`.
3. For symmetric types, enforce uniqueness per unordered pair:
   - persisted computed columns:
     - `NormalizedAncestorId = CASE WHEN AncestorProfileId < RelatedAncestorProfileId THEN AncestorProfileId ELSE RelatedAncestorProfileId END`
     - `NormalizedRelatedId = CASE WHEN AncestorProfileId < RelatedAncestorProfileId THEN RelatedAncestorProfileId ELSE AncestorProfileId END`
   - unique filtered index on (`NormalizedAncestorId`, `NormalizedRelatedId`, `RelationshipType`) where `RelationshipType IN ('Spouse','Sibling')`.
4. Unique index on (`AncestorProfileId`, `RelatedAncestorProfileId`, `RelationshipType`) for directional `Parent` edges.

## How Roles Are Derived

Given a `Parent` edge:

- from parent perspective: child role label is `Son`/`Daughter`/`Child` using child gender.
- from child perspective: parent role label is `Father`/`Mother`/`Parent` using parent gender.

Given a `Spouse` edge:

- role label is `Husband`/`Wife`/`Spouse` using other person gender.

Given a `Sibling` edge:

- role label is `Brother`/`Sister`/`Sibling` using other person gender.

## Database Migration Plan

### Phase 1: Introduce Uniform Relationship Rules

1. Add check constraint for valid `RelationshipType` values.
2. Add computed normalization columns and unique indexes.
3. Add supporting nonclustered indexes:
   - (`AncestorProfileId`, `RelationshipType`)
   - (`RelatedAncestorProfileId`, `RelationshipType`)

### Phase 2: Backfill Parent Edges From Existing Columns

Backfill `Parent` edges from `AncestorProfiles`:

- if `FatherAncestorProfileId` exists: insert (`FatherAncestorProfileId`, `AncestorProfileId`, `Parent`)
- if `MotherAncestorProfileId` exists: insert (`MotherAncestorProfileId`, `AncestorProfileId`, `Parent`)

Use `NOT EXISTS` guards to avoid duplicates.

### Phase 3: Spouse Handling

1. Stop relying on profile-level spouse fields.
2. Store spouse links only in `AncestorRelationships` as `Spouse`.
3. Update procedures/services so creating a wife or husband inserts one `Spouse` edge for the pair.

### Phase 4: Read Layer Compatibility

Create a view or procedure that returns relationship rows with computed display labels.

Recommended: replace `AncestorProfile_GetRelationships` internals to read from `AncestorRelationships` for all relationship types (including parent and spouse), while still returning grouped display data.

### Phase 5: Deprecate Parent Columns

After all code paths are migrated and validated:

1. Remove writes to `FatherAncestorProfileId` and `MotherAncestorProfileId`.
2. Keep columns temporarily for compatibility reads.
3. Later drop columns and related FKs/indexes after release hardening.

## Procedure/API Changes Required

1. `AncestorProfile_Upsert`
   - should no longer be the owner of relationship facts via profile columns.
   - it should call relationship upsert helpers (or accept a relationship payload).

2. `AncestorRelationship_Upsert`
   - validate type-specific rules:
     - `Parent`: directional, duplicates blocked.
     - `Spouse`/`Sibling`: canonical ordering and single-row storage.

3. New optional helper procedures:
   - `AncestorRelationship_UpsertPair`
   - `AncestorRelationship_DeletePair`
   - `AncestorRelationship_GetByAncestorId`

4. Frontend/API contracts:
   - move from `FatherAncestorProfileId`, `MotherAncestorProfileId`, `HusbandAncestorProfileId`, `WifeAncestorProfileId` to a relationship list payload over time.

## Example Queries

### Get all relationships for one ancestor

```sql
SELECT r.AncestorRelationshipId,
       r.AncestorProfileId,
       r.RelatedAncestorProfileId,
       r.RelationshipType,
       p.Gender AS RelatedGender
FROM dbo.AncestorRelationships r
JOIN dbo.AncestorProfiles p
  ON p.AncestorProfileId = CASE
      WHEN r.AncestorProfileId = @AncestorProfileId THEN r.RelatedAncestorProfileId
      ELSE r.AncestorProfileId
    END
WHERE r.AncestorProfileId = @AncestorProfileId
   OR r.RelatedAncestorProfileId = @AncestorProfileId;
```

### Get parents of one ancestor

```sql
SELECT p.AncestorProfileId,
       p.FirstName,
       p.LastName,
       p.Gender
FROM dbo.AncestorRelationships r
JOIN dbo.AncestorProfiles p
  ON p.AncestorProfileId = r.AncestorProfileId
WHERE r.RelationshipType = 'Parent'
  AND r.RelatedAncestorProfileId = @AncestorProfileId;
```

### Get children of one ancestor

```sql
SELECT c.AncestorProfileId,
       c.FirstName,
       c.LastName,
       c.Gender
FROM dbo.AncestorRelationships r
JOIN dbo.AncestorProfiles c
  ON c.AncestorProfileId = r.RelatedAncestorProfileId
WHERE r.RelationshipType = 'Parent'
  AND r.AncestorProfileId = @AncestorProfileId;
```

## Why This Solves Your Specific Issue

When a male ancestor creates a wife record:

1. Create new ancestor profile.
2. Insert one `Spouse` relationship row between current ancestor and new ancestor.

Opening either profile now reads from one shared spouse relationship fact. There is no separate husband/wife column to drift out of sync.

## Rollout Safety

1. Deploy additive schema changes first (constraints, indexes, helper procedures).
2. Backfill parent edges.
3. Switch writes in API/services.
4. Validate with regression checks (parent, sibling, spouse create/edit/delete).
5. Remove legacy parent columns only after at least one stable release cycle.
