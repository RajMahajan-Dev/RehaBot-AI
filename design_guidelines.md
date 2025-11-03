# RehaBot Design Guidelines

## Design Approach
**Utility + Healthcare Focused**: A calm, motivating rehabilitation interface that prioritizes clarity, accessibility, and emotional support for recovery journeys. Drawing inspiration from healthcare apps like Headspace and Calm, combined with productivity tools like Linear for clean data presentation.

## Color System
The user has specified an exact color palette that must be followed:

**Primary Colors:**
- Primary Blue: `#0F62FE`
- Secondary Teal: `#00B4D8`
- Accent Lavender: `#7F96FF`

**Backgrounds:**
- Main gradient: `linear-gradient(180deg, #0F172A 0%, #07122B 100%)`
- Card surfaces: `rgba(255,255,255,0.05)` with backdrop blur
- Dark theme base: `#0F172A` to `#07122B`

**Theme Modes:**
Support three modes: light, dark (default), and high contrast for accessibility

## Typography
- **Primary Font**: Inter or DM Sans via Google Fonts CDN
- **Headings**: Bold weights (600-700), larger sizing for hero (text-4xl to text-6xl)
- **Body**: Regular weight (400), comfortable reading size (text-base to text-lg)
- **UI Labels**: Medium weight (500), smaller sizing (text-sm)
- **Monospace**: For timers and duration displays, use JetBrains Mono

## Layout & Spacing
**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: `p-6` to `p-8`
- Section spacing: `py-12` to `py-20`
- Card gaps: `gap-4` to `gap-6`
- Container max-width: `max-w-7xl` with `mx-auto`

**Grid System:**
- Routine cards: 1 column mobile, 2-3 columns desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Timeline view: Single column with connecting lines
- Form fields: 2-column layout for desktop (`md:grid-cols-2`)

## Core Components

### Header
- Simple, fixed top bar with semi-transparent background
- Title: "RehaBot: AI for Recovery" with icon
- Theme switcher button on right
- Height: `h-16` with subtle bottom border or glow effect

### Cards (Primary UI Element)
- Background: Translucent blur `rgba(255,255,255,0.05)` with `backdrop-blur-lg`
- Border radius: `rounded-2xl` (very rounded as specified)
- Padding: `p-6`
- Glowing shadow: Soft colored shadows using primary/accent colors
- Each card shows: type badge, title, duration, difficulty indicator, progress bar, edit/delete buttons
- Hover state: Subtle lift effect with increased glow

### Buttons
- Border radius: `rounded-2xl` (as specified)
- Primary: Blue background with white text
- Secondary: Teal outline with teal text
- Accent: Lavender for special actions
- Padding: `px-6 py-3` for primary actions, `px-4 py-2` for secondary
- When on images: Add `backdrop-blur-md` background
- No custom hover states needed (component handles it)

### Modals
- Centered overlay with dark backdrop (`bg-black/60`)
- Modal content: Same translucent card style
- Close button in top-right
- Smooth entry animation (fade + scale)
- Max width: `max-w-2xl` for editor, `max-w-md` for confirmations

### Forms (Onboarding)
- Input fields: Dark background with subtle border, focus state with primary color glow
- Select dropdowns: Styled to match inputs
- Labels: Above inputs, medium weight, teal color
- Spacing between fields: `gap-6`
- Multi-step indicator: Progress dots or numbered steps with connecting lines

### Timeline View
- Vertical layout with connecting lines between day blocks
- Day headers: Large, bold with day number badge
- Blocks grouped under each day
- Connecting lines: Dotted or solid lavender accent color
- Indentation for hierarchy

### Progress Indicators
- Linear progress bars with gradient fill (primary to teal)
- Circular progress for run mode (percentage display)
- Step counters with checkmark icons
- Height: `h-2` for bars, smooth transition animation

### Run Mode UI
- Full-screen or prominent overlay
- Large timer display (monospace font)
- Current step highlighted with glow
- Progress bar at top
- Play/pause controls centered
- Next/previous step navigation
- Voice cue text display (animated entry)

## Animations
Use Framer Motion for all transitions:
- **Page transitions**: Fade + slide up (`initial={{ opacity: 0, y: 20 }}`)
- **Card entry**: Stagger children with 50ms delay
- **Modal**: Scale from 0.95 to 1 with fade
- **Progress bars**: Smooth width transition
- **Hover effects**: Subtle scale (1.02) and shadow increase
- **Delete/remove**: Slide out + fade
- **Run mode step changes**: Cross-fade between steps

Keep animations smooth (200-300ms duration) and subtle to maintain calm feel.

## Visual Hierarchy
1. **Generate Button**: Most prominent CTA, glowing primary blue
2. **Routine Cards**: Main content, equal visual weight
3. **Action Buttons**: Secondary prominence (edit, delete, share)
4. **Metadata**: Subtle gray text for durations, difficulty

## Accessibility
- High contrast mode: Increase color contrast ratios to WCAG AAA
- Focus indicators: Clear outlines with primary color
- Keyboard navigation: All interactive elements accessible
- Screen reader labels: Descriptive aria-labels for icons
- Font size: Minimum 16px for body text
- Touch targets: Minimum 44x44px for mobile

## Images
**No hero image required.** This is a utility-focused app. Use:
- Icon illustrations for empty states (e.g., "No routines yet")
- Small decorative icons within cards to represent exercise types
- Optional: Abstract gradient backgrounds for sections
- Placeholder avatar for user profile (if implemented)

## Special Visual Effects
- **Glow effects**: Use box-shadow with semi-transparent primary/accent colors
- **Glassmorphism**: Translucent cards with backdrop blur throughout
- **Gradient overlays**: Subtle gradients on cards for depth
- **Soft shadows**: Multi-layer shadows for elevation (not harsh)
- **Border glows**: Animated glows on focus states

## Responsive Behavior
- **Mobile** (< 768px): Single column, full-width cards, bottom nav for run mode
- **Tablet** (768-1024px): 2-column grid, stacked forms
- **Desktop** (> 1024px): 3-column grid, side-by-side layouts for editor