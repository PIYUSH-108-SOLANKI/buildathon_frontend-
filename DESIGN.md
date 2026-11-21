---
name: Autonomous AI SRE Platform
description: Luminous 3D architectural visualization and autonomous reliability control room
colors:
  neutral-bg: "#FBFAF8"
  neutral-card: "#FFFFFF"
  neutral-subtle: "#F6F4F0"
  primary-peach: "#F9DDCA"
  accent-orange: "#F28C55"
  text-charcoal: "#292623"
  text-muted: "#79716B"
  text-faint: "#A8A29E"
  border-warm: "#EFE8E1"
  border-subtle: "#E6DFD7"
  status-healthy: "#10B981"
  status-degraded: "#F59E0B"
  status-critical: "#E11D48"
  status-ai: "#8B5CF6"
  status-recovering: "#F28C55"
typography:
  display:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0.02em"
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.4"
rounded:
  xs: "3px"
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-charcoal}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-surface:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-charcoal}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: Autonomous AI SRE Platform

## Overview

**Creative North Star: "The Luminous 3D Architecture"**

The interface represents the autonomous AI Site Reliability Engineering platform as a physical, interconnected architectural structure floating in a serene, warmly lit studio space. Departing entirely from tired, dark-mode terminal dashboards, this visual world embraces light ivory foundations (`#FBFAF8`), soft peach slab layers (`#F9DDCA`), vibrant safety orange telemetry accents (`#F28C55`), and deep charcoal typography (`#292623`).

The entire microservice architecture is materialized in five vertically stacked, floating 3D layers. SRE operators explore system health by navigating in real 3D space, clicking components to initiate smooth camera fly-throughs, inspecting live streamed logs in crisp, readable light terminals, and verifying counterfactual AI recovery decisions.

**Key Characteristics:**
- **Warm Luminous Studio Space:** Soft directional sunlight, subtle ambient peach occlusions, and gentle contact shadows.
- **Stacked Architectural Slabs:** Physical rounded layers organizing Monitored Apps, Observability, AI Reasoning, Autonomous Response, and Recovery Verification.
- **Dynamic 3D Camera Focus:** True Three.js camera movement that glides toward selected components while keeping the full architectural context alive in the background.
- **Readable Light-Themed Telemetry:** JetBrains Mono figures on crisp white surfaces; live streaming logs with auto-scroll and pause/resume.

## Colors

### Neutral & Surfaces
- **Background Ivory** (`#FBFAF8`): The main ambient canvas and room background.
- **Pure Card White** (`#FFFFFF`): Elevated floating inspection panels, metrics cards, and drawer surfaces.
- **Subtle Ivory** (`#F6F4F0`): Inset controls, search inputs, and inactive tab pills.
- **Primary Peach** (`#F9DDCA`): Architectural layer foundations, component bezels, and focal highlights.
- **Accent Orange** (`#F28C55`): Primary call-to-actions, telemetry flow pulses, and active focal markers.
- **Primary Charcoal** (`#292623`): Dominant high-contrast typography (≥9:1 contrast ratio against ivory).
- **Muted Charcoal** (`#79716B`): Secondary labels, metadata keys, and inactive navigation items.
- **Warm Border** (`#EFE8E1` & `#E6DFD7`): Architectural dividers and soft container bounds.

### Semantic Status
- **Healthy Emerald** (`#10B981`, text `#047857`, bg `#ECFDF5`, border `#A7F3D0`): Nominal service health.
- **Degraded Amber** (`#F59E0B`, text `#B45309`, bg `#FFFBEB`, border `#FDE68A`): Elevated latency or retry warning.
- **Critical Rose** (`#E11D48`, text `#BE123C`, bg `#FFF1F2`, border `#FECDD3`): Pod failure or cascade event.
- **AI Synthesis Violet** (`#8B5CF6`, text `#6D28D9`, bg `#F5F3FF`, border `#DDD6FE`): Gemini AI deductions & counterfactual evaluations.

### Named Rules
**The Physical Material Rule.** 3D components use physical PBR materials with soft roughness (0.35-0.55), metalness (0.1), and subtle transmission to look like precision industrial design models rather than wireframes.

