# Development Plan

## Principle

Work in small, reviewable stages. Do not begin visual implementation until the project owner approves the preparation and design-review stages. Do not silently skip acceptance checks.

Act as a senior UX/UI designer specialized in Responsive Design, with professional judgment and the freedom to make design and implementation decisions.

The supplied desktop references are mandatory visual references for the desktop implementation. However, tablet and mobile layouts must be professionally adapted to provide the best possible user experience on each device.

The development process must prioritize intentional responsive design rather than simply scaling down desktop layouts. Professional decisions regarding layout structure, element positioning, dimensions, spacing, alignment, breakpoints, and component adaptation are authorized, provided they preserve the approved project identity, content, and functionality.

Desktop, tablet, and mobile must be treated as three intentionally designed experiences belonging to the same project.

## Stage 1 — Environment and project baseline

Status: completed by project owner.
- Node.js, npm, Git, VS Code, and Claude Code CLI verified.
- Next.js App Router project initialized.
- TypeScript strict, Tailwind CSS, and ESLint configured.
- Prettier, eslint-config-prettier, and Lucide React installed.
- Development server tested successfully.

## Stage 2 — Design source review

Status: completed by project owner.
- Three desktop reference images stored under `design/references/pagina-principal/`.
- Written design source stored at `design/documentation/pagina-principal.txt`.
- Written requirements reviewed and professional responsive adaptation principles confirmed.
- Desktop references established as the mandatory visual authority for desktop implementation and visual guidance for tablet and mobile adaptations.

## Stage 3 — Documentation and project rules

Current stage.
- Maintain the five documents in `docs/`.
- Review and approve them with the project owner.
- Ensure all project documentation explicitly authorizes professional responsive design decisions for tablet and mobile layouts.
- Ensure responsive requirements distinguish between preserving approved content and functionality versus adapting visual presentation and component distribution.
- Ensure no documentation imposes unnecessary restrictions on responsive layout decisions.
- Inspect the actual three JPG references before translating exact visual dimensions and positions into code.
- Preserve Next.js-generated `AGENTS.md`.
- Create and review `CLAUDE.md`.
- Configure the minimum necessary Claude Code project settings.
- Create three focused agents: frontend developer, design reviewer, and QA reviewer.
- Create the design-implementation skill.

## Stage 4 — Asset and technical preparation

- Confirm the owner-provided image/icon inventory and filenames.
- Confirm font files or the approved method for loading Tiro Bangla and Montserrat.
- Investigate Ecuador province map geometry and choose an interactive implementation after a small technical evaluation.
- Define mock data structure and exact club HEX values only from approved information.
- Define responsive test viewports and content-preservation checks.
- Decide the test setup (Playwright) before implementation.

## Stage 5 — Homepage implementation

Only after explicit approval:
1. Implement global layout, fonts, colors, and persistent header.
2. Implement the three sections in reference order.
3. Implement the provisional `/votar` route.
4. Implement ball and coat-of-arms animations.
5. Implement the interactive province map with mock data.
6. Implement normal, error, offline, and loading states.
7. Develop professionally adapted tablet and mobile layouts, making independent design decisions for each viewport.
8. Optimize component positioning, dimensions, spacing, typography, alignment, and layout structure for each device.
9. Adapt complex components and interactions to provide an appropriate experience on touch devices and smaller screens.
10. Preserve the approved project identity, content, and functionality while allowing visual presentation and component distribution to change according to the viewport.

## Stage 6 — Responsive Design Optimization

Develop and review three intentionally designed experiences:

### Desktop
- Follow the three supplied desktop reference images as closely as possible.
- Preserve the approved visual composition, identity, proportions, and design direction.
- Verify visual accuracy against the original references.

### Tablet
- Reorganize desktop components when necessary.
- Optimize horizontal and vertical distributions.
- Adjust component dimensions, typography, and spacing.
- Ensure appropriate interaction and readability.

### Mobile
- Create a layout specifically optimized for mobile devices.
- Prioritize readability, visual hierarchy, accessibility, and intuitive interaction.
- Adapt complex components to narrow screens and touch interaction.
- Avoid simply compressing the desktop composition.

### Responsive design principles
- Professional design decisions are authorized for tablet and mobile.
- Layout structures do not need to remain identical across devices.
- Component positioning, dimensions, spacing, alignment, and visual hierarchy may change.
- All adaptations must preserve the project's approved identity, content, and functionality.
- No unapproved features, copy, imagery, or visual assets may be introduced.

### Validation
- Review each device layout independently.
- Test appropriate viewport widths and intermediate breakpoints.
- Check for unintended overflow, clipping, overlapping, and usability problems.
- Verify that all approved information and functionality remain accessible.
- Review animations, map interactions, and navigation across supported devices.

## Stage 7 — Review and acceptance

- Compare desktop screenshots with all three supplied references.
- Review tablet and mobile layouts.
- Verify every desktop element and all content remain present at every viewport.
- Test header persistence, `VOTAR` navigation, map interactions, and all four states.
- Check keyboard access, contrast, and reduced-motion behavior.
- Run lint, tests, and production build.
- Fix review findings and obtain owner approval.

## Stage 7 — Later product functionality

Separate future milestone; not part of homepage implementation:
- Authentication and email verification.
- Club catalogue.
- Vote submission and one-vote-per-account enforcement.
- Backend/database integration.
- Real rankings and geographic aggregation.
- CAPTCHA and security controls.

## Approval gates

The project owner must approve:
- Documentation and architecture before implementation.
- Map technology/data approach before final map implementation.
- Visual implementation after reference comparison.
- Any material change to copy, assets, behavior, or approved design.
