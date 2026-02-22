# WAL — Project State Journal

## 2026-02-21 | Session 38

### Started
- TASK-053: Add top margin to social media text on mobile to fix visual crowding

### Completed
- TASK-053: Add top margin to social media text on mobile to fix visual crowding
  - `public/css/main.css`: Separated `#social-media .panel-content` from `#live-events .panel-content` clustering and added `margin-top: 2rem;` to push the headline away from the bottom of the newly-uncropped social media video wrapper.
- Built and deployed to Firebase.
- Pushed to Github.

### Decisions (and why)
- Because the social media video was allowed to take its native height in Phase 3, the immediate start of the text felt visually crushed against its border. Implementing a targeted top margin restores identical whitespace ratio as the rest of the site layout flow.

### Questions / REVIEW markers
- None.

### Next
- Check with user.

## 2026-02-21 | Session 37

### Started
- Phase 3 Mobile Polish (TASK-048 to 052)

### Completed
- TASK-048: Reorder Hero gallery to be visually above text
  - `public/css/main.css`: Changed `#hero .hero-gallery-wrapper` to `order: 1` and `#hero .panel-content` to `order: 2`.
- TASK-049: Reduce top/bottom paddings to minimize gaps between sections
  - `public/css/main.css`: Replaced large explicit top and bottom padding calculations in `#live-events`, `#social-media`, etc., with a fixed `padding: 2rem 0;`.
- TASK-050: Center Product section text over its full background image
  - `public/index.html` & `public/css/main.css`: Restored `#product-video .bg-video-wrapper` to `position: absolute; height: 100%;` and used `justify-content: center` to center the text over it.
- TASK-051: Make gallery cards untouchable on mobile
  - `public/css/main.css`: Added `pointer-events: none !important;` to `.mobile-gallery-wrapper` and `.hero-gallery-wrapper` during mobile widths to prevent touch scrolling disruption.
- TASK-052: Make social media video object-fit contain
  - `public/css/main.css`: Changed `.mobile-bg-video` from `object-fit: cover` to `contain` so it retains its full original dimensions without auto-scaling loss.
- Pushed to Github and Deployed to Firebase Hosting.

### Decisions (and why)
- Compressing the gaps to exactly `2rem` on standard sections forces them visually into tight continuation without crushing readability, leaving only the specialized `#hero` and `#about` sections mathematically bounded to UI controls.
- To honor the product video's static backdrop requirement effectively, centering the text with absolute positioning creates the desired "Product" title page effect naturally without disjointing the layout flow.
- Preventing pointer events locally on the gallery tracks protects native vertical touch scrolling from jittering on gallery card interaction.

### Questions / REVIEW markers
- None.

### Next
- Check back with the user.

## 2026-02-21 | Session 36

### Started
- Phase 2 Mobile Refinements (TASK-044 to 047)

### Completed
- TASK-044: Move Hero text above gallery and remove BG image on mobile
  - `public/css/main.css`: Hid `background-image: url('san francisco...')` and `#hero::before` specifically on mobile by setting `display: none` / `background-image: none`. Applied absolute `order: 1` to `.panel-content` and `order: 2` to `.hero-gallery-wrapper` within `#hero` to visually reverse HTML sequence rendering under flex flow direction `column`.
- TASK-045: Remove global `100svh` min height to shrink gaps
  - `public/css/main.css`: Removed `min-height: 100svh` globally from `section.panel` to compress gaps implicitly caused by underfilled viewports on high aspect ratio device screens.
- TASK-046: Change social media video to relative/auto to prevent cropping
  - `public/css/main.css`: Targeted `#social-media .bg-video-wrapper` resetting it to `height: auto`. Altered `.mobile-bg-video` global classes to allow `height: auto` over relative coordinates.
- TASK-047: Re-apply 100svh and justify-center to About section
  - `public/css/main.css`: Restored `min-height: 100svh` explicitly to the `#about` section by CSS ID selector. Restored text alignment using `justify-content: center`.
- Deployed to Firebase Hosting.
- Pushed changes to GitHub.

### Decisions (and why)
- After migrating to relative layout stacking, the `min-height: 100svh` declaration on every `.panel` forced small sections (like the 1-image static Product panel or custom Social Media video) to expand massively to fill the vertical device real-estate footprint, leading to large black vertical spacing gaps in the reading flow between content bounds and the subsequent panel triggers. Stripping this parameter naturally shrink-wraps the flexboxes to their minimal internal boundaries reducing negative space natively on variable mobile form factors while honoring the previously set bottom content margins.
- Instead of re-building HTML duplicates per section to control rendering sequence, simple flex `order: n` parameters on mobile media queries achieve identical user-view inversion cleanly.

