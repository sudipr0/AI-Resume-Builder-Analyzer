# Quick Reference - Advanced Resume Building System

## User Journey Map

### Dashboard Path (Authenticated Users)
```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard (Resumes)                       │
│                                                               │
│    [+ New Resume Button]  [Refresh]  [Theme Toggle]         │
│                                                               │
│    ┌─ Resume 1 ──┐  ┌─ Resume 2 ──┐  ┌─ Resume 3 ──┐       │
│    │ Edit Preview │  │ Edit Preview │  │ Edit Preview │       │
│    └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [NEW] Click + New Resume
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         NewResumeModal - Choose Build Mode                  │
│                                                               │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ ✨ MAGIC │ 📝 QUICK │ ⚡ PRO   │ 📄 BLANK │              │
│  │ BUILD    │ BUILD    │ BUILD    │ TEMPLATE │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
│                   Click to expand→                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
        [Detailed Mode View] ← Select specific mode
                            ↓
        [Mode Configuration] ← Fill required fields
         • Magic: Paste JD
         • Pro: Upload file
         • Quick/Blank: Optional fields
                            ↓
              [Start Building Button]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│             Builder Page with Mode Guide                    │
│  ┌──────────────────────┐               ┌──────────────────┐│
│  │   Resume Sections    │               │ Mode Guide Card  ││
│  │ [Personal Info]      │               │ (Bottom Right)   ││
│  │ [Summary]            │               │ • Tips           ││
│  │ [Experience]         │               │ • Features       ││
│  │ [Skills]             │               │ • Best practices ││
│  │ [Education]          │               │ [Close]          ││
│  │ [Projects]           │               └──────────────────┘│
│  └──────────────────────┘               ↓ Real-time Preview │
│                                                               │
│  [← Back] [Resume Title] [AI Assistant] [Export] [Save]     │
└─────────────────────────────────────────────────────────────┘
```

### Home Page Path (Guest Users)
```
┌─────────────────────────────────────────────────────────────┐
│                  Home Page (Landing)                        │
│                                                               │
│  "AI Builds 92% ATS Resume in 60 Seconds"                  │
│  [Login] [Start Free]                                       │
│                                                               │
│  ┌─────────────────────────────────────────────┐            │
│  │ 🔮 Paste Job Description                    │            │
│  │ [Textarea]                                  │            │
│  │ [✨ MAGIC BUILD] [Manual Build →]          │            │
│  └─────────────────────────────────────────────┘            │
│                                                               │
│  Features | Stats | CTA [Get Started] [Demo]              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [Manual Build Button]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         BuilderSelect Page - Public Mode Selection         │
│                                                               │
│  [← Back to Home]                                           │
│                                                               │
│  Choose Your Build Mode                                     │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ ✨ Magic Build       │  │ 📝 Quick Build       │        │
│  │ (60 seconds)         │  │ (2-3 minutes)        │        │
│  │ [Start]              │  │ [Start]              │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ ⚡ Pro Build         │  │ 📄 Blank Template    │        │
│  │ (1-2 minutes)        │  │ (5-10 minutes)       │        │
│  │ [Start]              │  │ [Start]              │        │
│  └──────────────────────┘  └──────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Same Builder Experience
```

## Mode Selection Decision Tree

```
Want quick AI-generated resume?
├─ YES → ✨ MAGIC BUILD
│         "Paste JD → Get full resume in 60s"
│         • Fastest way
│         • Highest ATS score
│         • Requires job description
│
└─ NO → Have existing resume to upgrade?
        ├─ YES → ⚡ PRO BUILD
        │         "Upload resume → AI enhances it"
        │         • Keep your content
        │         • AI improves each section
        │         • Requires file upload
        │
        └─ NO → Want guided help but full control?
                ├─ YES → 📝 QUICK BUILD
                │         "Step-by-step with AI tips"
                │         • Best balance
                │         • Optional job description
                │         • Full customization
                │
                └─ NO → 📄 BLANK TEMPLATE
                        "Build from scratch manually"
                        • Maximum flexibility
                        • No AI assistance
                        • Takes 5-10 minutes
```

