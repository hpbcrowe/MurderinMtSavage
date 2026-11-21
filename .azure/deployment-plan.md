# Azure Deployment Plan

> **Status:** Deployed

## Current release: marriage date

Approved for the existing subscription and targets on 2026-11-18 UTC. Add the
nullable `AncestorProfiles.MarriageDate` column and update only
`AncestorProfile_Upsert`, `AncestorProfile_Get`, `AncestorProfile_GetAll`,
and `AncestorProfile_Search`, then publish the API and frontend. Do not deploy
infrastructure or alter app settings. Verify each stored procedure, the API
artifact and endpoint, and the frontend bundle after deployment.

The migration and procedure behavior were tested on an isolated local SQL
Server database, including repeated migration, create, update, get, list,
search, and clearing the date. Angular edit-component tests passed (23 tests).
The frontend and Release backend builds passed. The Debug build is blocked by
an existing running local API process holding output files.

Deployment completed on 2026-11-18 UTC. The SQL migration and procedure
definitions were applied atomically. Production SQL create, read, update, and
clear checks passed in a rolled-back transaction. The live API returns the
`marriageDate` field, and its three published assemblies match their local
SHA-256 hashes. The live frontend bundle matches the local build's SHA-256.
An authenticated browser save was not exercised.

## 1. Project Overview

Deploy the existing Angular frontend, ASP.NET Core API, and pending SQL stored
procedure changes to the existing CroweQuest Azure resources. Do not provision
or modify infrastructure, app settings, connection strings, or access policies.

## 2. Requirements

| Attribute | Value |
|-----------|-------|
| Classification | Existing live application |
| Scale, budget, compliance | Preserve existing configuration; no capacity changes |
| Subscription | Azure subscription 1 (`0d11896b-7362-4e60-8035-1596975cf411`) |
| App Service region | West US 2 |
| SQL region | West US |
| Resource group | CroweQuestGroup |

## 3. Components Detected

| Component | Technology | Location |
|-----------|------------|----------|
| Frontend | Angular 13 | `CroweQuest-UI` |
| API | ASP.NET Core 3.1 | `CroweQuest.Web` |
| Database | Azure SQL stored procedures | `Database/GenealogyProcedures.sql` |

## 4. Recipe Selection

**Selected for approval:** Azure CLI, application artifacts only.

The repository specifies ZIP deployment to existing App Services. Azure
Developer CLI is not installed or configured and the existing Bicep file is
explicitly review-only; deploying that template may change existing settings.
No infrastructure deployment is planned.

## 5. Architecture

| Component | Existing target | Region |
|-----------|-----------------|--------|
| Frontend | App Service `CroweQuest`, Linux | West US 2 |
| API | App Service `CroweQuestWebAPI`, Windows | West US 2 |
| Database | `AzureCroweQuestDB` on `crowequestdbserver` | West US |

Azure SQL is serverless; it resumed during the connectivity check and may
incur compute charges while active. Existing resource settings are retained.
The subscription has the SecurityCenterBuiltIn policy assignment.

## 6. Provisioning Limit Checklist

No Azure resources, capacity, or SKUs will be created or changed. The inventory
of additional resources is zero, so provisioning quota checks do not apply.

## 7. Execution Checklist

### Planning

- [x] Inspect existing targets and SQL connectivity.
- [x] Identify the frontend, API, and database changes.
- [x] Confirm subscription, existing regions, and the application-only recipe.
- [x] Approve the plan.

### Preparation

- [x] Verify the exact stored procedure batches and rollback approach.
- [x] Package frontend and API artifacts without exposing configuration secrets.
- [x] Mark ready for validation.

### Validation

- [x] Invoke the Azure validation workflow.
- [x] All validation checks pass
  - [x] Azure CLI, authentication, Bicep compilation, validation, and what-if.
  - [x] Docker build: not applicable.
  - [x] Azure Policy validation for this application-only release.
  - [x] Node.js runtime and frontend/API builds.
  - [x] Package contents, target resource identities, SQL access, and SQL syntax.
- [x] Record validation proof and resolve any failures before deployment.

### Deployment

- [x] Apply only the changed stored procedures.
- [x] Deploy the API and verify its response.
- [x] Deploy the frontend ZIP with clean and restart enabled.
- [x] Verify the live frontend bundle matches the local build and test the API.

