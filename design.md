# Spelling Bee - UI Design Layout

## Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                SPELLING BEE                                     │
│                              ═════════════════                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  SCORE: 42        ████████████████░░░░░░░░       GENIUS: 80%       WORDS: 8/25  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │               Current Level: GOOD (🎉)                                      │ │
│  │               12 points to Amazing!                                         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐  ┌─────────────────────────────────────┐
│                                          │  │          YOUR WORDS                │
│  ┌─────────────────────────────────────┐  │  │  ╔═══════════════════════════════╗ │
│  │                                     │  │  │  ║ Sort: [A-Z ▼] [Show Hints]   ║ │
│  │        TYPE YOUR WORD HERE          │  │  │  ╚═══════════════════════════════╝ │
│  │     ═══════════════════════         │  │  │                                   │
│  │                                     │  │  │  8 words • 42 points • 1 pangram │
│  └─────────────────────────────────────┘  │  │                                   │
│                                          │  │  ┌─────────────────────────────────┐ │
│      ┌─────────┐ ┌───────┐ ┌─────────┐    │  │  │ ABLE          +1              │ │
│      │ DELETE  │ │ CLEAR │ │ SUBMIT  │    │  │  │ ABOUT         +5              │ │
│      └─────────┘ └───────┘ └─────────┘    │  │  │ CABLE         +5              │ │
│                                          │  │  │ DECABBLE      +15 [PANGRAM]    │ │
│  ┌─────────────────────────────────────┐  │  │  │ LACED         +5              │ │
│  │         ✅ Good! +5 points          │  │  │  │ TABLE         +5              │ │
│  └─────────────────────────────────────┘  │  │  │ ...                           │ │
│                                          │  │  └─────────────────────────────────┘ │
│            ○     ○                       │  │                                   │
│         ○     ●     ○                    │  │  ┌─────────────────────────────────┐ │
│            ○     ○                       │  │  │      [NEW PUZZLE]               │ │
│                                          │  │  └─────────────────────────────────┘ │
│       A     B                            │  │                                   │
│   C     D     E    ← Honeycomb Letters   │  │                                   │
│       F     G                            │  │                                   │
│                                          │  │                                   │
│  D = Center Letter (Required)            │  │                                   │
│                                          │  │                                   │
└──────────────────────────────────────────┘  └─────────────────────────────────────┘
         MAIN GAME AREA                              SIDEBAR
```

## Mobile Layout (< 768px)

```
┌───────────────────────────────────────────────────┐
│                 SPELLING BEE                      │
│               ═════════════════                   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ SCORE: 42    ████████░░░░░░    8/25 WORDS         │
│                                                   │
│           Current Level: GOOD 🎉                  │
│            12 points to Amazing!                  │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                                                   │
│ ┌───────────────────────────────────────────────┐ │
│ │                                               │ │
│ │           TYPE YOUR WORD HERE                 │ │
│ │         ═══════════════════════               │ │
│ │                                               │ │
│ └───────────────────────────────────────────────┘ │
│                                                   │
│    ┌─────────────────────────────────────────┐    │
│    │        ✅ Good! +5 points              │    │
│    └─────────────────────────────────────────┘    │
│                                                   │
│ ┌─────────┐ ┌─────────┐ ┌─────────────────────┐  │
│ │ DELETE  │ │  CLEAR  │ │      SUBMIT         │  │
│ └─────────┘ └─────────┘ └─────────────────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                                                   │
│          ○     ○                                  │
│       ○     ●     ○                               │
│          ○     ○                                  │
│                                                   │
│     A     B                                       │
│ C     D     E    ← Touch to Select                │
│     F     G                                       │
│                                                   │
│ D = Center Letter (Required)                      │
│                                                   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                 YOUR WORDS                        │
│ ╔═══════════════════════════════════════════════╗ │
│ ║ [A-Z ▼]               [Show Hints]           ║ │
│ ╚═══════════════════════════════════════════════╝ │
│                                                   │
│ 8 words • 42 points • 1 pangram                  │
│                                                   │
│ ┌───────────────────────────────────────────────┐ │
│ │ ABLE                                    +1    │ │
│ │ ABOUT                                   +5    │ │
│ │ CABLE                                   +5    │ │
│ │ DECABBLE                          +15 [P]     │ │
│ │ LACED                                   +5    │ │
│ │ TABLE                                   +5    │ │
│ │ ...                                           │ │
│ └───────────────────────────────────────────────┘ │
│                                                   │
│         ┌─────────────────────────────┐           │
│         │        NEW PUZZLE           │           │
│         └─────────────────────────────┘           │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Component Hierarchy & Key Features

