# Harmony Network

## Goal
Build a polished, interactive networking experience that lets attendees scan a busy event quickly, open any person, and move through their relationships without leaving the experience.

## Experience
- Open directly into a live event room with a brief first-visit introduction: “Meet people. Discover connections. Go further.”
- Provide fast search and compact interest filters for scanning a realistic crowd.
- Show each attendee’s photo, role, interests, and a concise personalized reason to meet.
- Open a focused person view beside the room rather than navigating away.
- Make the network explorer the centerpiece: a spatial constellation with animated relationship lines, depth, and people arranged across three human-named circles: Closest, Trusted, and Wider World.
- Let selecting a connection smoothly recenter the entire network around them, preserving a visible breadcrumb trail back through the discovery path.
- Include refined desktop and mobile layouts, keyboard-friendly controls, helpful empty states, and reduced-motion support.

## Visual direction
- Premium editorial minimalism: warm paper-white surfaces, deep ink typography, electric coral signals, cobalt relationship paths, and restrained translucent layers.
- Distinctive typography, crisp geometry, compact information density, and only purposeful motion.
- Person photography is treated as the visual identity; the app avoids dashboard conventions and generic business styling.

## Technical details
- Build the experience as the home screen using React state and curated demo attendee/network data.
- Add small reusable person, filter, network-node, and detail-panel components.
- Use CSS transforms and SVG paths for the animated spatial graph, with responsive positions rather than a heavyweight graph library.
- Add route-specific metadata and preserve the existing TanStack app shell.
- Verify the complete flow at desktop and mobile widths: onboarding, search/filter, opening a profile, entering the network, and hopping between people.