## Component API Reference

### NewResumeModal
```jsx
<NewResumeModal
  isOpen={boolean}
  onClose={() => {}}
  onSelectMode={async (modeId, data) => {}}
/>

// Data structure passed to onSelectMode:
{
  modeId: 'magic' | 'quick' | 'pro' | 'blank',
  jobDescription: string | null,
  uploadedFile: File | null
}
```

### BuildModeGuide
```jsx
<BuildModeGuide
  mode={'magic' | 'quick' | 'pro' | 'blank'}
  isVisible={boolean}
  onClose={() => {}}
  jobDescription={string}
/>
```

## Navigation Routes

```
/                          → Home page with "Manual Build" button
/dashboard                 → Shows resume cards + "New Resume" button
/builder/select            → Mode selection page (public)
/builder                   → New resume builder
/builder/edit/:id          → Edit existing resume
```

## State Management

### Location State Passed to Builder
```javascript
navigate('/builder', {
  state: {
    mode: 'magic' | 'quick' | 'pro' | 'blank',
    jobDescription: string | null,
    uploadedFile: File | null
  }
})
```

### Builder Component State
```javascript
const [buildMode, setBuildMode] = useState('quick')
const [showModeGuide, setShowModeGuide] = useState(false)
const [jobDescription, setJobDescription] = useState('')
```

## Key Features by Mode

### Magic Build
- ✓ Job description parsing
- ✓ AI-powered resume generation
- ✓ 92% avg ATS score
- ✓ One-click PDF export
- ✗ Limited customization (before/after generation)

### Quick Build
- ✓ Guided 8-step wizard
- ✓ AI suggestions per section
- ✓ Real-time ATS scoring
- ✓ Full customization
- ✓ Optional job description context
- ✗ Requires more user input

### Pro Build
- ✓ Resume file upload (PDF/DOC/DOCX)
- ✓ AI information extraction
- ✓ Auto-enhancement per section
- ✓ Preserve original content
- ✗ Requires existing resume

### Blank Template
- ✓ Start completely from scratch
- ✓ No AI assistance (pure manual)
- ✓ Maximum customization
- ✓ Add/remove sections freely
- ✗ Takes longest to complete

## Tips for Users

### Choosing Your Mode
| If you... | Choose... | Reason |
|-----------|----------|--------|
| Want fastest result | Magic | AI does all the work |
| Have a job posting | Magic | JD optimizes suggestions |
| Want to update current resume | Pro | Keep your content intact |
| Want guided experience | Quick | Best balance of speed + control |
| Want complete control | Blank | No restrictions |

### Getting Best Results
- **Magic**: Paste complete job description for better matching
- **Quick**: Fill all sections for comprehensive ATS scoring
- **Pro**: Upload clear, well-formatted resume for better extraction
- **Blank**: Follow standard resume format for best appearance

## UI/UX Highlights

✓ **Smooth Animations**: Framer Motion transitions between states
✓ **Responsive Design**: Works on mobile, tablet, desktop
✓ **Dark Mode Support**: Adapts to user's theme preference
✓ **Validation**: Clear error messages for invalid inputs
✓ **Accessibility**: Keyboard navigation support
✓ **Loading States**: Visual feedback for async operations
✓ **Help System**: BuildModeGuide always available

## File Size Limits
- Document uploads: 5 MB max (PDF, DOC, DOCX)
- Reasonable for most resumes (usually < 1 MB)
- Clear error if exceeded

---

## Quick Test Checklist

- [ ] Click "New Resume" on dashboard → Modal appears
- [ ] Click each mode card → Shows detailed view
- [ ] Click back → Returns to mode selection
- [ ] Magic mode → JD input required validation
- [ ] Pro mode → File upload input
- [ ] Quick/Blank → Optional inputs
- [ ] Start building → Navigates to builder
- [ ] Mode guide → Shows in bottom right
- [ ] Mode guide → Can be dismissed
- [ ] Builder → Receives correct mode and data

---

This system provides an intuitive, guided experience for all users while maintaining maximum flexibility for power users!