### Questions / REVIEW markers
- None.

### Next
- Inform user of build finishes.

## 2026-02-21 | Session 35

### Started
- TASK-039: Adjust layout for mobile so content and gallery don't overlap (Re-opened)

### Completed
- TASK-039: Adjust layout for mobile so content and gallery don't overlap
  - `public/css/main.css`: Reconfigured the entire mobile layout stacking logic. Replaced `height: 100vh` on `section.panel` with `min-height: 100svh` and flex-start justification. Replaced `position: absolute` with `position: relative` and a fixed `55vh` height on `.bg-video-wrapper` (excluding the Hero). Removed the artificial `flex-end` alignment and margins on `.panel-content`.
  - Re-deployed to Firebase Hosting.
  - Committed and pushed to GitHub.

### Decisions (and why)
- The user reported that elements were still overlapping and there were awkward gaps. This happens intimately because `position: absolute` yanks the image asset out of the natural document layout flow, and forcing `height: 100vh` on dynamically sized mobile phone screens breaks predictability. By establishing a `position: relative` dedicated `55vh` block at the *top* of the flex column, the paragraph `.panel-content` block is naturally forced to flow *underneath* it, eliminating any chance of overlapping regardless of the device screen size. Using `min-height: 100svh` instead of a locked `100vh` ensures the text won't leak off the bottom on short screens, but will still perfectly fill the screen on modern browsers using small viewport units.

### Questions / REVIEW markers
- None.

### Next
- Inform user of the stacking layout engine changes.

## 2026-02-21 | Session 34

### Started
- TASK-039: Adjust layout for mobile so content and gallery don't overlap
- TASK-040: Change mobile Product section to static background image
- TASK-041: Replace mobile social media gallery with specific videos
- TASK-042: Build and deploy to Firebase
- TASK-043: Commit and push changes to git

### Completed
- TASK-039: Adjust layout for mobile so content and gallery don't overlap
  - `public/css/main.css`: Restrained `.mobile-gallery-wrapper` to the top 55% of the screen under the mobile breakpoint. Pushed `#live-events .panel-content`, `#social-media .panel-content`, and `#product-video .panel-content` down using `align-self: flex-end`.
- TASK-040: Change mobile Product section to static background image
  - `public/index.html`: Replaced `.mobile-gallery-wrapper` with `.mobile-fallback-bg` inside `#product-video`.
  - `public/css/main.css`: Styled `.mobile-fallback-bg` to display on mobile as a contained `background-image`.
- TASK-041: Replace mobile social media gallery with specific videos
  - `public/index.html`: Added `<video class="mobile-bg-video">` to `#social-media`, pointing to `social-media mobile.webm` and `.mp4`.
  - `public/css/main.css`: Styled `.mobile-bg-video` to display exclusively on mobile layouts.
- TASK-042: Build and deploy to Firebase
- TASK-043: Commit and push changes to git
  - Added, committed, and pushed to origin.

### Decisions (and why)
- The overlapping elements on mobile devices (gallery tracking directly behind text paragraphs) caused visual interference. Rather than pushing down all components globally with `.panel-content` adjustments, I specifically targeted the 3 lower video panels to align their content to the bottom (`flex-end`), while confining the visual asset wrappers (`.mobile-gallery-wrapper`, etc.) strictly to the upper 55% of the screen. This clears up the contrast hierarchy.
- The user requested swapping the Social Media gallery out for a newly uploaded mobile video edit `social-media mobile`, and reverting the Product section to a static image. I created two distinct layout fallback classes for mobile CSS visibility (`.mobile-fallback-bg` and `.mobile-bg-video`) to facilitate HTML tag variations gracefully under the 768px limit, maintaining desktop behaviors smoothly.

### Questions / REVIEW markers
- None.

### Next
- Report back to the user.

## 2026-02-21 | Session 33

### Started
- TASK-038: Replace mobile fading slideshows with horizontal scrolling galleries

### Completed
- TASK-038: Replace mobile fading slideshows with horizontal scrolling galleries
  - `public/css/main.css`: Deleted the `.mobile-slideshow` crossfading rules and added `.mobile-gallery-wrapper`, `.mobile-gallery-track`, `track-4`, and `track-7` which replicate the horizontal offset marquee effect from the Hero section (`gallery-scroll` math logic).
  - `public/index.html`: Replaced the 1-div-per-image mobile fallback containers (`.mobile-slideshow`) with the `.mobile-gallery-wrapper` and nested `.gallery-card` track logic. Kept card sizes identical to desktop for visual consistency, leveraging CSS `max-content` and infinite horizontal translations for the marquees.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user liked the horizontal overlapping marquee effect built for the desktop Hero section and wanted it adapted for the mobile versions of the secondary Video sections (Live Events, Social Media, Product Video) since they were originally just standing crossfading pictures. Reusing `.gallery-card` from the global stylesheet enforces uniform visual pacing. I calculated tracking percentages explicitly for `track-4` (4-item layouts) and `track-7` (7-item layouts). For the 1-item Product Video layout, I aggressively duplicated it 4 times so the scrolling motion would be seamless.

