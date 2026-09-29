---
name: Zakarya Oukil Portfolio (Version 7, the sheet)
description: One engineering drawing sheet in warm charcoal paper, bone ink and a single red, with a viewport-fixed frame that doubles as a scroll ruler.
colors:
  paper: "#1b1a18"
  paper-raised: "#23211e"
  paper-lifted: "#2c2925"
  bone: "#ece6d8"
  bone-dim: "#bdb5a5"
  bone-faint: "#948d7d"
  ink: "#12110f"
  red: "#e2452e"
  red-text: "#f26a52"
  brick: "#b3301c"
  print-caption: "#4b463c"
typography:
  display:
    fontFamily: "Gambetta, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(3.6rem, 8.6vw, 8rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gambetta, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.4rem, 5vw, 4.4rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Gambetta, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Switzer, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body-strong:
    fontFamily: "Switzer, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  dot: "50%"
spacing:
  frame-inset: "9px"
  page-gutter: "clamp(30px, 5.2vw, 96px)"
  section-y: "clamp(56px, 8vw, 120px)"
  tap-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.bone-dim}"
  button-red:
    backgroundColor: "{colors.brick}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "0 30px"
    height: "56px"
  button-red-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink}"
  print-card:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 14px 12px"
  sheet:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
  status-earned:
    textColor: "{colors.red-text}"
    rounded: "{rounded.none}"
    padding: "1px 8px"
---

# Design System: Zakarya Oukil Portfolio (Version 7, the sheet)

## Overview

**Creative North Star: "The Drawing Sheet"**

The whole site is one engineering drawing sheet lying on warm charcoal paper. A double-line frame with tick rulers is fixed to the viewport, so the page scrolls beneath it and the red marker on the left ruler reports position and names the section in view (Cover, Roles, Work, Contact). Content is set editorially: a large Gambetta serif name and headings, quiet Switzer reading text, and monospace reserved for measurement-style labels. Version 7 is a deliberate mix chosen by the owner: dark paper and the taped print (V1), the frame, rulers, corner brackets and mono callouts (V4), the editorial layout and serif (V2), the single red (V3), the pinned reel and hero settle (V5).

The mood is a dossier being laid out for a reader who has a minute: precise, warm, unhurried, and honest. Density is moderate: generous section padding, hairline rules instead of boxes, large type carrying hierarchy. Depth is minimal and physical: a taped photo print casts a real shadow; everything else is flat and separated by 1px lines.

Static film grain (a fixed 256px tile at 0.38 opacity) sits over everything so the paper never reads as flat digital black. Motion is a set of signature moments, not ambient decoration.

**Key Characteristics:**
- Warm charcoal paper, bone ink, exactly one red used sparingly and always for a job (tape, marker, brackets, scan line, earned stamp, hover text).
- Square corners everywhere; the only round shapes are the leader-line dots and the loupe.
- Hairline 1px rules in translucent bone define structure; no filled panels except the raised sheet.
- Serif for names and headings, sans for reading, mono only for labels, callouts, competency lines and sheet plates.
- Honest status: earned items are stamped red, in-progress items are plain dim with a dashed outline.

## Colors

A near-monochrome warm palette: charcoal paper, bone ink, and a single red in three tuned roles.

