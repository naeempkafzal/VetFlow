# Design Guidelines: Pakistani Veterinary Workflow Dashboard

## Design Approach
**System-Based: Material Design** - Optimal for data-dense dashboard applications with strong card patterns and bilingual support. Pakistani veterinary context requires professional, trustworthy interface with clear information hierarchy.

## Typography System
**Primary Font**: Inter (Google Fonts) - excellent Latin/Urdu compatibility, highly legible for data
**Headings**: 
- H1: 32px, weight 700
- H2: 24px, weight 600
- H3: 18px, weight 600
**Body**: 16px, weight 400, line-height 1.6
**Small/Caption**: 14px, weight 400
**RTL Support**: Reverse text-align and flex-direction dynamically based on language selection

## Layout & Spacing
**Container System**: 
- Max-width: 1280px centered
- Padding: 24px (mobile), 48px (desktop)
**Spacing Scale**: Use multiples of 8px (8, 16, 24, 32, 48px)
- Card padding: 24px
- Section gaps: 32px
- Component margins: 16px
**Grid**: 12-column responsive grid for dashboard cards

## Component Library

### Navigation
**Top Bar**: Fixed header (64px height)
- Left: Logo + app name
- Center: Search bar (400px wide, rounded 8px)
- Right: Language toggle, notifications bell, user avatar
- Shadow: subtle 0 2px 4px

### Dashboard Cards
**Statistics Cards** (4-column grid on desktop, stack mobile):
- Height: 140px
- Border-radius: 12px
- Shadow: 0 1px 3px
- Icon (32px) top-left
- Large number (36px, weight 700)
- Label below (14px)
- Micro trend indicator (arrow + percentage)

**Activity Feed Card**:
- Full-width or 2/3 width
- Max-height: 480px with scroll
- Individual items: 72px height, border-bottom separator
- Left: circular avatar/icon (40px)
- Center: 2-line content (primary 16px, secondary 14px muted)
- Right: timestamp (14px)

**System Status Card**:
- Display as horizontal progress bars
- Label + percentage + status indicator
- Bar height: 8px, rounded ends
- Stack 4-6 status items with 16px gaps

### Forms & Inputs
**Text Fields**:
- Height: 48px
- Border: 1px solid, radius 8px
- Padding: 12px 16px
- Focus: 2px border width
- RTL: Flip icon positions

**Buttons**:
- Primary: Height 44px, padding 12px 24px, radius 8px, weight 600
- Secondary: Same dimensions, outline style
- Icon buttons: 44px square
- Hero overlay buttons: backdrop-blur(10px), semi-transparent background

### Data Display
**Tables**:
- Row height: 56px
- Header: weight 600, 14px uppercase
- Zebra striping for readability
- Hover state on rows
- RTL: Reverse column order

**Charts/Graphs**: 
- Use Chart.js library
- Responsive containers
- Consistent 16px padding
- Legend positioned top-right (top-left for RTL)

## Hero Section
**Hero Image**: Yes - feature large veterinary-themed hero
- Full-width, 480px height (desktop), 320px (mobile)
- Overlay gradient (bottom to top fade)
- Centered content: Main heading (48px) + subheading (20px) + CTA button
- CTA button: backdrop-blur with semi-transparent background

## Images
1. **Hero**: Veterinary professional with livestock/pets, bright outdoor setting, 1920x480px
2. **Dashboard Stats Icons**: Simple line icons for patients, appointments, revenue, alerts (32x32px)
3. **Activity Feed Avatars**: Mix of animal icons and user photos (40x40px circles)
4. **Empty States**: Friendly illustrations for no-data scenarios (200x200px)

## Bilingual/RTL Implementation
- Detect language, apply `dir="rtl"` to root
- Mirror all horizontal positioning
- Flip flex-direction for navigation/cards
- Keep icons/images orientation unchanged
- Number formatting: Use locale-specific

## Page Structure
**Dashboard Layout**:
1. Fixed top navigation
2. Hero section (optional welcome banner)
3. Statistics cards row (4 cards)
4. Two-column section: Activity feed (left/right based on LTR/RTL) + System status
5. Recent appointments table
6. Quick actions floating button (bottom-right/left)

**Animations**: Minimal
- Card hover: subtle lift (translateY -2px)
- Loading states: skeleton screens
- Page transitions: none
- Focus states: smooth outline appearance

## Accessibility
- WCAG AA contrast ratios
- Keyboard navigation throughout
- ARIA labels for all interactive elements
- Screen reader announcements for dynamic content
- Focus indicators on all interactive elements
- Consistent tab order (reverse for RTL)