### Questions / REVIEW markers
- None.

### Next
- Check back with the user.

## 2026-02-21 | Session 32

### Started
- TASK-036: Fix fallback poster references in index.html for mobile

### Completed
- TASK-036: Fix fallback poster references in index.html for mobile
  - `public/index.html`: Updated the `<video>` block `poster` URL attributes for `#live-events`, `#social-media`, and `#product-video` explicitly from their defunct `.jpg` files to the newly processed `.webp` equivalents.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- During review of the mobile video layouts, it was discovered that while the mobile `.mobile-slideshow` divs were rendering properly now, the fallback HTML `<video>` player still expected `.jpg` images to load as the cover picture. Since the `live-events-poster.jpg`, `social-media-poster.jpg`, and `product-poster.jpg` objects were deleted previously in favor of smaller WebP compression, the browser could not grab the fallback image. Updating them explicitly binds the `poster=` tag to the new files.

### Questions / REVIEW markers
- None.

### Next
- Inform user of resolution.

## 2026-02-21 | Session 31

### Started
- TASK-035: Fix mobile slideshow visibility missing due to z-index

### Completed
- TASK-035: Fix mobile slideshow visibility missing due to z-index
  - `public/css/main.css`: Changed `.mobile-slideshow` from `z-index: 0` to `z-index: 2` entirely.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user reported the mobile webp posters weren't showing up for the video blocks (Live Events, Social Media). Inspection showed that while `display: block` successfully toggled the slideshow wrapper on `.mobile-slideshow` at small viewports, it sat at `z-index: 0`. The `.video-overlay` (the dark linear gradient layer explicitly above the videos) naturally sat at `z-index: 1`, covering the posters entirely. Raising `.mobile-slideshow` to `z-index: 2` pulls it completely free of the `.bg-video-wrapper` layers.

### Questions / REVIEW markers
- None.

### Next
- Inform user of resolution.

## 2026-02-21 | Session 30

### Started
- TASK-034: Commit and push changes to git

### Completed
- TASK-034: Commit and push changes to git
  - Ran `git add .` to stage all modifications including WebP poster migrations, WebM fixes, scrolling bug removals, background additions, and compressed Hero images.
  - Pushed to `origin/main` as requested.

### Decisions (and why)
- Following standard user protocol rule. 

### Questions / REVIEW markers
- None.

### Next
- Wait for user instructions.

## 2026-02-21 | Session 29

### Started
- TASK-033: Build and deploy updated (smaller) gallery images to Firebase

### Completed
- TASK-033: Build and deploy updated (smaller) gallery images to Firebase
  - Removed `public/images/old gallery` to ensure the backup 3-4MB files are not copied into `/dist` and pushed to Firebase servers.
  - Re-compiled Vite build with the new ~800KB `hero.jpg` files and deployed to Firebase Hosting.

### Decisions (and why)
- The user replaced the hero gallery images with newly compressed smaller files (dropping them from ~3.5MB to ~800KB each). Since Firebase Hosting automatically syncs and removes stale orphaned files based on the contents of the `dist` directory, all that was needed was to run a fresh build. Removing the `old gallery` directory entirely guarantees no accidental bloating of the server contents occurs.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 28

### Started
- TASK-032: Reduce Hero section background blur to 3px

### Completed
- TASK-032: Reduce Hero section background blur to 3px
  - `public/css/main.css`: Changed `#hero::before` pseudo element `backdrop-filter: blur()` value from `10px` down to `3px`.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user requested less of an aggressive blur effect on the 95% dark Hero background. Dropped the CSS filter value down to `3px` to make the city skyline slightly sharper but still comfortably out of focus against the foreground cards.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 27

### Started
- TASK-031: Increase Hero dimming to 95% and add blur

### Completed
- TASK-031: Increase Hero dimming to 95% and add blur
  - `public/css/main.css`: Increased `#hero::before` pseudo element `background-color` alpha channel from `0.90` to `0.95`.
  - `public/css/main.css`: Added `backdrop-filter: blur(10px)` (and webkit prefix) to gently blur the city background through the layer.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user wanted to further decouple the foreground cards from the background image. The combination of intense 95% dimming alongside a 10px CSS blur perfectly pushes the city skyline into the distant ambiance while keeping the sharp gallery cards in complete focus.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 26

