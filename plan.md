# Genealogy MVP Roadmap

Build the genealogy features in phases, starting with a narrowly scoped data model and API layer that reuses the current blog/comment/photo stack, then add search-oriented UI and finally collaboration/notification features. The recommended first release should treat blogs as research entries and introduce structured ancestor/source/research-note entities without trying to solve full family tree visualization on day one.

## Steps

1. Define the genealogy domain model and persistence shape, reusing the existing repository pattern and current SQL/Dapper style (depends on current backend conventions).
2. Add backend repositories and controllers for ancestor profiles, relationships, sources, research notes, and follower/notification records (depends on step 1).
3. Extend the existing blog flow so a blog can optionally link to an ancestor profile and a source, preserving the current photo attachment behavior (parallel with step 2 once the new IDs exist).
4. Add search and filtering endpoints for ancestor name, surname, location, date range, tag, and evidence level so the new records are discoverable (depends on step 2).
5. Build Angular list/detail/edit screens for ancestor profiles, sources, and research notes by copying the current blog-edit and blog-list interaction patterns (depends on step 2 and 4).
6. Add genealogy-specific UI affordances: confidence status, tags, linked sources, linked photos, and related ancestors, keeping forms simple and validation local to the component (parallel with step 5 where possible).
7. Add collaboration features in a second wave: threaded discussions or research comments, ancestor follow/unfollow, and notifications for comments, uploads, and mentions (depends on steps 2 and 5).
8. Reserve family-tree visualization, OCR/extraction, DNA match tracking, and rich digest notifications for a later phase after the MVP schema and search are stable.

## Relevant Files

- [CroweQuest.Web/Controllers/BlogController.cs](CroweQuest.Web/Controllers/BlogController.cs) - current blog API shape to extend with genealogy links.
- [CroweQuest.Web/Controllers/BlogCommentController.cs](CroweQuest.Web/Controllers/BlogCommentController.cs) - existing discussion pattern to reuse for research-thread comments.
- [CroweQuest.Web/Controllers/PhotoController.cs](CroweQuest.Web/Controllers/PhotoController.cs) - photo attachment flow that already fits genealogical documents.
- [CroweQuest.Repository/BlogRepository.cs](CroweQuest.Repository/BlogRepository.cs) - repository/Dapper pattern to mirror for new genealogy repositories.
- [CroweQuest.Repository/IBlogRepository.cs](CroweQuest.Repository/IBlogRepository.cs) - interface style to match for new data access contracts.
- [CroweQuest.Models/Blog/Blog.cs](CroweQuest.Models/Blog/Blog.cs) - existing content entity that can become a research-entry anchor.
- [CroweQuest.Models/BlogComment/BlogCommentCreate.cs](CroweQuest.Models/BlogComment/BlogCommentCreate.cs) - nested comment pattern for research discussions.
- [CroweQuest.Models/Photo/Photo.cs](CroweQuest.Models/Photo/Photo.cs) - existing media entity for document/photo reuse.
- [CroweQuest.Models/Account/ApplicationUserIdentity.cs](CroweQuest.Models/Account/ApplicationUserIdentity.cs) - genealogy-related user metadata already present.
- [CroweQuest-UI/src/app/components/blog-components/blog-edit/blog-edit.component.ts](CroweQuest-UI/src/app/components/blog-components/blog-edit/blog-edit.component.ts) - form/validation pattern to copy for ancestor and source editors.
- [CroweQuest-UI/src/app/components/blog-components/blogs/blogs.component.ts](CroweQuest-UI/src/app/components/blog-components/blogs/blogs.component.ts) - paged list pattern to reuse for ancestor and research-note listings.
- [CroweQuest-UI/src/app/services/blog.service.ts](CroweQuest-UI/src/app/services/blog.service.ts) - HTTP service pattern to mirror for new genealogy services.

## Verification

1. Confirm the backend still builds after the new models, repositories, controllers, and DI registrations are added with `dotnet build CroweQuest.sln`.
2. Confirm the Angular app still compiles after the new genealogy routes, services, and forms are added with `cd CroweQuest-UI && npm run build`.
3. Validate that the old blog create/edit flow still works after adding genealogy links so the new work does not regress the existing journal-entry flow.
4. If the collaboration/notification phase is included, add at least one focused test or manual check for follow/notification creation so the new async behavior is exercised.

## Decisions

- Treat blogs as the initial research-entry surface rather than replacing them entirely.
- Make ancestor profiles, sources, and research notes the core MVP objects.
- Defer full tree visualization, OCR, and DNA integration until the structured data model is stable.
- Preserve the existing blog/photo/comment architecture instead of introducing a new application layer.

## Further Considerations

1. If you want, I can trim this to a strict MVP plan that stops after ancestor profiles, sources, and research notes.
2. If you want a fuller roadmap, I can expand this into release milestones with explicit backend/frontend/API tasks per phase.
