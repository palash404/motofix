# AGENTS.md — Rules for AI Coding Agents

This file contains mandatory rules for any AI coding agent working on the MotoFix project.

---

## 1. Read PROJECT_HANDOFF.md First

Before making any changes, read [`PROJECT_HANDOFF.md`](PROJECT_HANDOFF.md) in full.

It documents:
- The current state of the project
- What is implemented vs. planned
- The final approved homepage design
- The design system and visual rules
- Recommended next steps

Do not make assumptions about the project structure without reading it.

---

## 2. The Current Homepage is Final

The existing homepage (Navbar + Hero + Footer) is the **final approved design**.

- Do **not** redesign any part of the homepage unless the user explicitly asks for a redesign.
- Do **not** change the colors, layout, typography, or spacing of existing components.
- Do **not** replace the MotoFix logo with text or a different image.
- Do **not** remove the engine illustration from the Hero.
- Do **not** alter button hover behaviors.

If a user asks you to "fix" or "improve" something without specifying a redesign, interpret it as a bug fix, not a visual redesign.

---

## 3. Preserve the Design System

All design tokens (colors, spacing, typography, radii, transitions) are defined in [`src/styles/variables.css`](src/styles/variables.css).

- Use CSS custom properties from `variables.css` rather than hard-coding values.
- Do not introduce new CSS frameworks (Tailwind, Bootstrap, etc.) without explicit instruction.
- Do not add CSS-in-JS solutions.
- New component styles should follow the same pattern as existing component CSS files.

---

## 4. Inspect Before You Change

Before modifying any file:

1. Read the file in full.
2. Check which other files import or reference it.
3. Understand what the component or function does.
4. Make only the minimal changes required to complete the task.

Do not rewrite working code just to match a different style preference.

---

## 5. Reuse Existing Components and Styles

Before creating a new component or utility:
- Check `src/components/common/` for shared UI components.
- Check `src/styles/utilities.css` for existing utility classes (`.btn`, `.btn--primary`, `.btn--service-invert`, `.card`, `.container`, `.section`, `.grid-*`, etc.).
- Check `src/utils/helpers.js` for utility functions.
- Check `src/utils/constants.js` for app-wide constants.

Do not duplicate what already exists.

---

## 6. Keep Changes Targeted

- Only modify files that are directly relevant to the task.
- Do not touch unrelated components when implementing a specific feature.
- Do not reformat or restructure files that are not part of the task.
- Preserve all existing comments and documentation within files.

---

## 7. Do Not Delete Files Without Verification

Before removing any file:
- Search all source files for references to it.
- Confirm it is not imported anywhere.
- Confirm it is not referenced in `public/` or `index.html`.
- Confirm it is not listed in `vite.config.js` or `package.json`.

If you are uncertain, keep the file and add a note in `PROJECT_HANDOFF.md` instead.

---

## 8. Clearly Distinguish Implemented vs. Planned

When adding or modifying documentation:
- Mark anything that does not yet exist in code as **\[PLANNED\]**.
- Do not describe planned features as if they are implemented.

In code comments, if scaffolding something for future use, mark it clearly:
```js
// PLACEHOLDER — not connected to backend yet
```

---

## 9. Run the Build After Significant Changes

After any significant frontend change, run:

```bash
npm run build
```

- Fix any build errors before considering the task complete.
- If the build introduces new warnings that weren't there before, investigate them.
- Do not suppress lint warnings by disabling rules unless justified.

---

## 10. No Routing Has Been Set Up Yet

The project currently has **no React Router**. All navigation links use `href` anchors.

Do not attempt to wire up routing unless specifically asked to.
When routing is added, use `react-router-dom` and add it via:

```bash
npm install react-router-dom
```

---

## 11. The Backend Does Not Exist Yet

`src/services/api.js` is fully scaffolded, but **no Spring Boot backend exists**.

- Do not call API functions and expect them to work.
- When implementing features that need data, use placeholder/mock data until the backend is built.
- Do not modify `api.js` endpoints without verifying the intended backend contract.

---

## 12. Ask Only When Genuinely Necessary

If a task is clear and all required information is available:
- Proceed without asking.
- Prefer action over clarification for small, well-defined tasks.

Ask for clarification only when:
- The task is ambiguous and proceeding risks breaking something.
- A decision needs to be made that changes the design or architecture.
- Required information (API endpoint, backend schema, etc.) is missing and cannot be inferred.
