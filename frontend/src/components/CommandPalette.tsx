import React, { useState, useEffect } from 'react';

/**
 * Global Command Palette (Ctrl+K) for power users to navigate and trigger actions quickly.
 */
export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { name: 'Generate Summary with AI', icon: '✨' },
    { name: 'Export to PDF', icon: '📄' },
    { name: 'Change Template', icon: '🎨' },
    { name: 'Go to Dashboard', icon: '🏠' },
    { name: 'Upgrade to Pro', icon: '⭐' }
  ];

  const filtered = actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 outline-none text-gray-700 bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length > 0 ? (
            <ul className="py-2">
              {filtered.map((action, idx) => (
                <li key={idx} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700 group transition-colors">
                  <span className="mr-3">{action.icon}</span>
                  <span className="group-hover:text-blue-700 font-medium text-sm">{action.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">No commands found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
