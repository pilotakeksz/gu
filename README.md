# FHP Ghost Unit — rebuilt

A complete React + TypeScript recreation of the public [FHP Ghost Unit website](https://fhp-ghost-unit.vercel.app/index.html), with a new visual identity and locally preserved content and imagery.

## Run

Requires Node.js 20.19+ or 22.12+.

    npm ci
    npm run dev

Build and serve the production output:

    npm run build
    npm run preview

The build command generates the production site in dist/. The Vercel configuration preserves the original .html addresses and supports direct entry to every page. Deploy this directory as the project root, using npm run build and output directory dist.

## Design direction

**Ghost operations journal** — an editorial, utilitarian reference desk, inspired by printed service manuals and unit insignia.

DFII: **15** (impact 4 + fit 5 + feasibility 5 + performance 4 − consistency risk 3).
FFCI: **10** (architectural fit 5 + reusability 4 + performance 5 − complexity 2 − maintenance 2).

- Barlow Condensed: expressive, compact headings and unit identity.
- Source Sans 3: readable policies, navigation, and roster information.
- Locally hosted fonts; no external font requests.
- Charcoal navy (--canvas: #10171b), layered dark surfaces (--surface: #172127), warm light text (--text-primary: #e6e7e3), muted brass (--accent: #b4a27b).
- An 8px spacing rhythm, large typographic contrasts, thin rules, numbered document rows, and asymmetric composition.
- One short homepage entrance. Reduced motion is respected.
- The visual signature is the oversized GHOST UNIT masthead, with a nighttime field photograph, numbered resource rows, and a consistent dark document hierarchy.

## Included pages

| Original address | Rebuilt content and functionality |
| --- | --- |
| /index.html | Original unit introduction, safety statement, subdivisions, resources, and application links |
| /handbook.html | All 13 core sections, full text and lists, policy search, table of contents, print styling |
| /chain-of-command.html | Five command levels, 23 ranks, and original permissions |
| /vehicle-guidelines.html | All three divisions, rank selection, inherited fleet access, per-vehicle rules, five-angle reference images, accessible image viewer |
| /troopers.html | 51 original personnel, avatars, ranks, call signs, assignments, search, rank and subdivision filters |
| /official_media.html | All nine photos with original captions and credits, newest first, navigation controls, gallery and image viewer |
| /hspu_app_new.html | Original Google Forms application, published eligibility, direct form fallback |
| /srt_app_new.html | Original Google Forms application, published eligibility, direct form fallback |

## Source fidelity and boundaries

Captured on **3 October 2026**. Content data lives in public/data/. Domain code is organized in src/features/; folder-based routes live in src/routes/.

All handbook text, lists, bot commands, links, vehicle configuration fields, roster names, call signs, gallery captions, and photographer credits are retained. Decorative mathematical Unicode was normalized for legibility without changing names or meanings. Homepage framing and short editorial labels are new.

The original logo is included unchanged. Gallery and vehicle PNGs were converted to WebP with a maximum dimension of 1800px and quality 90. Available assets are local; only the original Google Forms embeds require an external service.

Three original avatar URLs returned 404: Ilcolega02, InvasionElectro, and Maullru2011. Their roster entries use initials. Five higher-rank boat reference URLs also returned 404 and are clearly labeled unavailable.

The original homepage pointed to two nonexistent handbook anchors. The rebuild provides those anchors with subdivision references drawn from the published homepage and links to the actual vehicle guide and applications. No missing subdivision policy has been invented.

The original media page contained admin/login/upload markup, but its deployed script had no authentication, upload, moderator-management handlers, or backend integration. The rebuilt public gallery doesn't pretend to offer those functions. A working administration system would need an authenticated backend.

## Validation

- Strict TypeScript and production build pass.
- Source-to-rebuild text comparison passes for all 13 handbook sections.
- The complete vehicle data matches the extracted original data.
- Fleet inheritance and per-car overrides verified for every regular rank.
- Accessible regular vehicle counts: High Command 23, Senior High Rank 21, High Rank 19, Sergeant Program 15, Low Rank 10.
- All 51 roster entries and all nine gallery entries verified; every available local image reference resolves.
- Browser checks: handbook search, trooper search, SRT filter (10 members), vehicle selection, lightbox opening and Escape dismissal, media next/previous controls, and mobile navigation.
- HSPU High Command includes six inherited vehicles; SRT Head Operative includes seven. The SWAT Truck restriction is preserved.
- All eight page layouts checked at a 390px viewport without horizontal overflow.
- Both original Google Forms URLs verified from their public HTML. No application was submitted.

## Copy cleanup

Decorative eyebrow labels, redundant section tags, and generated slogans were removed. The replacement prose and this document were checked with unslop 0.7.0 in deterministic mode. Original department policies and structured content were preserved.