### Primary
- **Signal Red** (#e2452e): fills and graphics only: the tape, corner brackets, marker tick, scan line, earned-stamp border, leader lines for certified items, text selection background, red button hover.
- **Signal Red, Text** (#f26a52): the red when it is text or a focus outline on paper (hover on links and role titles, marker label, certified callout name, earned stamp text, focus ring). Lighter so it holds contrast on charcoal.
- **Brick** (#b3301c): the resting fill of the one primary call to action ("Try the live demo"); bone text on it. It lifts to Signal Red on hover.

### Neutral
- **Charcoal Paper** (#1b1a18): page ground, also the browser chrome color.
- **Raised Paper** (#23211e): the case-study sheet surface and sheet plate.
- **Lifted Paper** (#2c2925): defined as a token; reserved for a further step up (not yet used by a component).
- **Bone** (#ece6d8): primary text, rules (at 30% and 62% alpha), rulers, the neutral button fill, the print card and the sheet-wipe overlay.
- **Dim Bone** (#bdb5a5): secondary text, dek, ledes, nav links, button hover.
- **Faint Bone** (#948d7d): tertiary text: stack lines, facts labels, footer, notes.
- **Ink** (#12110f): text on bone surfaces (buttons, print card, wipe) and on red selection.
- **Print Caption** (#4b463c): italic caption under the portrait, on the bone card only.

### Named Rules
**The One Red Rule.** There is one hue of red. It marks things that do a job: a certified credential, a scroll position, a piece of tape, a primary action, a hover. It is never a background wash, a gradient, or decoration on a whole section.
**The Earned Rule.** Only a certified credential gets red and a stamp. In-progress and candidate items stay bone-dim with a dashed outline, however good they would look in red.
**The Text Red Rule.** Red text on paper uses Signal Red, Text (#f26a52); the fill red (#e2452e) is for shapes and lines.

## Typography

**Display Font:** Gambetta (with Iowan Old Style, Georgia, serif), self-hosted in /fonts via fonts.css, weights 400 to 700 with italic.
**Body Font:** Switzer (with Helvetica Neue, Arial, sans-serif), self-hosted, weights 400 to 800.
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace, Consolas, monospace).

**Character:** An editorial serif that reads like a masthead, paired with a neutral grotesque for prose, and a mono that behaves like the title-block lettering on an engineering drawing.

### Hierarchy
- **Display** (500, clamp(3.6rem, 8.6vw, 8rem), 0.94, -0.02em): the name in the hero only; balanced wrap; split into masked lines and characters for the entrance.
- **Headline** (500, clamp(2.4rem, 5vw, 4.4rem), 1, -0.02em): section titles (The roles, Selected work, Write to me.). Inner-page titles run larger (clamp(3rem, 8vw, 7rem)).
- **Title** (500, clamp(1.5rem, 2.6vw, 2.2rem), 1.1, -0.01em): role rows; sheet titles use clamp(2rem, 3.4vw, 3.2rem); contact values clamp(1.3rem, 2.4vw, 2rem); the brand is italic 500 1.5rem.
- **Body** (400, 18px, 1.6): reading text; secondary copy in Dim Bone; ledes capped near 54ch, sheet text 46ch, role bodies 64ch, case prose 60ch.
- **Body strong** (600, 16px): buttons, links (underlined 1px, offset .32em), nav.
- **Label** (mono 500, 11 to 14px, +0.04 to 0.06em, uppercase for marker, stamp and contact row labels): hero callouts (13/14px), competency lines (14px), stack lines (13px), status pills (12.5px), exhibit captions (12px), sheet plates and marker (11px).
- **Caption** (Gambetta italic 400, .95rem): print caption, on the bone card.

### Named Rules
**The Mono Is Measurement Rule.** Monospace appears only where the sheet would be lettered by machine: callouts, competency lines, stack lines, status pills, captions on exhibits, plates, the marker, contact row labels. Never for headings, buttons or paragraphs.
**The Serif Names Things Rule.** Every name and heading is Gambetta at weight 500 with negative tracking; body and controls are Switzer.

## Layout

An editorial two-column sheet. The hero is a 7fr / 5fr grid (name, dek and actions left; taped print with callouts right); Roles is 8fr / 4fr (role rows with a credentials aside); each work sheet is 7fr / 5fr (exhibit, text); Contact is 7fr / 5fr (title-block channel list, facts). Gutters clamp(24px, 5vw, 80px) to 88px. Page side padding is clamp(30px, 5.2vw, 96px), 22px under 700px. Sections have clamp(56px, 8vw, 120px) vertical padding and open with a 1px hairline inset to the gutter.

The viewport-fixed frame sits 9px from the edge (5px on small screens) with an inner line 6px further in. On screens wider than 800px the header is fixed inside the frame with a paper background and a bottom hairline, and content is offset 84px; below that it flows in the page. Under 900px all splits collapse to one column, callouts become a static list under the print, and leader lines are hidden. Under 700px the second frame line, rulers and marker are removed. All interactive targets are at least 44px tall.

Work: on screens at least 900px wide and 600px tall with motion allowed, the sheets pin and stack (each new sheet slides in from the right while the previous one scales to 0.93, tilts and dims to .45); otherwise they are a plain vertical list with 24 to 48px gaps. With reduced motion there is no pin, no smooth scroll, and everything is visible in place.

## Elevation & Depth

Flat by default; depth is only physical. The taped portrait card carries a real print shadow (`box-shadow: 0 26px 40px rgba(0,0,0,.45), 0 4px 8px rgba(0,0,0,.3)`), the tape a small one (`0 2px 4px rgba(0,0,0,.3)`), the pinned sheets a leftward cast (`-18px 0 40px rgba(0,0,0,.45)`) so the incoming sheet reads as lying over the last, the loupe `0 10px 24px rgba(0,0,0,.5)`, and the scan line a red glow (`0 0 18px 2px rgba(226,69,46,.55)`). Everything else separates with 1px lines at 30% or 62% bone.

### Named Rules
**The Hairline Rule.** Structure is drawn with 1px bone lines (30% for rows, 62% for edges and frames), a doubled inner outline on sheets, never with filled cards or soft glow.
**The Lying-On-Paper Rule.** Shadows exist only where an object lies on the sheet (print, tape, stacked sheet, loupe) and are soft and dark; they are never used on buttons, text or rows.

## Shapes

Square corners, no exceptions on surfaces, buttons, pills, plates and images (radius 0). Round forms are limited to the 7px leader-line dots and the 168px loupe. Recurring geometry: hairline rules, doubled frame lines, 16px red corner brackets (2px stroke, offset -7px) on the print, a 92 x 28px red tape strip at 1.5deg, a print card rotated -2.2deg, the earned stamp rotated -3deg, a CSS-drawn plus/minus on role rows, dashed 1px outline on in-progress status pills. Photographs are grayscale with contrast 1.05 and return to color on hover.

## Components

### Buttons
- **Shape:** square (0px), minimum height 44px, large 56px, weight 600.
- **Primary (bone):** Bone fill, Ink text, 1px Bone border, 0 22px padding (0 30px large).
- **Red:** Brick fill with Bone text for the single main action; hover to Signal Red with Ink text.
- **Hover / Active / Focus:** hover lifts 2px and dims bone to Dim Bone; active presses 1px down; focus is a 2px Signal Red, Text outline offset 4px, on all links and buttons.
- **Link:** inline, 600, underlined at 1px with a 62%-bone underline that turns Signal Red, Text on hover.

### Print card (signature)
A bone card holding a grayscale portrait, rotated -2.2deg, with red tape at top, four red corner brackets, an italic serif caption, and a print shadow. It tilts toward a fine pointer on a spring, and the image develops through a halftone (12px dot mask growing) on load.

### Callouts and leader lines
Mono labels to the right of the print, each preceded by a 1px bone leader with a dot terminus. The certified item uses red leader and red-text name; the others stay bone.

### Role rows
Serif titles in a hairline list, 72px min height, a CSS plus that rotates to a minus when open. One row is open at a time; competencies are mono lines separated by hairlines. Hover turns the title Signal Red, Text.

### Credentials aside
A hairline-bordered box (edges draw in) with each credential's name in bold, a status pill and a plain meaning line. Earned: red 2px border, uppercase bold mono, stamped at -3deg. Not earned: dashed 1px Faint Bone border, Dim Bone text.

### Case-study sheet
Raised Paper surface, 1px 62% border and an inner 1px outline at -8px offset. Exhibit image (16:10) on a near-black ground with a mono caption bar, a plate reading "Sheet n / N" bottom right, serif title, mono stack line. A real screenshot gets a 168px loupe at 2.4x on fine pointers; an illustrative image is captioned as illustrative.

### Contact title block
A hairline list of channels: mono uppercase label left, serif value right (60px rows). The row slides 10px on a spring on hover; the value turns Signal Red, Text.

### Navigation and frame
Fixed header inside the frame: italic serif brand left; Switzer 16px dim links, a version switcher and a bone Email button right. The frame's marker is a 16 x 2px red tick with a vertical mono label naming the current section.

### Motion
GSAP: split-text name entrance, halftone develop, frame lines draw in, red brackets and leader lines pop in, Flip on role rows with scrambled competency text, credential edges draw in and a spring stamp, pinned stacked sheet reel with scan-line reveal, sheet-wipe (bone sheet with double keyline and italic serif label) between routes, ScrollSmoother on wide fine-pointer screens only. Motion library springs: print tilt (stiffness 140, damping 16), stamp (380, 15), contact row (520, 26). Any pointer or key press finishes the hero entrance. Reduced motion shows all content with no pin, no smooth scroll, no wipe.

## Do's and Don'ts

### Do:
- **Do** keep the ground Charcoal Paper (#1b1a18) with the fixed grain overlay and Bone (#ece6d8) ink.
- **Do** spend red only on a job: fills #e2452e, text #f26a52, resting main action #b3301c.
- **Do** set names and headings in Gambetta 500 with -0.01 to -0.02em tracking; reading text in Switzer.
- **Do** use JetBrains Mono for callouts, competency lines, stack lines, status pills, captions and plates only.
- **Do** draw structure with 1px translucent-bone rules and keep every corner square.
- **Do** show earned, in-progress and candidate states as visibly different (red stamp versus dashed dim pill).
- **Do** give every interactive target at least 44px and a 2px Signal Red, Text focus outline.
- **Do** provide the reduced-motion state: everything visible, no pin, no smooth scroll.

### Don't:
- **Don't** use rounded corners on surfaces, buttons or pills.
- **Don't** introduce a second accent hue or a red wash, gradient or filled section.
- **Don't** put a shadow on anything that does not lie on the sheet (no button or row shadows).
- **Don't** set headings or buttons in mono, or paragraphs in serif.
- **Don't** present a non-certified credential in red, stamped or uppercase-bold.
- **Don't** replace the fixed frame, taped print or stacked sheet reel with a generic card grid or stock hero layout.
- **Don't** enable ScrollSmoother or pinning under reduced motion or on touch or narrow screens.
