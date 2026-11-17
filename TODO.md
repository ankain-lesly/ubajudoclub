# Project TODOs & Design Considerations

## Navigation & UI Placement
- [ ] **Navigation Placement for `/sessions` and `/members`**:
  - Review and explore alternative locations/spots for placing the `/sessions` (Mat Sessions) and `/members` (Member Directory) links to keep the primary header uncluttered:
    1. **Nested Header Dropdown / Menu**: Group community items under a single nav trigger like `Mat & Community` or `Dojo` (e.g., `Schedule`, `Sessions`, `Members`, `Belts`, `Gallery`).
    2. **Secondary Utility Bar / Sub-Navigation**: Place technical/database links (`/sessions`, `/members`) in a top micro-bar or secondary tab bar above or below the main navigation.
    3. **Footer & Quick Jump Links**: Keep the top navigation lean with essential public landing items (`Club`, `Schedule`, `Events`, `Join`), and surface `/sessions` and `/members` prominently in the footer sections and homepage jump cards (e.g. within `StatStrip`, `MatBand`, or quick action pills).
    4. **Dojo Portal / Athlete Hub**: Consolidate community and athlete directories under a unified hub entry point (e.g., `/mat` or `/portal`) linking to sessions, directory, and grading tracks.



###


- File Compression \ Large files prevents open graph images from showing. If supabase does not support compression, then switch to cloudinary for file uploads

- Issue with row level security policies, a user cannot create a join_request, validate this issues and other related and fix

- Cleanup other queries within the app to use the lib/api/entity.queries.ts standards while cleaning up the lib/api/ client and public

- Remove/Hide the public /register route and add user management