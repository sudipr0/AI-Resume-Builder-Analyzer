# System Architecture Diagram - Advanced Resume Builder

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI RESUME BUILDER SYSTEM                            │
│                                                                              │
│  ┌──────────────────────────┐                  ┌──────────────────────────┐ │
│  │  Dashboard (Auth Users)  │                  │   Home Page (Guests)     │ │
│  │                          │                  │                          │ │
│  │  [My Resumes]            │                  │  [Magic Build JD Input]  │ │
│  │  + New Resume ────────┐  │                  │  [Manual Build] ──────┐  │ │
│  │  (Opens Modal)        │  │                  │  (→ BuilderSelect)      │  │ │
│  │                       │  │                  │                        │  │ │
│  └───────────────────────┼──┘                  └────────────────────────┼──┘ │
│                          │                                              │    │
│  ┌───────────────────────▼─────────────────────────────────────────────▼──┐ │
│  │              NewResumeModal                                            │ │
│  │  ┌──────────────────────────────────────────────────────────────┐    │ │
│  │  │ Choose Build Mode:                                          │    │ │
│  │  │                                                              │    │ │
│  │  │  ✨ MAGIC BUILD    📝 QUICK BUILD    ⚡ PRO BUILD   📄 BLANK  │    │ │
│  │  │                                                              │    │ │
│  │  │  [Detailed Configuration Panel when mode selected]         │    │ │
│  │  │  • Magic: JD textarea (required)                           │    │ │
│  │  │  • Pro: File upload (required)                             │    │ │
│  │  │  • Quick/Blank: Optional JD input                          │    │ │
│  │  │                                                              │    │ │
│  │  │  [Start Building Button]                                    │    │ │
│  │  └──────────────────────────┬───────────────────────────────────┘    │ │
│  └─────────────────────────────┼──────────────────────────────────────────┘ │
│                                │                                            │
│  ┌─────────────────────────────▼──────────────────────────────────────────┐ │
│  │  Navigation to /builder with state:                                   │ │
│  │  {                                                                     │ │
│  │    mode: 'magic' | 'quick' | 'pro' | 'blank',                        │ │
│  │    jobDescription: string | null,                                    │ │
│  │    uploadedFile: File | null                                         │ │
│  │  }                                                                     │ │
│  └─────────────────────────────┬──────────────────────────────────────────┘ │
│                                │                                            │
│  ┌─────────────────────────────▼──────────────────────────────────────────┐ │
│  │                     Builder Page                                       │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Resume Sections Sidebar          │   Real-time Preview         │ │ │
│  │  │                                    │                            │ │ │
│  │  │ [Personal Info] ←─ Active        │   [Professional Resume]    │ │ │
│  │  │ [Summary]                        │   Display in Current       │ │ │
│  │  │ [Experience]                     │   Template                 │ │ │
│  │  │ [Skills]                         │   with Selected Style      │ │ │
│  │  │ [Education]                      │   ✨ AI Suggestions       │ │ │
│  │  │ [Projects]                       │   📊 ATS Score Tracker   │ │ │
│  │  │ [Certifications]                 │                            │ │ │
│  │  │ [Languages]                      │                            │ │ │
│  │  │                                    │                            │ │ │
│  │  │ [← Back] [Save] [Export] [AI Help]                           │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  ╔═ BuildModeGuide ═════════════════════════════════════╗          │ │
│  │  ║                                                      ║          │ │
│  │  ║ ✨ Magic Build Mode                    [X]         ║          │ │
│  │  ║ AI-powered resume building in 60 sec                ║          │ │
│  │  ║                                                      ║          │ │
│  │  ║ Features:                                            ║          │ │
│  │  ║ ✓ Job Description Provided                          ║          │ │
│  │  ║ ✓ AI Suggestions Enabled                            ║          │ │
│  │  ║ ✓ Real-time ATS Scoring                             ║          │ │
│  │  ║ ✓ Time: ~5-10 min                                   ║          │ │
│  │  ║                                                      ║          │ │
│  │  ║ Tips:                                                ║          │ │
│  │  ║ • AI analyzing your job description                 ║          │ │
│  │  ║ • Complete each section                             ║          │ │
│  │  ║ • Review & customize AI suggestions                 ║          │ │
│  │  ║ • Your ATS score updates in real-time               ║          │ │
│  │  ║                                                      ║          │ │
│  │  ║ ℹ️ You can change sections or customize              ║          │ │
│  │  ║ everything. Click the help icon to show this again.  ║          │ │
│  │  ║                                                      ║          │ │
│  │  ╚══════════════════════════════════════════════════════╝          │ │
│  │  (Fixed bottom-right, dismissible, mode-specific)                  │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