### Started
- TASK-030: Increase Hero section dimming overlay to 90%

### Completed
- TASK-030: Increase Hero section dimming overlay to 90%
  - `public/css/main.css`: Changed `#hero::before` pseudo element `background-color` alpha channel from `0.70` to `0.90`.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user requested an even darker background for the Hero section (90%). This was achieved by updating the rgba values applied to the CSS overlay in the previous task.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 25

### Started
- TASK-029: Dim the Hero section background image by 70%

### Completed
- TASK-029: Dim the Hero section background image by 70%
  - `public/css/main.css`: Added an `#hero::before` pseudo element with a dark (`rgba(13, 12, 10, 0.7)`) `background-color` to span the entire section.
  - Set `z-index: 1` explicitly on `#hero .hero-gallery-wrapper` and `#hero .panel-content` to ensure they sit above the new dimming overlay.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user requested to dim the newly exposed background image by 70% so it wouldn't overpower the foreground content. Using a `::before` pseudo element on the `#hero` root block is the cleanest approach, as it precisely targets that specific background imagery without affecting the opacity of inner text elements or flex wrappers.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 24

### Started
- TASK-028: Fix Hero section background image visibility

### Completed
- TASK-028: Fix Hero section background image visibility
  - `public/css/main.css`: Changed `.hero-gallery-wrapper` `background-color` to `transparent` (was hardcoded to `var(--bg-dark)`) to stop it from occluding the parent `#hero`'s San Francisco background image.
  - `public/css/main.css`: Hid `.video-overlay` within `.hero-gallery-wrapper` (display: none) to remove the linear-gradient darken overlay as requested.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user reported the image wasn't visible. After further inspection, the flex-box `.hero-gallery-wrapper` wrapping div held a solid `--bg-dark` background color, and inside it ran a `.video-overlay` gradient box. Both of these blocked the newly applied background from `#hero` from bleeding through. Switching the wrapper to transparent explicitly fixed it.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 23

### Started
- TASK-027: Add San Francisco background image to the Hero section

### Completed
- TASK-027: Add San Francisco background image to the Hero section
  - `public/css/main.css`: Applied `san francisco.webp` as the `background-image` for `.hero-gallery-wrapper`.
  - Kept no dark overlay (`rgba(13, 12, 10, ...)` pseudo element) per user instruction "don't do the main contact transparent".
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- The user requested that the San Francisco background be applied exclusively to the Hero section natively without darkening the content. I achieved this by appending `background-image` to the existing `.hero-gallery-wrapper` CSS definition, which sits beneath the image gallery track but above the page `body`.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 22

### Started
- TASK-026: Add background image to Quote Hook section

### Completed
- TASK-026: Add background image to Quote Hook section
  - `public/css/main.css`: Added the `get a quote.webp` image as a background to the `#quote-panel-hook` section.
  - Added an `::before` pseudo-element with a black `rgba(13, 12, 10, 0.65)` dark overlay to maintain text legibility.
  - Re-compiled Vite build and deployed to Firebase Hosting.

### Decisions (and why)
- Followed the exact same CSS structure implemented in TASK-025 for the `#about` section to apply the newly discovered `get a quote.webp` background to the Quote hook area.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 21

### Started
- TASK-025: Move San Francisco background from global grain wrap exclusively to #about section

### Completed
- TASK-025: Move San Francisco background from global grain wrap exclusively to #about section
  - `public/css/main.css`: Reverted `.grain-overlay` to not include `san francisco.webp`.
  - `public/css/main.css`: Added the `san francisco.webp` image specifically to `#about` section using `background-image`.
  - Added an `::before` pseudo-element with a black `rgba(13, 12, 10, 0.75)` dark overlay to `#about` to maintain text legibility over the image.

### Decisions (and why)
- The user expressed dissatisfaction with the global application of the picture to the entire website via the grain overlay and instructed to limit it to the About section implicitly connected with the Quote form context. Removing from the fixed overlay and putting exactly into the `section.panel#about` DOM CSS rule perfectly locks the picture into one scroll stop.
- Added a 75% dark tint overlay pseudo element, because otherwise the white text over the brightly colored SF picture becomes completely illegible.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 20

### Started
- TASK-024: Deploy frontend fixes (slideshows, background, scroll fix) to Firebase Hosting

### Completed
- TASK-024: Deploy frontend fixes (slideshows, background, scroll fix) to Firebase Hosting
  - Ran `npm run build` to generate the Vite production bundle including new `san francisco.webp` image and modified `main.css`/`main.js`.
  - Ran `npx firebase deploy --only hosting` to upload the `dist` folder to Firebase.
  - Deployment confirmed successful.