The initial API deployments failed because a DLL was locked. A temporary
`app_offline.htm` allowed the ZIP deployment to complete; the temporary file
was removed afterward. The live API DLL matches the published binary, the
database-backed API endpoint returns HTTP 200, and the sibling-delete route
rejects an unauthenticated request with HTTP 401. Both SQL procedure
definitions match the intended source. The frontend returns HTTP 200 and its
live main bundle matches the local bundle's SHA-256 hash.

The API's existing system-assigned identity has no Azure RBAC role assignments;
the frontend has no system-assigned identity. This release made no identity or
role changes. An authenticated sibling deletion was not exercised.

## 7. Validation Proof

### Marriage date release (2026-11-18 UTC)

| Check | Command or evidence | Result |
|-------|---------------------|--------|
| Azure CLI recipe | `validate-deployment.ps1 -Scope group -ResourceGroup CroweQuestGroup` | Pass; review-only template is not being deployed |
| Policy and runtime | `az policy assignment list`; `az webapp list-runtimes --os linux`; `node --version` | Existing SecurityCenterBuiltIn assignment; Node 22 build and App Service runtime, supported through 2027-04-30 |
| Builds | `dotnet build CroweQuest.sln -c Release --no-restore`; `npm run build` in `CroweQuest-UI` | Pass with existing dependency, framework, and bundle-size warnings |
| UI regression tests | `ng test --watch=false --browsers=ChromeHeadless --include=**/ancestor-profile-edit.component.spec.ts` | 23 passed |
| SQL migration and round trips | Isolated local SQL Server database using schema and procedure batches | Pass: idempotent migration, create, update, get, list, search, clear |
| Production readiness | Azure SQL procedure definition comparison, target checks, artifact validation, Kudu configuration comparisons | Pass; column absent, four existing procedures match committed baseline, backups saved, packages verified |
| Static roles | Review of `infra/main.bicep` | No infrastructure or role assignments will be deployed or changed |

Docker build is not applicable.

| Check | Command or evidence | Result | Timestamp (UTC) |
|-------|---------------------|--------|-----------------|
| Azure CLI recipe | `validate-deployment.ps1 -Scope group -ResourceGroup CroweQuestGroup` | Pass; review-only template preview reported creates and modifications, so it will not be deployed | 2026-11-15 |
| Azure policy | `az policy assignment list --scope /subscriptions/0d11896b-7362-4e60-8035-1596975cf411` | SecurityCenterBuiltIn assignment; no infrastructure changes planned | 2026-11-15 |
| API build and package | `dotnet build CroweQuest.sln --no-restore`; `dotnet publish CroweQuest.Web/CroweQuest.Web.csproj -c Release --no-restore` | Pass with existing end-of-support and vulnerable-package warnings; required ZIP entries verified | 2026-11-15 |
| Frontend build and package | `npm run build` in `CroweQuest-UI` | Pass with existing bundle budget warning; ZIP contains matching index and main bundle | 2026-11-15 |
| Node runtime | `node --version`; `az webapp list-runtimes --os linux` | Build Node 22.14.0; live `NODE|22-lts`, supported through 2027-04-30 | 2026-11-15 |
| Database access and SQL | Azure SQL connection with Azure CLI access token; `SET PARSEONLY ON` on the two target procedure batches | Pass; live upsert backed up and new delete procedure absent; only intended upsert changes differ | 2026-11-15 |
| Target and configuration | `az webapp show`; `az sql db show`; authenticated Kudu comparisons | Pass; confirmed target resource identities, SQL access, identical appsettings, and preserved live web.config | 2026-11-15 |
| Static roles | Review of `infra/main.bicep` | No role assignments are deployed or changed by this release | 2026-11-15 |

**Validated by:** azure-validate workflow  
**Validation proof recorded:** 2026-11-15T06:04:59Z

## 8. Files to Generate

| File | Purpose | Status |
|------|---------|--------|
| `.azure/deployment-plan.md` | Deployment plan | Planning |
| Frontend ZIP outside repository | Frontend deployment package | Prepared |
| API ZIP outside repository | API deployment package | Prepared |

## 9. Next Steps

Deployment and artifact-level verification are complete.