```
Start Point (User clicks "New Resume")
        │
        ▼
┌───────────────────────┐
│ NewResumeModal.jsx    │ ◄── Controlled by isNewResumeModalOpen state
│ ┌─────────────────┐   │
│ │ Mode Selection  │   │ ◄─── Shows 4 options in grid
│ ├─────────────────┤   │
│ │ • Magic Build   │   │ ─┐
│ │ • Quick Build   │   │  │
│ │ • Pro Build     │   │  ├─ User selects mode
│ │ • Blank Template│   │  │
│ └─────────────────┘   │ ◄─
│ ┌─────────────────┐   │
│ │ Configuration   │   │ ◄─── Shows detailed view for selected mode
│ │ Panel           │   │
│ └─────────────────┘   │
└───────────────────────┘
        │
        │ onSelectMode(mode, data)
        ▼
┌───────────────────────────────────────┐
│ handleNewResumeModeSelection()         │ ◄── Resumes.jsx callback
│                                        │
│ Validates data for mode requirements   │
│ Navigates to /builder with state:     │
│ {mode, jobDescription, uploadedFile} │
└────────────┬────────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ Builder.jsx                            │ ◄── /builder route
│                                        │
│ Initialization Effect:                 │
│ • Captures location.state              │
│ • Sets buildMode state                 │
│ • Sets jobDescription state            │
│ • Sets showModeGuide = true            │
└────────────┬────────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ BuildModeGuide.jsx                     │ ◄── Fixed floating card
│                                        │
│ Displays:                              │
│ • Mode-specific tips                   │
│ • Feature matrix                       │
│ • Time estimates                       │
│ • Best practices                       │
│                                        │
│ Can be dismissed and re-shown           │
└────────────┬────────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ Resume Building Interface              │ ◄── Main builder view
│                                        │
│ • Sidebar with sections                │
│ • Active section editor                │
│ • Real-time preview                    │
│ • AI suggestions (mode-specific)       │
│ • ATS score tracking                   │
│ • Export/Save buttons                  │
└───────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Dashboard State                             │
├────────────────┬────────────────────────────────────────────────────┤
│ isNewResumeModal│ false                                              │
│ OpenState       │ ↓ User clicks "New Resume"                        │
│                 │ true ─► NewResumeModal renders                    │
└────────────────┴────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     NewResumeModal State                            │
├──────────────┬─────────────────────────────────────────────────────┤
│ selectedMode │ null                                                 │
│              │ ↓ User clicks mode card                              │
│              │ 'magic'|'quick'|'pro'|'blank'                       │
│              │ ↓ Shows detailed view                                │
├──────────────┼─────────────────────────────────────────────────────┤
│ jobDesc      │ ''                                                   │
│              │ ↓ User types or pastes                               │
│              │ 'Senior Developer...'                               │
├──────────────┼─────────────────────────────────────────────────────┤
│ uploadedFile │ null                                                 │
│              │ ↓ User uploads file                                  │
│              │ File object (PDF/DOC)                               │
├──────────────┼─────────────────────────────────────────────────────┤
│ isSubmitting │ false                                                │
│              │ ↓ User clicks "Start Building"                       │
│              │ true (loading state)                                │
│              │ ↓ Navigate to builder                                │
│              │ false (completion)                                  │
└──────────────┴─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     Navigate to /builder                            │
├─────────────────────────────────────────────────────────────────────┤
│ location.state = {                                                   │
│   mode: 'magic' | 'quick' | 'pro' | 'blank',                       │
│   jobDescription: string | null,                                   │
│   uploadedFile: File | null                                        │
│ }                                                                    │
└────────────┬────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Builder.jsx State                               │
├──────────────┬─────────────────────────────────────────────────────┤
│ buildMode    │ ''                                                   │
│              │ ↓ useEffect captures from location.state             │
│              │ 'magic'|'quick'|'pro'|'blank'                       │
├──────────────┼─────────────────────────────────────────────────────┤
│ jobDescription│ ''                                                  │
│              │ ↓ useEffect captures from location.state             │
│              │ Job description text (if provided)                  │
├──────────────┼─────────────────────────────────────────────────────┤
│ showModeGuide│ false                                                │
│              │ ↓ useEffect sets based on newResume                 │
│              │ true (shows guide)                                  │
│              │ ↓ User dismisses guide                               │
│              │ false (can reopen)                                  │
└──────────────┴─────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Input Collection
        │
        ├─ [Dashboard Path]          ─► [Home Path for Guests]
        │      │                             │
        │      ▼                             ▼
        │ Modal Opens                BuilderSelect Page
        │      │                             │
        │      ├─ Mode: magic          Mode: magic/quick/pro
        │      ├─ Mode: quick          JD input (optional)
        │      ├─ Mode: pro            File upload (if pro)
        │      └─ Mode: blank
        │      │
        │      ▼
        │ Data Validation
        │      │
        │ ┌────┴──────┬──────────┬──────────┐
        │ │            │          │          │
        │ ▼            ▼          ▼          ▼
        │ Magic     Quick       Pro       Blank
        │ JD✓       JD?        File✓      -
        │ │         │          │          │
        └─┴─────────┴──────────┴──────────┘
                     │
                     ▼
          Builder Navigation State
          {mode, jobDescription, uploadedFile}
                     │
                     ▼
          Builder Initialization
          ├─ Capture state
          ├─ Set buildMode
          ├─ Set jobDescription
          ├─ Show guide
          └─ Render editor
                     │
                     ▼
          User Builds Resume
          {Edit sections, AI suggestions, ATS scoring}
                     │
                     ▼
          Save/Export Resume
```