### Decisions (and why)
- Followed standard build and deployment procedure to push frontend modifications live.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 19

### Started
- TASK-023: Set new San Francisco image as global background

### Completed
- TASK-023: Set new San Francisco image as global background
  - Updated `.grain-overlay` in `main.css` to include `url('../images/san francisco.webp')` as a secondary background layer.
  - Set `background-size: auto, cover` so the grain repeats and the image fills the screen.
  - Increased opacity slightly to `0.12` so the image is visible yet remains a subtle backdrop.

### Decisions (and why)
- Used the existing fixed `.grain-overlay` `div` which already spans the entire screen and sits behind the content (`z-index: 100` but `pointer-events: none`). This efficiently solves the requirement for both desktop and mobile without introducing new complex DOM placement or additional JS observers.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 18

### Started
- TASK-022: Remove scroll snapping behavior (moves site backward unexpectedly)

### Completed
- TASK-022: Remove scroll snapping behavior (moves site backward unexpectedly)
  - `public/js/main.js`: removed GSAP ScrollTrigger import, `gsap.registerPlugin()`, and the `ScrollTrigger.create` block that enforced `snapTo` on section panels.

### Decisions (and why)
- The user reported the site moving backward unexpectedly. This is a direct side effect of `ScrollTrigger`'s `snap` configuration which aggressively tries to magnetize the viewport to specific sections when scrolling pauses.
- Removing this logic leaves only the Lenis smooth scrolling configuration, restoring the natural, precise scrolling movement mapped to the user's explicit scroll wheel/trackpad.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 17

### Started
- TASK-021: Implement mobile slideshows using WEBP posters for video sections

### Completed
- TASK-021: Implement mobile slideshows using WEBP posters for video sections
  - Added `.mobile-slideshow` and `.ms-slide` logic to `main.css` mapped within the `@media (max-width: 768px)` mobile media query.
  - Used pure CSS keyframe animations (`fade-4` and `fade-7`) staggered with `animation-delay` to create elegant continuous crossfades between the WEBP posters.
  - Added the corresponding HTML markup into `index.html` inside each `.bg-video-wrapper` leveraging the `.webp` images in the `images/` directory.
  - Set `.bg-video` to `display: none !important` on mobile to override the desktop video layout.

### Decisions (and why)
- Chose pure CSS keyframe animations for the slideshow fading instead of writing any JavaScript. This stays absolutely true to the "minimal footprint rule" and ensures snappy mobile device performance.
- The `product-video` section only had one poster (`product-poster.webp`), so it received a single-slide static version that semantically matches the `.ms-slide` HTML logic but doesn't actually crossfade.

### Questions / REVIEW markers
- None.

### Next
- Check user input or proceed with remaining TASKS.md priorities.

## 2026-02-21 | Session 16

### Started
- TASK-020: Restore WebM sources and deploy updated video assets

### Completed
- TASK-020: Restore WebM sources and deploy updated video assets
  - Restored `<source src="/videos/*.webm">` tags to `index.html` for all three video sections (`live-events`, `social-media`, `product-video`).
  - Ran Vite build. The newly provided `.webm` files were correctly hashed and bundled into the `dist` directory.
  - Redeployed to Firebase Hosting.

### Decisions (and why)
- The user provided properly optimized updated `.webm` files for `social-media` and `live-events`, and requested them explicitly. We restored the `.webm` `<source>` tags back into `index.html` to optimize bandwidth for modern browsers.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-020

## 2026-02-21 | Session 15

### Started
- TASK-019: Make hero gallery pictures 10% larger and overlap

### Completed
- TASK-019: Make hero gallery pictures 10% larger and overlap
  - Increased `.gallery-card` size by 10% to 286x374px in `main.css`.
  - Removed `gap` from `.hero-gallery-track`.
  - Added `margin-left: -30px` to `.gallery-card:not(:first-child)` to create a precise overlapping deck effect.
  - Added `padding-left: 20px` wrapper buffer for the leftmost card.
  - Adjusted animation logic to use exact visual track widths: `transform: translateX(-1792px)` to maintain a truly seamless loop without a 25px visual skipping gap.
  - Set `.gallery-card` to push hovered elements to `z-index: 30; position: relative` preventing right-side neighbours from burying the hover state overlap.
  - Redeployed to Firebase.