### 🎯 **Main Focus: Text Input Area**
```
┌─────────────────────────────────────────────┐
│                                             │
│        YOUR CURRENT WORD APPEARS HERE      │
│       ═══════════════════════════════       │
│                                             │
│     Large, readable font (2rem+)           │
│     Center-aligned for easy reading        │
│     Clear visual boundaries                │
│                                             │
└─────────────────────────────────────────────┘
```

### 🔤 **Honeycomb Layout Pattern**
```
     [A]   [B]      ← Top row (2 letters)
 [C]   [D]   [E]    ← Middle row (3 letters)
     [F]   [G]      ← Bottom row (2 letters)

Where:
● [D] = Center letter (highlighted/yellow)
○ Others = Outer letters (standard styling)
```

### 📊 **Progress Visualization**
```
SCORE: 42    ████████████░░░░░░░░    80% GENIUS    8/25 WORDS
             ↑                      ↑              ↑
         Current progress      Target marker   Words found
```

### 🎮 **Action Button Layout**
```
Desktop: [DELETE] [CLEAR] [SUBMIT]  ← Horizontal
Mobile:  [DELETE] [CLEAR]           ← Stack for small screens
         [    SUBMIT    ]           ← Full width primary action
```

### 📝 **Word List Display**
```
┌─────────────────────────────────┐
│ [Sort] [Filter] [Hints]         │ ← Controls
├─────────────────────────────────┤
│ WORD               SCORE        │ ← Headers
│ ABLE               +1           │
│ CABLE              +5           │
│ DECABBLE           +15 [PANGRAM]│ ← Special highlighting
│ ...                             │
└─────────────────────────────────┘
```

## 🎨 Visual Design Elements

### Color Scheme (Semantic)
- **Primary**: Blue (#007bff) - Actions, buttons
- **Success**: Green (#28a745) - Correct words, progress
- **Warning**: Yellow (#f9d71c) - Center letter highlight
- **Danger**: Red (#dc3545) - Errors, invalid words
- **Neutral**: Gray (#6c757d) - Secondary text, borders

### Typography Hierarchy
```
H1: SPELLING BEE        (3rem, bold)
H2: Section Headers     (1.2rem, semibold)
H3: Current Word Input  (2rem, bold, uppercase)
Body: Game Text         (1rem, regular)
Small: Helper Text      (0.9rem, muted)
```

### Responsive Breakpoints
```
Mobile:  < 768px  → Single column, stacked layout
Tablet:  768px+   → Hybrid layout, larger touch targets  
Desktop: 1024px+  → Two-column with sidebar
```

### 🔍 **Beginner-Friendly Features**

1. **Clear Instructions**
   - "Type or click letters" placeholder
   - Prominent center letter indication
   - Progress markers toward Genius level

2. **Visual Feedback**
   - Hover states on clickable elements
   - Success/error message styling
   - Progress bar with target markers

3. **Accessible Design**
   - High contrast colors
   - Large touch targets (44px minimum)
   - Keyboard navigation support
   - Clear focus indicators

4. **Professional Polish**
   - Consistent spacing and alignment
   - Subtle shadows and borders
   - Smooth transitions and animations
   - Clean typography hierarchy

This design prioritizes the text input as the main focal point while maintaining a clean, professional appearance that welcomes beginners with clear visual hierarchy and intuitive interactions.