---

## File Structure

```
frontend/src/
│
├── components/
│   ├── NewResumeModal.jsx ◄────────────── [NEW] Modal for mode selection
│   │   └── 4 mode options (magic, quick, pro, blank)
│   │   └── Detailed configuration per mode
│   │   └── File upload & validation
│   │   └── Form submission handling
│   │
│   ├── builder/
│   │   └── BuildModeGuide.jsx ◄──────── [NEW] Floating help card
│   │       └── Mode-specific tips
│   │       └── Feature matrix
│   │       └── Dismissible UI
│   │
│   └── [Other builder components...]
│
├── pages/
│   ├── Home.jsx ◄───────────────────── [UPDATED] Manual Build button
│   │   └── Navigate to /builder/select
│   │
│   ├── BuilderSelect.jsx ◄──────────── [EXISTING] Public mode selection
│   │   └── Guest user interface
│   │
│   ├── dashboard/
│   │   └── Resumes.jsx ◄────────────── [UPDATED] New Resume modal
│   │       └── isNewResumeModalOpen state
│   │       └── handleNewResumeModeSelection callback
│   │       └── NewResumeModal component
│   │
│   └── builder/
│       └── Builder.jsx ◄──────────────── [UPDATED] Mode-aware builder
│           └── buildMode state
│           └── showModeGuide state
│           └── useEffect for location.state
│           └── BuildModeGuide component
│
└── [Other app files...]
```

---

## Mode-Specific Behavior

