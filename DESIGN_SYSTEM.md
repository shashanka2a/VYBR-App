# Mobile PWA Design System

## 🎨 Design Tokens

### Spacing (8px Grid System)
Our spacing system is based on an 8px grid for consistent layouts:

```css
--spacing-1: 4px   (0.25rem)
--spacing-2: 8px   (0.5rem)  
--spacing-3: 12px  (0.75rem)
--spacing-4: 16px  (1rem)    
--spacing-5: 20px  (1.25rem)
--spacing-6: 24px  (1.5rem)  
--spacing-8: 32px  (2rem)    
--spacing-10: 40px (2.5rem)  
--spacing-12: 48px (3rem)    
--spacing-16: 64px (4rem)    
--spacing-20: 80px (5rem)    
--spacing-24: 96px (6rem)    
```

### Typography Scale

#### Headings
- **H1**: `heading-1` - 30px, Bold, Tight leading
- **H2**: `heading-2` - 24px, Semibold, Tight leading  
- **H3**: `heading-3` - 20px, Semibold, Normal leading
- **H4**: `heading-4` - 18px, Medium, Normal leading

#### Body Text
- **Large**: `body-large` - 18px, Normal, Relaxed leading
- **Normal**: `body-normal` - 16px, Normal, Normal leading
- **Small**: `body-small` - 14px, Normal, Normal leading
- **Caption**: `caption` - 12px, Medium, Uppercase

### Color Palette

#### Primary Colors
- **Primary 50**: `#f0f9ff` - Light backgrounds
- **Primary 500**: `#4f46e5` - Main brand color
- **Primary 600**: `#4338ca` - Hover states
- **Primary 700**: `#3730a3` - Active states

#### Secondary Colors  
- **Secondary 50**: `#f8fafc` - Light backgrounds
- **Secondary 500**: `#64748b` - Text and borders
- **Secondary 600**: `#475569` - Hover states
- **Secondary 700**: `#334155` - Active states

#### Accent Colors
- **Emerald**: `#10b981` - Success, positive actions
- **Purple**: `#8b5cf6` - Creative, premium features
- **Amber**: `#f59e0b` - Warnings, highlights

#### Semantic Colors
- **Success**: `#10b981` - Success messages, confirmations
- **Warning**: `#f59e0b` - Warnings, cautions
- **Error**: `#ef4444` - Errors, destructive actions
- **Info**: `#3b82f6` - Information, neutral actions

## 🎭 Components

### Buttons

#### Variants
```tsx
// Primary button with gradient
<Button variant="gradient">Primary Action</Button>

// Standard button
<Button variant="default">Default</Button>

// Outline button
<Button variant="outline">Secondary</Button>

// Ghost button
<Button variant="ghost">Tertiary</Button>
```

#### Micro-interactions
- **Hover**: Slight upward movement (-1px) + shadow
- **Active**: Scale down (98%) + no shadow
- **Focus**: Ring outline for accessibility

### Cards

#### Hover Effects
```tsx
<Card className="card-hover">
  {/* Card content */}
</Card>
```

- **Hover**: Upward movement (-2px) + enhanced shadow
- **Transition**: Smooth 250ms ease-in-out

### Loading States

#### Skeleton Loading
```tsx
import { Skeleton, CardSkeleton, ListSkeleton } from '@/components/ui/loading'

// Individual skeleton
<Skeleton className="h-4 w-3/4" />

// Card skeleton
<CardSkeleton />

// List skeleton
<ListSkeleton items={3} />
```

#### Spinner Loading
```tsx
import { LoadingSpinner } from '@/components/ui/loading'

<LoadingSpinner size="lg" />
```

### Empty States

#### Predefined Empty States
```tsx
import { 
  NoCommunitiesFound, 
  NoEventsFound, 
  NoMatchesFound,
  ChatWelcome 
} from '@/components/ui/empty-state'

// Usage
<NoCommunitiesFound />
<NoEventsFound />
<NoMatchesFound />
<ChatWelcome />
```

#### Custom Empty State
```tsx
import { EmptyState } from '@/components/ui/empty-state'

<EmptyState
  icon={<YourIcon />}
  title="Custom Title"
  description="Custom description"
  action={{
    label: "Action Button",
    onClick: handleAction
  }}
/>
```

## 🎬 Animations & Micro-interactions

### Button Interactions
- **Tap Feedback**: `tap-feedback` class
- **Hover Effects**: Automatic with button variants
- **Loading States**: Built-in spinner support

### Swipe Animations (Roomies Tab)
```css
.swipe-card {
  transition: transform 250ms, opacity 250ms;
}

.swipe-left {
  transform: translateX(-100%) rotate(-10deg);
  opacity: 0;
}

.swipe-right {
  transform: translateX(100%) rotate(10deg);
  opacity: 0;
}
```

### Loading Animations
- **Skeleton**: Shimmer effect with gradient animation
- **Pulse**: For notifications and highlights
- **Bounce**: For success states and celebrations

## 📱 Mobile-First Principles

### Touch Targets
- Minimum 44px touch targets for accessibility
- Adequate spacing between interactive elements
- Thumb-friendly navigation placement

### Performance
- Optimized animations (transform/opacity only)
- Reduced motion support via `prefers-reduced-motion`
- Efficient CSS custom properties

### Accessibility
- Focus rings for keyboard navigation
- Semantic HTML structure
- ARIA labels where needed
- Color contrast compliance (WCAG AA)

## 🎯 Usage Guidelines

### Do's
✅ Use the 8px spacing grid consistently  
✅ Apply micro-interactions to enhance UX  
✅ Use semantic colors for their intended purpose  
✅ Implement loading states for better perceived performance  
✅ Include empty states with helpful actions  

### Don'ts
❌ Mix spacing systems (stick to 8px grid)  
❌ Overuse animations (keep them subtle)  
❌ Use colors outside the defined palette  
❌ Forget loading and empty states  
❌ Ignore accessibility requirements  

## 🔧 Implementation

### CSS Classes
The design system provides utility classes:

```css
/* Typography */
.heading-1, .heading-2, .heading-3, .heading-4
.body-large, .body-normal, .body-small, .caption

/* Interactions */
.tap-feedback
.card-hover
.button-primary

/* Animations */
.swipe-card, .swipe-left, .swipe-right
.skeleton, .pulse-notification, .bounce-success

/* Gradients */
.gradient-primary, .gradient-success, .gradient-text
```

### Tailwind Integration
All tokens are integrated with Tailwind CSS:

```tsx
// Spacing
<div className="p-4 m-2 gap-3">

// Colors  
<div className="bg-primary-500 text-white">

// Typography
<h1 className="text-3xl font-bold">

// Shadows
<div className="shadow-lg hover:shadow-xl">
```

## 🚀 Future Enhancements

- Dark mode color tokens
- Additional component variants
- Animation presets for complex interactions
- Responsive typography scales
- Advanced theming system

---

This design system ensures consistency, accessibility, and premium feel across the entire Mobile PWA application.