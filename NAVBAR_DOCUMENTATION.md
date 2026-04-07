# Enhanced Navbar & Profile System Documentation

## Overview

The Enhanced Navbar and Profile System provides a modern, responsive navigation experience with seamless access to resumes, analysis history, and user profile management.

## Components

### 1. EnhancedNavbar (`src/components/navbar/EnhancedNavbar.jsx`)

The main navigation component that replaces the standard navbar for authenticated users.

**Features:**
- Sticky positioning for easy access
- Responsive design (desktop, tablet, mobile)
- Quick access to Analyzer
- Profile avatar with dropdown
- Notification center
- Mobile-friendly hamburger menu

**Props:**
```javascript
{
  darkMode: boolean,      // Current theme (dark/light)
  setDarkMode: function   // Theme toggle callback
}
```

**Usage:**
```jsx
import EnhancedNavbar from './components/navbar/EnhancedNavbar';

<EnhancedNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
```

### 2. ProfileDropdown (`src/components/navbar/ProfileDropdown.jsx`)

Dropdown menu accessed from the profile avatar in the navbar.

**Features:**
- User info display
- My Profile link
- Resume History tab
- Analyzer History tab
- Settings link
- Logout button
- Smooth animations

**Props:**
```javascript
{
  isOpen: boolean,           // Dropdown visibility
  onClose: function,         // Callback to close dropdown
  user: object,              // User data { name, email }
  darkMode: boolean          // Current theme
}
```

**Functionality:**
- Two history tabs with quick links
- Displays count of resumes and analyses
- Shows recent items (first 10)
- "View All" link to full pages
- Smooth transitions between tabs

### 3. History Pages

#### ResumeHistoryPage (`src/pages/ResumeHistoryPage.jsx`)

Complete resume history management page.

**Features:**
- List of all resumes with metadata
- Search functionality
- Sort options (Recent, A-Z, Score)
- Quick stats (total, analyzed, avg score)
- Action buttons (View, Edit, Delete)
- Last updated tracking
- Responsive grid layout

**Routes:**
- `/resume-history` - Full resume history page

#### AnalyzerHistoryPage (`src/pages/AnalyzerHistoryPage.jsx`)

Complete analysis history management page.

**Features:**
- List of all analyses with results
- Search functionality
- Sort options (Recent, Highest/Lowest Score)
- Analytics stats (total, average, highest, excellent)
- ATS score display with color coding
- Keywords and suggestions counts
- Responsive layout

**Routes:**
- `/analyzer/history` - Full analyzer history page
- `/analyzer-history` - Alternative route

## Services & Hooks

### HistoryService (`src/services/historyService.js`)

Service for managing history data persistence.

**Methods:**

```javascript
// Resume History
async getResumeHistory()           // Fetch from backend/localStorage
getResumeHistoryLocal()            // Get from localStorage only
saveResumeHistory(history)         // Save to localStorage
addToResumeHistory(resume)         // Add single resume
getLastOpenedResume()              // Get most recent resume
saveLastOpenedResume(resume)       // Save last opened

// Analyzer History
async getAnalyzerHistory()         // Fetch from backend/localStorage
getAnalyzerHistoryLocal()          // Get from localStorage only
saveAnalyzerHistory(history)       // Save to localStorage
addToAnalyzerHistory(analysis)     // Add single analysis

// Cleanup
clearAllHistory()                  // Clear all history
clearResumeHistory()               // Clear resumes only
clearAnalyzerHistory()             // Clear analyses only
```

**Data Structures:**

Resume History Item:
```javascript
{
  id: string,
  title: string,
  lastEdited: ISO8601,
  createdAt: ISO8601,
  status: string,
  atsScore: number (optional)
}
```

Analyzer History Item:
```javascript
{
  id: string,
  resumeTitle: string,
  atsScore: number,
  keywords: array,
  suggestions: array,
  analyzedAt: ISO8601
}
```

### useHistoryManager Hook (`src/hooks/useHistoryManager.js`)

Custom React hook for managing history in components.

**Usage:**
```jsx
import useHistoryManager from '../hooks/useHistoryManager';

const {
  // Data
  resumeHistory,
  analyzerHistory,
  loading,
  error,

  // Resume History Methods
  loadResumeHistory,
  addResume,
  removeResume,
  clearResumeHistory,
  getRecentResumes,

  // Analyzer History Methods
  loadAnalyzerHistory,
  addAnalysis,
  removeAnalysis,
  clearAnalyzerHistory,
  getRecentAnalyses,

  // General
  loadAllHistory
} = useHistoryManager();
```

