CLAUDE.md — Project Engineering Instructions
1. Project Overview

This project is a scalable, full-stack voting platform focused initially on Ecuadorian football clubs.

Its purpose is to allow users to vote for football clubs and visualize national, provincial, and canton-level results.

The scope is Ecuador only, as simple as possible. Users abroad select only a continent. Do not build multi-country support unless the owner approves it.

2. Technology Stack

The approved initial technology stack is:

Frontend and backend: Next.js + TypeScript.
Database: Supabase PostgreSQL.
Authentication: Supabase Auth.
Hosting and deployment: Vercel.
Infrastructure protection: Cloudflare.
Version control: GitHub.

The homepage frontend is complete. The Supabase project is created and connected to Next.js (`src/lib/supabase/`). Database tables exist as recorded in docs/SUPABASE_SQL.md. Do not implement authentication or real voting functionality until explicitly approved.

Do not introduce additional infrastructure, frameworks, databases, or major dependencies without a justified technical reason and owner approval.

Do not introduce microservices, Kubernetes, Redis, or Kafka unless actual architectural requirements and performance metrics justify them.

3. Project Architecture

Follow a modular architecture within the existing repository.

Maintain clear separation between:

Presentation and UI components.
Business logic.
Server-side operations.
Database access.
Authentication and authorization.
Data validation.
External services and integrations.

Prioritize maintainability, scalability, security, and component reusability.

Inspect the existing codebase before changing architectural decisions. Never assume that a proposed structure has already been implemented.

4. Documentation & Source of Truth

Project documentation and approved design specifications are the primary sources of truth for implementation.

Before working on a feature:

Identify its corresponding specification.
Read the relevant documentation and visual references.
Review its acceptance criteria.
Inspect the existing implementation.
Identify missing information or assets.

Never invent product requirements, visible copy, brand colors, logos, images, or functionality.

If requirements conflict or essential information is missing, ask the project owner before making assumptions.

Before working on the database, read docs/SUPABASE_SQL.md, which records the current status, configuration, and decisions.

Consult the owner before any important change to CLAUDE.md, the files in docs/, or supabase/migrations/. This includes changes to requirements, decisions, or database structure. Minor corrections and checklist updates do not require consultation.

Keep CLAUDE.md concise. Detailed specifications, architecture documentation, database schemas, implementation plans, and checklists belong in their respective documentation files.

5. Engineering & Security Rules
Use TypeScript strict mode. Avoid any.
Follow established project conventions.
Follow the installed Next.js documentation under node_modules/next/dist/docs/ before implementing Next.js features.
Use Server Components by default and Client Components only when necessary.
Follow the existing ESLint and Prettier configuration.
Prefer reusable, modular, and maintainable code.
Avoid unnecessary dependencies, duplicated logic, and premature optimization.
Validate all untrusted input on the server.
Never trust user identifiers or permissions supplied by the frontend.
Enforce critical data integrity rules at the database level.
Keep privileged credentials and service-role keys exclusively on the server.
Never expose secrets in frontend code or version control.
Protect authentication, authorization, and database operations.
Never modify production data or execute destructive operations without explicit approval.

Security and database integrity must never depend exclusively on frontend validation.

6. Design & Responsive Rules

Approved design specifications and reference images are authoritative.

Maintain visual consistency and the project's visual identity across all devices.
Desktop reference designs are the visual authority for the original composition.
For tablet and mobile layouts, act as an experienced UX/UI designer specialized in Responsive Design. Use professional judgment and creative freedom to reorganize, resize, reposition, and adapt components to provide the best possible experience for each device.
Responsive adaptations must preserve the original visual identity, approved colors, typography, copy, assets, and all desktop content.
Do not simply shrink the desktop layout to fit smaller screens. Design appropriate layouts for each device.
Implement only approved interactions and functionality.
Report missing assets instead of creating unauthorized replacements.

7. Development Workflow & Quality Assurance

Follow this workflow for significant development tasks:

Analyze requirements and relevant documentation.
Inspect the existing implementation.
Prepare an implementation plan.
Identify affected files and dependencies.
Implement only the approved scope.
Execute relevant tests and validations.
Verify the implementation against acceptance criteria.

Never declare a feature complete simply because its code has been written.

Run ESLint and the production build before declaring a milestone complete, where applicable.

Report actual test results. Do not claim successful verification without evidence.

8. Agent Delegation & Communication

Use specialized subagents when they provide meaningful value.

Delegate visual and specification analysis to design-focused agents.
Delegate implementation to development-focused agents.
Delegate independent verification to QA-focused agents.
Avoid unnecessary parallel execution and duplicated investigations.
Avoid multiple agents modifying the same files simultaneously.
Give each agent a clearly defined task and relevant documentation.

The main agent remains responsible for coordination, technical consistency, and reporting.

Communicate with the project owner in Spanish.

After significant tasks, report:

What was implemented.
Files created or modified.
Requirements completed.
Tests executed and their actual results.
Remaining issues and blockers.

Never expand the approved scope without owner authorization.