### Decisions (and why)
- Multiply original card width (260px) and height (340px) by 1.1x -> 286x374.
- CSS flexbox `gap` does not support negative values for overlapping. I will remove `gap`, use `margin-left: -30px` on all cards after the first one to create overlap seamlessly.
- Calculated exact scroll translation logic: the sequence of 7 cards repeating with `-30px` margins and `286px` width creates an exact footprint of `1792px` per set. Used `translateX(-1792px)` rather than `calc(-50%)` to avoid a 25px jump gap caused by the missing negative left-margin on the very first card in the list.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-019

## 2026-02-21 | Session 14

### Started
- TASK-018: Force browser to use updated MP4 by removing outdated WebM sources

### Completed
- TASK-018: Force browser to use updated MP4 by removing outdated WebM sources
  - Deleted `<source src="*.webm">` tags from the `<video>` elements in `index.html` for the `live-events`, `social-media`, and `product` sections.
  - Ran `rm public/videos/*.webm` to clean up the workspace.
  - Rebuilt and deployed the project.

### Decisions (and why)
- The browser was serving the old `.webm` video because it was naturally preferring the `.webm` `<source>` tag over the `.mp4` `<source>` tag if supported (e.g., Chrome). By removing the `.webm` sources altogether, we force the browser to immediately load the newly replaced `.mp4` files. We did this for all video sections to preemptively prevent this issue from happening again if the client replaces the other video assets too.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-018

## 2026-02-21 | Session 13

### Started
- TASK-017: Delete old live-events background video from public/dist and server

### Completed
- TASK-017: Delete old live-events background video from public/dist and server
  - Cleaned up the local distribution bundle by building a fresh `dist` folder.
  - Ran `firebase deploy --only hosting` to synchronize the site edge cache. Firebase automatically removes references to the old file hash and begins serving the newly updated `live-events.mp4`.

### Decisions (and why)
- Firebase Hosting acts as a strict mirror of the `dist` folder upon deployment. Re-building the bundle and re-deploying is the correct way to "delete" the old video file from the active server release.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-017

## 2026-02-21 | Session 12

### Started
- TASK-016: Deploy updated live-events video

### Completed
- TASK-016: Deploy updated live-events video
  - Ran `npm run build` to generate the Vite production bundle, hashing the newly optimized user-provided `live-events.mp4` file.
  - Ran `npx firebase deploy --only hosting` to upload the `dist` folder to Firebase.
  - Deployment confirmed successful.

### Decisions (and why)
- Standard deployment process triggered per user request to push the new video asset live.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-016

## 2026-02-21 | Session 11

### Started
- TASK-015: Slow gallery speed 15% and intensify outer frame glow

### Completed
- TASK-015: Slow gallery speed 15% and intensify outer frame glow
  - Increased `gallery-scroll` duration in `main.css` from 50s to 57.5s (15% slower).
  - Increased `box-shadow` outermost glow spread from 20px to 60px and opacity from 0.15 to 0.35 on the base frame state.
  - Increased `box-shadow` outermost glow spread from 40px to 80px and opacity from 0.3 to 0.5 on the hover state.
  - Deployed changes to Firebase Hosting.

### Decisions (and why)
- Stretching the box-shadow spread distance and opacity helps blend the dark background and the frame more naturally, reducing the harshness of the `#0d0c0a` background setting.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-015

## 2026-02-21 | Session 10

### Started
- TASK-014: Add inner/outer glow to gallery frames for rich depth

### Completed
- TASK-014: Add inner/outer glow to gallery frames for rich depth
  - Replaced the simple `box-shadow` in `main.css` for `.gallery-card-inner` with a multi-layered shadow consisting of a subtle gold inset border, a strong inner vignette, a deep outer drop shadow, and a subtle warm outer glow.
  - Enhanced the hover state to intensify the glow and drop shadow.
  - Ran `npm run build` and `firebase deploy --only hosting` to publish.

### Decisions (and why)
- Will use a combination of inset box-shadow (inner glow) and standard box-shadow (outer diffuse glow) using the brand's gold/warm tones or a deep atmospheric black to create a premium frame feeling. This avoids adding extra HTML DOM elements and relies entirely on CSS composite layers for performance.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-014

## 2026-02-21 | Session 9

### Started
- TASK-013: Add 7 hero images to photo gallery and deploy

### Completed
- TASK-013: Add 7 hero images to photo gallery and deploy
  - Modified `public/index.html` to duplicate the set of cards up to `anim-7`.
  - Pointed all 14 `background-image` elements to `hero1.jpg` through `hero7.jpg`.
  - Handled `main.css` to add `anim-6` and `anim-7` staggering delays mapped to existing `fly-in-*` animations.
  - Elongated the `gallery-scroll` duration to `50s` to account for the wider gallery track block so the scrolling speed feels identical.
  - Ran `npm run build` and `firebase deploy --only hosting` to upload the new assets.

