# PAGINA HINCHAS ECUADOR — Project Overview

## 1. Purpose

Build a public web platform for people to indicate which EXcuadorian football club they support and consult voting results and rankings.

The initial development milestone is the **public homepage**, before implementing real registration, authentication, voting, or database integration.

## 2. Product principles

- The public homepage is accessible without signing in.
- The page presents the project identity, national results, and explanatory project information.
- The homepage is read-only, except for the `VOTAR` navigation action.
- The desktop design references supplied by the project owner are the visual source of truth.

- Desktop designs are the mandatory visual reference and source of truth for the three homepage screens.
- Responsive design for tablets and mobile devices must be professionally adapted to each screen size, prioritizing usability, visual hierarchy, readability, accessibility, and a consistent user experience.
- The designer has professional freedom to reorganize elements and sections, change horizontal layouts into vertical ones, resize typography, images, icons, and components, adjust spacing and alignment, define appropriate breakpoints, and adapt complex components when necessary.
- Responsive layouts must not be simple scaled-down versions of the desktop designs. Each device must have a layout specifically optimized for its viewport while maintaining the project's visual identity, design language, and overall coherence.
- Content and functionality must remain consistent with the approved project scope. Responsive adaptations may change presentation and layout, but must not introduce unapproved features or invent content, imagery, logos, or functionality.


- Do not invent copy, imagery, logos, badges, or product functionality.

## 3. Homepage scope — current milestone

Implement one vertically scrolling page containing three consecutive sections corresponding to the three supplied Canva reference images.

Included:
- Persistent header with the `VOTAR` action.
- Project identity and Ecuador imagery in section 1.
- National TOP 5 and an interactive Ecuador province map in section 2.
- Project explanatory content and footer in section 3.
- The specified ball and Ecuador coat-of-arms animations.
- Four visual states for the results/map area: normal, data error, offline, and loading.
- Responsive desktop, tablet, and mobile layouts that retain all content.

Temporary behavior:
- `VOTAR` navigates to a blank provisional page.
- The map may use mock data and a temporary map asset/implementation while the interactive map is being built.
- Real voting data, authentication, and database integration are out of scope for this milestone.


## 4. Voting-platform rules to preserve for later milestones

- One selected club per account.
- Email verification is required before voting.
- One definitive vote per account; users cannot change or delete it.
- Location is declared by the user, not verified.
- Ecuador results can be consulted nationally, by province, and by city; international results by continent.
- Club catalogue includes Ecuadorian clubs that have been professional at least once, including inactive or disappeared clubs. Exclude clubs that have never been professional and national teams.
- Rankings sort by valid votes descending; ties are alphabetical by club name.
- Percentages use valid votes in the selected scope as denominator.
- CAPTCHA is required at voting time.
- Do not use IP address as an identity or restriction mechanism.

These rules describe the wider product and must not be implemented as part of the homepage-only milestone unless explicitly authorized.

## 5. Out of scope for the current milestone

- Registration and account creation.
- Sign-in and session management.
- Email verification.
- Vote submission or vote modification.
- Real database and backend integration.
- Real national/provincial/city rankings.
- Final club catalogue administration.

## 6. Source of truth and change control

Priority of project inputs:
1. Explicit decisions confirmed by the project owner.
2. `design/documentation/pagina-principal.txt`.
3. Supplied visual references in `design/references/pagina-principal/`.
4. The technical documents in `docs/`.

## 7. Responsive Design Requirements

Act as a senior UX/UI designer specialized in Responsive Design, with professional judgment and the freedom to make design and implementation decisions.

Your responsibility is to develop the three homepage screens, using the supplied desktop designs as mandatory visual references.

For tablet and mobile devices, you have professional freedom to adapt and reorganize the desktop designs to achieve the best possible visual and user experience.

You may make professional design decisions such as:

- Reorganizing elements and sections.
- Changing horizontal layouts into vertical layouts when appropriate.
- Adjusting typography, image, icon, and component sizes.
- Modifying margins, spacing, and alignments.
- Defining appropriate responsive breakpoints.
- Adapting complex components to improve visualization and interaction.
- Implementing any necessary technical or visual adjustments to achieve a clean, modern, and functional responsive design.

Final objective:

Do not simply scale down the desktop design. Create professionally designed responsive adaptations in which each device has an appropriate layout and user experience, while all versions remain clearly recognizable as part of the same project.

Desktop designs establish the visual identity and design direction. Tablet and mobile adaptations must preserve that identity without being restricted to the original desktop layout.


If a conflict or missing detail is found, stop and ask the project owner rather than silently guessing. Do not change approved text, content, desktop design decisions, colors, typography identity, or functionality without approval.

Professional design adaptations to tablet and mobile layouts are explicitly authorized, including changes to element positioning, component dimensions, spacing, alignment, layout structure, and responsive behavior, provided they preserve the project's visual identity and approved functionality.
