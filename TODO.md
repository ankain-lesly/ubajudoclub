# Project TODOs & Design Considerations

## Cloudinary URL Optimization Params (Archived for Review)
> All Cloudinary URL transformation parameters were removed to keep uploaded media URLs and thumbnails clean and unmodified (relying exclusively on client-side compression in `app/lib/media/compress.ts`). Preserved below with their original sources for future review:

- [ ] **Open Graph Social Card Transforms (`getOgImageUrl`)**
  - **Source**: `app/lib/media/cloudinary.ts` (`getOgImageUrl`, lines 55–84)
  - **Call sites**:
    - `app/lib/media/cloudinary.ts` (`uploadToCloudinary`, line 186)
    - `app/routes/session.$id.tsx` (`meta`, line 90)
    - `app/routes/sessions.tsx` (`meta`, line 34)
    - `app/routes/event.$id.tsx` (`meta`, line 27)
  - **Removed Video URL Params**:
    ```
    /video/upload/c_fill,g_auto,w_1200,h_630,so_0,q_auto,f_jpg/
    ```
    *(with extension replaced to `.jpg`)*
  - **Removed Image URL Params**:
    ```
    /image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/
    ```

- [ ] **Responsive Thumbnail Transforms (`getMediaThumbnailUrl`)**
  - **Source**: `app/lib/media/cloudinary.ts` (`getMediaThumbnailUrl`, lines 89–114)
  - **Call sites**:
    - `app/lib/media/cloudinary.ts` (`uploadToCloudinary`, line 185)
    - `app/lib/supabase/storage.ts` (`uploadSessionMediaFile`, line 48)
  - **Removed Video URL Params**:
    ```
    /video/upload/c_fill,w_400,h_300,so_0,q_auto,f_jpg/
    ```
    *(with extension replaced to `.jpg`)*
  - **Removed Image URL Params**:
    ```
    /image/upload/c_fill,w_400,h_300,q_auto,f_auto/
    ```
  - **Note for future review**: `c_fill,w_400,h_300` forced all portrait photos into 4:3 landscape crops without `g_auto` gravity; if re-enabled later, prefer `c_limit,w_800,h_800,q_auto:good,f_auto` to preserve portrait & landscape aspect ratios.

## Navigation & UI Placement
- [ ] **Navigation Placement for `/sessions` and `/members`**:
  - Review and explore alternative locations/spots for placing the `/sessions` (Mat Sessions) and `/members` (Member Directory) links to keep the primary header uncluttered:
    1. **Nested Header Dropdown / Menu**: Group community items under a single nav trigger like `Mat & Community` or `Dojo` (e.g., `Schedule`, `Sessions`, `Members`, `Belts`, `Gallery`).
    2. **Secondary Utility Bar / Sub-Navigation**: Place technical/database links (`/sessions`, `/members`) in a top micro-bar or secondary tab bar above or below the main navigation.
    3. **Footer & Quick Jump Links**: Keep the top navigation lean with essential public landing items (`Club`, `Schedule`, `Events`, `Join`), and surface `/sessions` and `/members` prominently in the footer sections and homepage jump cards (e.g. within `StatStrip`, `MatBand`, or quick action pills).
    4. **Dojo Portal / Athlete Hub**: Consolidate community and athlete directories under a unified hub entry point (e.g., `/mat` or `/portal`) linking to sessions, directory, and grading tracks.



###


- Stop refering to admins as coach not coaches will manage this app. Add this instruction to agent files




###################


- Dark Theme.
- Retro Design to be more like a Gym Workout Website
- sessions



###############################


As a Senior Product Designer and Frontend Engineer. Build a showcase duty website for UBa Judo Club. Built a beautify, modern, and  clean website with good UI/UX aesthetics. Website should be rich in UI Elements, subtle animation, vector elements and a grounded design flow.

Pick a modern aesthetic and bold combination design for the UI/UX

# UBa Judo Club

Web platform for the **University of Bamenda (UBa) Judo Club** at the Bambili Campus. Its primary objective is to track mat-side attendance, automate Kyu–Dan grading progression, surface actionable coaching insights, and drive student recruitment while keeping individual member identities private on public pages.

---

## Primary Objective

1. **Mat-Side Attendance & Coaching Insights**: Replace paper sign-in sheets at the Bambili UBa Campus Amphi 100 with instant search, one-tap check-in, and post-session wrap-ups that highlight turnout against club averages, regular members absent for 3+ consecutive sessions, and athletes eligible for belt promotion.
2. **Public Transparency Without Exposing Identities**: Showcase club activity, training schedules, belt progression standards, and anonymized turnout metrics to prospective UBa students 