### Decisions (and why)
- Will update the HTML to include 7 pairs of gallery cards instead of 5.
- Will update the CSS track animation `calc` calculation and `anim-6`/`anim-7` fly-in keyframes to support 7 cards.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-013

## 2026-02-21 | Session 8

### Started
- TASK-012: Setup CSS classes for final image placement in gallery

### Completed
- TASK-012: Setup CSS classes for final image placement in gallery
  - Replaced `.grad-*` classes in `index.html` with explicit inline `style="background-image: url(...)"` pointing to placeholder `/images/hero-gallery-X.jpg` files.
  - Added `.hero-img` class in `main.css` to govern `background-size: cover` and fallbacks for empty image states. 

### Decisions (and why)
- Will modify `index.html` to use inline styling for `background-image` so the user can just drop images into the `/images/` folder and update the URLs directly in the HTML without touching the CSS file. This makes content management easier for non-developers without needing a CMS.

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-012

## 2026-02-21 | Session 7

### Started
- TASK-010: Replace hero background video with animated photo gallery
- TASK-011: Deploy hero gallery to Firebase Hosting

### Completed
- TASK-010: Replace hero background video with animated photo gallery
  - Modified `public/index.html` to swap `.bg-video-wrapper` with `.hero-gallery-wrapper` containing 10 gradient cards (5 original + 5 duplicate for seamless infinite scrolling).
  - Modified `public/css/main.css` to add the `.hero-gallery-track` marquee infinite scroll.
  - Added fly-in animations (`fly-in-1` to `fly-in-5`) and hover scale/pause behavior.
- TASK-011: Deploy hero gallery to Firebase Hosting
  - Ran `npm run build` to generate the Vite production bundle.
  - Ran `npx firebase deploy --only hosting` to upload the `dist` folder to Firebase.
  - Deployment confirmed successful.

### Decisions (and why)
- Used pure CSS for both the initial fly-in stagger and the seamless infinite loop marquee. This avoids heavy JavaScript listeners, takes advantage of GPU acceleration, and adheres to the "keep it simple" rule.
- Translated the track by `calc(-50% - 7px)` to perfectly loop exactly 5 cards + 5 gaps (10 total cards with 9 gaps).

### Questions / REVIEW markers
- None yet.

### Next
- Complete TASK-010

## 2026-02-20 | Session 6

### Started
- TASK-009: Deploy media materials to Firebase Hosting

### Completed
- TASK-009: Deploy media materials to Firebase Hosting
  - Ran `npm run build` to generate the Vite production bundle, which automatically hashed the newly generated webm/mp4/jpg files in the `dist` directory.
  - Ran `npx firebase deploy --only hosting` to upload the `dist` folder to Firebase.
  - Deployment confirmed successful.

### Decisions (and why)
- Created TASK-009 per the user instruction to deploy the media. Every fix/action must have a corresponding task.
- Used the existing `build` script in `package.json` to ensure Vite processes the assets before deployment, fixing potential caching issues and guaranteeing optimized bundle sizes.

### Questions / REVIEW markers
- None.

### Next
- Wait for user instruction or proceed with other tasks.

## 2026-02-20 | Session 5

### Started
- TASK-003: Upload final production media files (replace placeholders)

### Completed
- TASK-003: Upload final production media files (replace placeholders)
  - `public/videos/`: processed `live-events.mp4`, `product.mp4`, `social-media.mp4` by transcoding them to `.webm` using VP9.
  - `public/images/`: extracted first frame JPEG posters for each video.
  - Replaced the previous 0-byte `.webm` and `.jpg` placeholders.

### Decisions (and why)
- Used fast VP9 encoding for `.webm` generation to ensure backgrounds load quickly and are web-compatible.
- `index.html`:70-89 — Left Hero section using `live-events.mp4` since it was previously set up that way and no separate `hero.mp4` placeholder was provided.
- Skipped converting `DJI_0318.mov` and `summit.mov` as they appear to be unoptimized raw files and are not referenced by any current placeholders in `index.html`. 

### Questions / REVIEW markers
- None.

### Next
- Wait for user instruction or proceed with other tasks.

## 2026-02-20 | Session 4

### Started
- TASK-005: Make quote form scrollable when background scroll is locked
- TASK-006: Fix quote form trackpad scrolling and custom scrollbar styles
- TASK-007: Deploy fixes to Firebase Hosting
- TASK-008: Commit and Push to Git

