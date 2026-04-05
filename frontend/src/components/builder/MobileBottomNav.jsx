// src/components/builder/MobileBottomNav.jsx
import React from 'react';
import { Edit2, Eye, Sparkles, Save, Download } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const MobileBottomNav = ({ activeView, onViewChange, onAI, onSave, onExport, saveStatus }) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-50">
            <div className="flex items-center justify-around p-2">
                <button
                    onClick={() => onViewChange('editor')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                >
                    <Edit2 className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-bold">Edit</span>
                </button>
                <button
                    onClick={() => onViewChange('preview')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                >
                    <Eye className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-bold">Preview</span>
                </button>
                <button
                    onClick={onAI}
                    className="flex flex-col items-center p-2 rounded-xl text-purple-600 active:scale-95 transition-all"
                >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">AI Magic</span>
                </button>
                <button
                    onClick={onSave}
                    disabled={saveStatus === 'saving'}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${saveStatus === 'saving' ? 'text-amber-600' : 'text-green-600'}`}
                >
                    {saveStatus === 'saving' ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    <span className="text-[10px] mt-1 font-bold">Save</span>
                </button>
                <button
                    onClick={onExport}
                    className="flex flex-col items-center p-2 rounded-xl text-blue-600 transition-all active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-bold">Export</span>
                </button>
            </div>
        </div>
    );
};

export default MobileBottomNav;
