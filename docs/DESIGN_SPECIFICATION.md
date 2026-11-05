# Homepage — Design Specification

## 1. Page identity and access

- Page/section: **Página principal (3 pantallas)**.
- Audience: any person on the internet who has not signed in.
- Access: public, with no access restriction.
- The homepage consists of three vertically stacked sections on one scrolling page.
- A different page experience for signed-in users is a future milestone.

## 2. Visual authority

The three images in `design/references/pagina-principal/` are the mandatory desktop visual references. Each image represents one screen/section and establishes the approved desktop visual identity, proportions, design direction, and composition.

These references are the visual source of truth for desktop implementation. They must also guide tablet and mobile adaptations, but their original element positioning, dimensions, and distribution do not need to be replicated on smaller screens.

The written source is `design/documentation/pagina-principal/pagina-principal.txt`.

Before implementation, inspect all three reference images and the exact copy visible in them. Do not infer precise spacing, dimensions, or visual details from the text document alone.

## 3. Responsive Design — Professional Adaptation

Act as a senior UX/UI designer specialized in Responsive Design, with professional judgment and the freedom to make design and implementation decisions.

Your responsibility is to develop the three homepage screens using the supplied desktop references as mandatory visual references.

The desktop designs establish the visual identity, design direction, and overall composition of the project. However, tablet and mobile layouts must be professionally adapted to provide the best possible visual and user experience on each device.

You have professional freedom to make responsive design decisions, including:

- Reorganizing elements and sections when appropriate.
- Changing horizontal layouts into vertical layouts.
- Adjusting the size of typography, images, icons, and components.
- Modifying margins, spacing, padding, and alignments.
- Defining appropriate breakpoints for desktop, tablet, and mobile.
- Adapting complex components, particularly the interactive Ecuador map, to improve visualization and usability.
- Changing component distributions and layout structures to accommodate different screen sizes.
- Implementing any necessary technical or visual adjustments to achieve a clean, modern, accessible, and functional responsive experience.

Responsive design must not consist of simply scaling down the desktop layout. Each device must have a layout specifically designed for its viewport and interaction requirements.

The three versions must remain visually recognizable as part of the same project, preserving the approved visual identity, design language, colors, typography identity, and overall coherence.

Content and functionality must remain consistent with the approved project scope. Responsive adaptations may modify how information is presented, organized, and accessed, but must not introduce unapproved functionality or invent content, imagery, logos, or visual assets.

The desktop design remains the mandatory visual reference. Tablet and mobile adaptations are explicitly authorized to use different layouts whenever this improves the user experience.

## 4. Sections

### Section 1 — Project identity

- Use the first supplied reference image.
- Use the company/project icon and Ecuador flag image supplied by the owner.
- Include the football image/ball as shown in the reference.
- Animation A: ball moves continuously up and down in a slow, gentle, smooth loop. Avoid abrupt movement.
- Animation B: Ecuador coat of arms starts to the left and moves smoothly to its final position. It stops there and remains still.
- The owner will provide the required images, including the coat-of-arms position references.

### Section 2 — National results

- Use the second supplied reference image.
- Use the company/project icon supplied by the owner.
- Present the national TOP 5 and the Ecuador map.
- Map must be interactive, not a static downloaded image as the final implementation.
- Provinces are colored using the exact HEX color assigned to the club that leads in that province.
- Provinces with no votes use a neutral gray or white, selected to best match the approved design.
- Selecting a club must allow users to see the provinces where that club leads, using its assigned exact color.
- The owner will later provide the map design references and club assets.
- For the initial frontend milestone, mock data is acceptable. Clearly isolate mock data so it can be replaced by real data later.
- A static map may be used only as a temporary placeholder while the interactive map is being prepared; it is not an acceptable final map implementation.

### Section 3 — Project explanation and footer

- Use the third supplied reference image.
- Include the project explanatory message, all shown company/project icons, the image containing participating club crests, and the footer.
- The owner supplies all images and icons.

## 5. Color and typography

- Main backgrounds: white and very light bone/off-white yellow, matching the supplied references.
- Text: black or white according to the relevant element in the reference.
- Sections 1 and 3: Tiro Bangla.
- Section 2: Montserrat.
- Italic phrases retain the typeface assigned to their section and use italic styling only.
- Do not invent or approximate brand/team HEX colors. Record exact values when the owner supplies/approves them.

## 6. Copy and assets

- Text must match the three reference images exactly.
- Do not add, rewrite, remove, or paraphrase visible copy.
- All icons and images are supplied by the owner. Do not source substitutes or generate replacement logos/crests.
- Develop all other visual elements with CSS or appropriate frontend technology, guided by the references.

## 7. Header and navigation

- Header remains visible while scrolling through all three sections.
- The only button/action in this homepage is `VOTAR`.
- For this milestone, `VOTAR` navigates to a blank provisional page (for example, `/votar`).
- Registration, login, and logged-in destinations are future work.
- Do not add other navigation controls or actions unless approved.

## 8. Results/map states

Implement and visually review these states, maintaining the same design language:
1. Normal / all OK.
2. Data error.
3. No connection.
4. Loading.

The owner permits implementation decisions for how these states appear, provided they respect the page's visual style. Do not invent misleading real results in the normal state; use clearly identified mock data during development.

## 9. Interaction and permissions

- Homepage is read-only.
- Users can view national results and, in future, provincial results.
- No forms or form validation are required on this page.
- `VOTAR` is the only navigation action.

## 10. Acceptance checklist

- [ ] Three sections appear in the approved order and scroll vertically.
- [ ] Desktop composition matches the supplied references.
- [ ] All text matches the references exactly.
- [ ] Header remains visible throughout scrolling.
- [ ] `VOTAR` opens the provisional blank route.
- [ ] Ball animation is slow, smooth, and continuous.
- [ ] Coat-of-arms animation runs once and stops at its final position.
- [ ] Map supports the approved interactions and exact club colors.
- [ ] All four result/map states exist.
- [ ] Desktop, tablet, and mobile layouts are professionally adapted to each viewport.
- [ ] All content and functionality remain accessible, with appropriate readability and usability on every device.
- [ ] Responsive adaptations preserve the approved visual identity and design consistency.
- [ ] No unapproved images, icons, copy, or controls have been introduced.