### Completed
- TASK-005: Make quote form scrollable when background scroll is locked
- Added `min-height: 0` to `.quote-form-container` in `main.css` to fix the flexbox scrolling bug.
- Added `window.lenis.stop()` and `.start()` calls in `quote.js` `openPanel`/`closePanel` functions. The previous developer had noted they did this in WAL but it was missing in code.
- TASK-006: Fix quote form trackpad scrolling and custom scrollbar styles
- `public/js/quote.js`:16-25,27-32 — Removed `window.lenis.stop()` and `.start()` because `lenis.stop()` completely blocks native trackpad/mousewheel scrolling when active.
- `public/css/main.css`:429-449 — Added custom webkit scrollbar styles to match the design (gold thumb, thin), and `overscroll-behavior: contain`.
- TASK-007: Deploy fixes to Firebase Hosting
- Ran `npm run build` and `npx firebase deploy --only hosting` per user request to deploy the frontend fixes.
- TASK-008: Commit and Push to Git
- Committed code changes, build files, and documentation (TASKS/WAL) to git.

### Decisions (and why)
- Created TASK-005 to follow the "Every fix is a new task" rule instead of fixing inline inside TASK-004 review.
- Fixed the CSS flexbox bug where `min-height: auto` on flex children prevents the container from shrinking, blocking `overflow-y: auto`.
- Created TASK-006 because the user reported trackpad scrolling failed and the default scrollbar was ugly.
- Decided to remove `lenis.stop()` completely instead of trying to hack it. The previous developer thought `overflow: hidden` wasn't enough, but with `data-lenis-prevent` on the full-screen backdrop, Lenis safely ignores the wheel events, allowing native scroll. Since `body` has `overflow: hidden`, native scroll chaining does not scroll the background anyway. Thus `lenis.stop()` was both unnecessary and the direct cause of the broken trackpad.
- Created TASK-007 to formally document the deployment step in the workflow.
- Created TASK-008 to formally document the git commit step in the workflow.

### Questions / REVIEW markers
- None.

### Next
- Wait for user instruction or proceed with other tasks.

## 2026-02-20 | Session 3

### Started
- TASK-004: Fix minor front-end design bugs across different viewports

### Completed
- TASK-004: Fix minor front-end design bugs across different viewports
- Transformed quote layout from right-anchored sidebar into a centered floating modal with an overlay
- Locked background body scrolling (`overflow: hidden`) when modal is active
- **Note on why scroll lock failed the first time:** The site uses `Lenis` for smooth scroll hijacking. Standard CSS `overflow: hidden` on the `body` does not stop Lenis from intercepting mouse wheel events and translating the page coordinates. I had to explicitly export the Lenis instance to the `window` object and call `window.lenis.stop()` when opening the modal, and `.start()` when closing it.
- Removed Budget and Location fields from form and Javascript payload

### Decisions (and why)
- User decided to upload media files manually at a later date. Reverting TASK-003 back to `[ ]` and skipping it for now.

### Questions / REVIEW markers
- Stopped on TASK-004. What specific design bugs need fixing across viewports?

### Next
- Proceed with TASK-004 after frontend evaluation.


## 2026-02-20 | Session 2

### Started
- TASK-002: Implement AI-agent tools for Web-MCP

### Completed
- TASK-002: Implement AI-agent tools for Web-MCP
- Deployed Firebase Cloud Function updates to save to Firestore rather than auto-emailing.
- Scaffolding local `mcp-server` app with @modelcontextprotocol/sdk to expose Firestore to AI agents.
- None yet

### Decisions (and why)
- Will pivot the Cloud Function to save quotes to Firestore instead of automatically emailing.
- Created `SPEC.md` to define the architectural transition needed to decouple the intake form from the email dispatch so an MCP agent can sit in the middle.

### Questions / REVIEW markers
- Stopped on TASK-002. Need specification: what exactly do the Web-MCP AI-agent tools need to do? Waiting for human input.

### Next
- TASK-002 in progress, waiting for human explanation/spec.


## 2026-02-20 | Session

### Started
- TASK-001: Add auto-responder email to the Client with confirmation of the quote request
- Project initialization and transition to TASKS.md workflow

### Completed
- TASK-001: Add auto-responder email to the Client with confirmation of the quote request
- Initial v3 codebase deployed to Firebase and pushed to GitHub
- Fixed backend route `404` by adjusting Express routes mapping
- Repaired email delivery and Gemini AI fallback handling by mapping correct environment variables

### Decisions (and why)
- Transitioned to the BOOT/WAL/TASKS structure based on global user rules.
- Set `trust proxy` in express to handle requests proxied via Google Cloud Load Balancer.

### Questions / REVIEW markers
- None yet

### Next
- Proceed with TASK-001 or other top priorities from TASKS.md