**The No-Dark-Terminal Rule.** Telemetry logs and console streams render on crisp ivory/white backgrounds with charcoal syntax highlighting. We never introduce jarring dark boxes into this light aesthetic.

## Typography

**Display & Body Font:** `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
**Telemetry, Logs & Metrics Font:** `JetBrains Mono`, monospace.

### Hierarchy
- **Display** (SemiBold 600, 1.75rem / 28px, line-height 1.2, tracking -0.02em): Major architecture headlines.
- **Headline** (SemiBold 600, 1.25rem / 20px, line-height 1.3, tracking -0.01em): Layer titles and panel headers.
- **Title** (Medium 500, 1rem / 16px, line-height 1.4): Component names and metric headings.
- **Body** (Regular 400, 0.875rem / 14px, line-height 1.5, max 70ch): Incident narratives and diagnosis rationales.
- **Label** (Medium 500, 0.75rem / 12px, line-height 1.4, tracking 0.02em): Status badges and architectural tags.
- **Telemetry / Mono** (Medium 500, 0.75rem - 0.875rem, tabular figures): Live log stream, latency ms, RPM, and commit hashes.

## Elevation & Depth

Depth is established naturally through Three.js real-time lighting and soft CSS drop shadows.

### Shadow Vocabulary
- **Soft Sm** (`box-shadow: 0 1px 3px rgba(41, 38, 35, 0.04), 0 1px 2px rgba(41, 38, 35, 0.02)`): Button rest states and small badges.
- **Soft Md** (`box-shadow: 0 4px 16px -2px rgba(41, 38, 35, 0.05), 0 2px 6px -1px rgba(41, 38, 35, 0.03)`): Floating metrics cards.
- **Soft Lg** (`box-shadow: 0 10px 30px -4px rgba(41, 38, 35, 0.07), 0 4px 12px -2px rgba(41, 38, 35, 0.03)`): Contextual inspection drawer and 3D overlay controls.

## Shapes

- **Corner Radii:** Generously rounded corners reflecting physical product design:
  - `sm` (6px): Badges, tooltips, inline tags.
  - `md` (10px): Buttons, search bars, Segmented controls.
  - `lg` (16px): Floating cards, metric panels, log console container.
  - `xl` (24px): Floating 3D layer slabs and drawer bounds.

## Components

### Buttons
- **Shape:** Rounded-md (10px).
- **Primary:** Background `#F28C55`, text `#FFFFFF`, font-weight 600, hover `#E57B42`.
- **Secondary:** Background `#FFFFFF`, text `#292623`, border 1px solid `#EFE8E1`, hover background `#F6F4F0`.
- **Focus Ring:** `focus-visible:ring-2 focus-visible:ring-orange-400/50`.

### Live Streaming Terminal
- **Container:** Pure white card (`#FFFFFF`) with warm border (`#EFE8E1`), rounded-lg (16px).
- **Log Rows:** Monospace `JetBrains Mono` with level badges (INFO in slate, WARN in amber, ERROR in rose, AI in violet).
- **Controls:** Auto-scroll toggle, pause/resume button, clear buffer, search filter.

### 3D Spatial Canvas
- Full viewport Three.js canvas featuring 5 floating architectural layers, orbital camera control, smooth click-to-zoom lerp, and animated bezier flow curves.

## Do's and Don'ts

### Do:
- **Do** maintain the clean ivory (`#FBFAF8`) and peach (`#F9DDCA`) color harmony across all screens.
- **Do** move the actual 3D camera when a component is clicked to provide spatial immersion.
- **Do** keep live logs legible with crisp charcoal typography on light backgrounds.
- **Do** provide an explicit "Back to Architecture" button that smoothly returns the camera to overview mode.

### Don't:
- **Don't** use dark terminal backgrounds or neon glowing cyberpunk borders.
- **Don't** clutter the 3D space with 2D card billboards that obscure the architectural layers.
- **Don't** invent fake backend results without clearly labeling demo simulation data.