**Example:**
```jsx
function MyComponent() {
  const { resumeHistory, addResume, removeResume } = useHistoryManager();

  const handleResumeCreated = (resume) => {
    addResume(resume);
  };

  return (
    <div>
      {resumeHistory.map(resume => (
        <div key={resume.id}>
          {resume.title}
          <button onClick={() => removeResume(resume.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Integration Steps

### 1. Update Layouts

The layouts in `App.jsx` have been updated to use `EnhancedNavbar`:

```jsx
const DashboardLayout = ({ darkMode, setDarkMode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <EnhancedNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);
```

### 2. Manage Theme State

Theme state is managed in the `AppContent` function:

```jsx
function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Pass to layouts...
}
```

### 3. Update Routes

New routes added to `App.jsx`:

```jsx
<Route path="/resume-history" element={<ResumeHistoryPage />} />
<Route path="/analyzer/history" element={<AnalyzerHistoryPage />} />
```

## Design Guidelines

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Indigo (#4F46E5)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray (#6B7280)

### Typography
- Headings: Bold fonts
- Body: Regular weights
- Consistent 8px/16px spacing system

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Dark Mode
- Uses `darkMode` prop
- `dark:` Tailwind classes for dark variants
- Stored in component state (can be persisted)

## Data Flow

```
User Action (Click Navbar Button)
    ↓
EnhancedNavbar / ProfileDropdown
    ↓
useHistoryManager Hook
    ↓
HistoryService
    ↓
Backend API / localStorage
    ↓
Cache & Display
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance

- **Lazy loaded components** - Reduces initial bundle size
- **LocalStorage caching** - Faster subsequent loads
- **Memoized callbacks** - Prevents unnecessary re-renders
- **Virtual scrolling** - Performance for large lists

## Accessibility

- **ARIA labels** - Screen reader support
- **Keyboard navigation** - Tab through components
- **Color contrast** - WCAG AA compliant
- **Focus states** - Clear visual feedback

## Testing

### Component Testing
```jsx
import { render, screen } from '@testing-library/react';
import EnhancedNavbar from './EnhancedNavbar';

test('renders navbar with profile button', () => {
  render(<EnhancedNavbar darkMode={false} setDarkMode={jest.fn()} />);
  const profileButton = screen.getByRole('button', { name: /profile/i });
  expect(profileButton).toBeInTheDocument();
});
```

### Hook Testing
```jsx
import { renderHook, act } from '@testing-library/react';
import useHistoryManager from './useHistoryManager';

test('adds resume to history', () => {
  const { result } = renderHook(() => useHistoryManager());
  
  act(() => {
    result.current.addResume({ id: '1', title: 'My Resume' });
  });
  
  expect(result.current.resumeHistory).toHaveLength(1);
});
```

## Troubleshooting

### History not showing
- Check localStorage in DevTools
- Verify API endpoint is responding
- Check browser console for errors

### Dropdown not closing
- Ensure `onClose` callback is properly bound
- Check for event propagation issues
- Verify `isOpen` state is toggling

### Theme not applying
- Ensure `darkMode` state is updating
- Check Tailwind classes for typos
- Verify CSS is being compiled

## Future Enhancements

- [ ] Resume pinning/favorites
- [ ] Analysis comparison
- [ ] Export history as CSV/PDF
- [ ] Scheduled analysis
- [ ] Collaboration features
- [ ] Advanced filtering
- [ ] Analytics dashboard
- [ ] Resume templates suggestions

## File Structure

```
frontend/src/
├── components/
│   ├── navbar/
│   │   ├── EnhancedNavbar.jsx        (Main navbar)
│   │   ├── ProfileDropdown.jsx       (Profile menu)
│   │   └── index.js                  (Exports)
│   ├── modals/
│   │   └── AnalyzerModal.jsx         (Quick analyzer)
│   └── ...
├── hooks/
│   └── useHistoryManager.js          (History hook)
├── pages/
│   ├── ResumeHistoryPage.jsx         (Resume history)
│   ├── AnalyzerHistoryPage.jsx       (Analyzer history)
│   └── ...
├── services/
│   └── historyService.js             (History service)
└── App.jsx                           (Main app routes)
```

## Contributing

When adding new features to the navbar system:

1. Keep components focused and modular
2. Use Tailwind CSS for styling
3. Follow the 8px/16px spacing system
4. Add TypeScript types when possible
5. Test responsive design
6. Update this documentation

## Support

For issues or questions:
- Check browser console for errors
- Review localStorage state
- Check API responses
- File an issue with details

---

**Last Updated:** April 2026
**Version:** 1.0.0