```
┌──────────────────────────────────────────────────────────────────┐
│                       MAGIC BUILD MODE                           │
├──────────────────────────────────────────────────────────────────┤
│ Input Requirements:                                              │
│  • Job Description (REQUIRED)                                   │
│                                                                  │
│ Modal Behavior:                                                 │
│  • Shows JD textarea on detailed view                           │
│  • Validates non-empty before start                             │
│  • Error if JD is empty                                         │
│                                                                  │
│ Builder Behavior:                                               │
│  • buildMode = 'magic'                                          │
│  • jobDescription = [captured text]                             │
│  • showModeGuide = true                                         │
│  • Guide shows magic-specific tips                              │
│                                                                  │
│ Guide Features:                                                 │
│  ✓ AI analyzing job description                                │
│  ✓ Instant resume generation                                   │
│  ✓ 92% avg ATS score                                           │
│  ✓ One-click PDF export                                        │
└────────────────────────────────────────────┬────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       QUICK BUILD MODE                           │
├──────────────────────────────────────────────────────────────────┤
│ Input Requirements:                                              │
│  • None (all OPTIONAL)                                          │
│  • Job Description (optional for better suggestions)            │
│                                                                  │
│ Modal Behavior:                                                 │
│  • Shows optional JD textarea                                   │
│  • Can proceed without any input                                │
│  • No validation errors                                         │
│                                                                  │
│ Builder Behavior:                                               │
│  • buildMode = 'quick'                                          │
│  • jobDescription = [captured text or null]                     │
│  • showModeGuide = true                                         │
│  • Guide shows quick-specific tips                              │
│                                                                  │
│ Guide Features:                                                 │
│  ✓ Guided wizard flow                                          │
│  ✓ AI suggestions per section                                  │
│  ✓ Real-time ATS scoring                                       │
│  ✓ Full customization control                                  │
└────────────────────────────────────────────┬────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        PRO BUILD MODE                            │
├──────────────────────────────────────────────────────────────────┤
│ Input Requirements:                                              │
│  • Resume File (REQUIRED)                                       │
│  • .pdf, .doc, .docx (max 5MB)                                 │
│                                                                  │
│ Modal Behavior:                                                 │
│  • Shows file upload area                                       │
│  • Drag & drop support                                          │
│  • File size validation                                         │
│  • Type validation                                              │
│  • Error if file not uploaded                                   │
│                                                                  │
│ Builder Behavior:                                               │
│  • buildMode = 'pro'                                            │
│  • uploadedFile = [File object]                                 │
│  • jobDescription = null (unless added)                         │
│  • showModeGuide = true                                         │
│  • Guide shows pro-specific tips                                │
│                                                                  │
│ Guide Features:                                                 │
│  ✓ AI file extraction                                          │
│  ✓ Auto-enhancement per section                                │
│  ✓ Preserve original content                                   │
│  ✓ Section improvement suggestions                             │
└────────────────────────────────────────────┬────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      BLANK TEMPLATE MODE                         │
├──────────────────────────────────────────────────────────────────┤
│ Input Requirements:                                              │
│  • None (start with blank)                                      │
│                                                                  │
│ Modal Behavior:                                                 │
│  • No input fields shown                                        │
│  • Can proceed directly                                         │
│  • Instant start                                                │
│                                                                  │
│ Builder Behavior:                                               │
│  • buildMode = 'blank'                                          │
│  • jobDescription = null                                        │
│  • uploaded file = null                                         │
│  • showModeGuide = true                                         │
│  • Guide shows blank-specific tips                              │
│                                                                  │
│ Guide Features:                                                 │
│  ✓ Blank starting point                                        │
│  ✓ Add sections as needed                                      │
│  ✓ No AI assistance                                            │
│  ✓ Full manual control                                         │
└──────────────────────────────────────────┬────────────────────────┘
```

---

## Error Handling Flow

```
User Action
        │
        ├─ [Validation Check]
        │      │
        │      ├─ Magic: JD empty?
        │      ├─ Pro: File not uploaded?
        │      ├─ Pro: File too large (>5MB)?
        │      ├─ Pro: Invalid file type?
        │      └─ Quick/Blank: None (always valid)
        │
        │      If error:
        │      ├─ Toast notification (error message)
        │      ├─ User must fix and retry
        │      └─ Stay in modal
        │
        │      If valid:
        │      ├─ Set isSubmitting = true
        │      ├─ Navigate to builder
        │      ├─ onSelectMode callback
        │      ├─ Close modal on success
        │      └─ catch error → Toast on failure
        │
        └─ [Complete]
```

---

This comprehensive architecture ensures a smooth, guided user experience across all 4 resume building modes while maintaining flexibility for future enhancements.
