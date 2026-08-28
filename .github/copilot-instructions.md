# Copilot instructions for Crowe Quest

## Repository context

This repository is a .NET + Angular application with a layered architecture:

- `CroweQuest.Web/` contains the ASP.NET Core web app.
- `CroweQuest.Repository/` contains repository contracts and implementations.
- `CroweQuest.Models/` contains shared model classes.
- `CroweQuest.Identity/` contains identity-related logic.
- `BlogLab.Services/` contains supporting services.
- `CroweQuest-UI/` contains the Angular frontend.

## Coding preferences

- Prefer small, focused edits that match the existing code patterns.
- Preserve the current architecture and do not introduce unnecessary abstractions.
- Reuse existing services, repositories, and model contracts before creating new ones.
- Keep Angular code simple and component-focused; keep API and business logic in services/repositories.
- Prefer explicit, readable code over clever or overly generic solutions.

## Frontend guidance

- Follow Angular conventions already used by the app in `CroweQuest-UI/src/app`.
- Use existing `FormGroup` / validation patterns when working with forms.
- Leverage `rxjs` and `Observable` flows consistent with the app’s current service layer.
- Avoid introducing new UI libraries or major architectural changes without clear need.

## Backend guidance

- Follow the repository/service pattern already used by the backend.
- Keep controllers thin and service/repository logic in the appropriate project.
- Do not shuffle responsibilities across layers without a direct reason.

## Build and validation

Use the smallest relevant validation command:

- Solution build: `dotnet build CroweQuest.sln`
- Angular app: `cd CroweQuest-UI && npm run build`
- Local UI dev run: `cd CroweQuest-UI && npm start`

## Azure deployment targets

Use these exact Azure deployment targets for this repo:

- Resource group: `CroweQuestGroup`
- Frontend app: `CroweQuest`
  - URL: `https://crowequest-f5crfzfpg6hrd4f4.westus2-01.azurewebsites.net`
- Backend app: `CroweQuestWebAPI`
  - URL: `https://crowequestwebapi-fyg8a3dhcpfudugv.westus2-01.azurewebsites.net`
- Database server: `crowequestdbserver` in `westus`

## Deployment workflow

Use the current Azure configuration instead of guessing:

1. Build the frontend from the repo root with `cd CroweQuest-UI && npm run build`.
2. Create a single zip from `CroweQuest-UI/dist/crowe-quest-ui` and deploy that zip to the `CroweQuest` app service in `CroweQuestGroup` using `az webapp deploy --type zip --clean true --restart true`.
3. Validate the frontend via the `CroweQuest` URL above.
4. For API changes, deploy to `CroweQuestWebAPI` and confirm the API is responding before code is considered complete.
5. Avoid local-only validation as a deployment substitute; Azure targets are authoritative.
6. Do not rely on a file-by-file static upload for this Linux App Service. Azure has returned Kudu 400 errors with per-file static deploys; zip deployment is the reliable path for this app.

## Security

- Never add secrets, API keys, tokens, passwords, or connection strings to source code.
- Prefer configuration-based settings instead of hardcoded environment-specific values.
- Be careful with authentication, authorization, and session handling changes.

## Default behavior for generated changes

- Match the project’s established naming and style.
- Keep diffs scoped to the task.
- Do not do broad refactors while fixing a targeted issue.
- Confirm the change works through the most relevant build or validation step before finishing.