## Stack
Use Strongly typed Typescript React Codebase

---

- while restricting all member names, matricules, and phone numbers to the coach portal (/panel route for staffs).

---

## Core Showcase & Modules

### 1. Public Showcase (`/`)
- **Hero & Live Club Status**: Club mission, live roster metrics (*Active Judokas*, *Black Belts*, *Competition Medals*, *Avg. Session Turnout*), real-time countdown to the next Bambili practice (`Tue 17:30`, `Thu 17:30`, `Sat 07:30` WAT), and direct registration CTA.
- **Heritage & Coaching Panel**: Club history since 2016 across 9 UBa faculties, FECAJUDO North West Regional League affiliation (`#NW-UBA-04`), and Sensei profiles.
- **Schedule, Dojo Logistics & Google Maps Directions**: Weekly training timetable, beginner gear checklist, and an interactive `@vis.gl/react-google-maps` finder (Places API New landmark autocomplete, GPS origin option, and `Route.computeRoutes()` Car/Bike/Walk routing to Sports Hall Wing B).
- **FECAJUDO Belt System & Anonymized Insights**: Interactive 6th Kyu (White) through Black Belt progression ladder, anonymized belt/faculty/weight-division breakdowns, a 10-session turnout trend chart, and End-of-Day session wrap-ups (aggregates only).
- **Activities & Training Gallery**: Filterable 6-photo gallery (*Training Sessions*, *Competitions*, *Gradings & Campus*) with a full-resolution lightbox viewer alongside FENASU & FECAJUDO tournament records.
- **Social Channels & Campus Share Kit**: Official links across WhatsApp, Instagram, TikTok, YouTube, Facebook, and X, paired with a pre-formatted weekly training invite generator for faculty groups.
- **Student Registration**: Onboarding form capturing Full Name, UBa Matricule, Faculty/School, WhatsApp number, Current Belt, and optional Weight Division.

### 2. Events Calendar (`/events`)
- Dedicated calendar for regional FECAJUDO belt exams, FENASU selection camps, freshman ukemi clinics, and past tournament outcomes.
- Includes category filtering (`Competition`, `Grading`, `Campus Event`, `Camp`), event sharing (WhatsApp, X, copy link), and public RSVP submission stored privately for staff review.

### 3. Staff & Mat-Side Portal (`/panel`)
Protected by a fixed launch passcode (`UBA2026`, session-persisted via `sessionStorage` and enforced server-side via `x-staff-code`, with no settings page):
- **Quick Attendance**: Start or resume active sessions, instant filter by name/matricule/faculty/weight, one-tap check-in cards, live mat header (*Total Present*, *First-Timers*, *Belt Mix*, *Weight Divisions*), and batch save/close.
- **After-Training Coach Insights**: Turnout vs. club average comparison, named list of absent regulars (3+ missed sessions) with one-click WhatsApp check-in links, and near-grading / eligible candidates with one-click belt promotion.
- **Member & Grade Directory**: Add, edit, or deactivate judokas, manage optional IJF/FECAJUDO weight divisions, inspect FENASU weight-class coverage, and track full Kyu/Dan promotion history.
- **Events & Squads**: Create/close events, inspect named RSVPs, assign competition squads, and auto-populate grading-eligible athletes.

---

## Technical Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Shadcn UI (`@base-ui/react`), Lucide icons, and `@vis.gl/react-google-maps`.
- **Backend & Persistence**: Node.js + Express (`server.ts`) mounting Vite middleware in development, exposing `/api/public/*` (anonymized/write-only public routes) and `/api/staff/*` (passcode-protected coach endpoints) backed by atomic JSON persistence (`data/uba-judo-db.json`).



######################


How can we improve the overall user experience of the app? What are the best ways to make it more engaging and intuitive for users?


As a Product Designer and Frontend Engineer,

- Enhance better on Sections backgrounds, No plane gradients effects they are too plan
- Introduce Events, Events Pages
- Gallery Page
- Add a calendar view

---

Proceed. While you build the UI, pay attention to the following concepts:

- JUDO CHARACTER STYLLED ILLUSTRACTIONS: Add references, generated vector elements of judo character styled illustration on the UI to give an impression of judo style design thereby keeping users elvolded. Analyze 
- Generate JUDO Belt SVG  

- append training stats before the description of metadata at /sessions/id
- optimize metadata fetch to only get the media needed.


http://localhost:5173/dashboard/sessions/58e90d1c-2ece-404f-9035-ff8bd26d93c2

5UAZ6X