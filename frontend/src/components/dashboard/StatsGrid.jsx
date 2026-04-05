// src/components/dashboard/StatsGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    CheckCircle, 
    Zap, 
    Eye, 
    Download, 
    Activity 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className={`p-6 rounded-2xl border transition-all ${
            darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100 shadow-sm'
        }`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {title}
            </p>
            <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </h3>
        </div>
    </motion.div>
);

const StatsGrid = ({ stats, darkMode }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <StatCard 
                title="Total Resumes" 
                value={stats.totalResumes} 
                icon={FileText} 
                color="bg-blue-100 text-blue-600" 
                darkMode={darkMode}
            />
            <StatCard 
                title="Completed" 
                value={stats.completedResumes} 
                icon={CheckCircle} 
                color="bg-green-100 text-green-600" 
                darkMode={darkMode}
            />
            <StatCard 
                title="Avg ATS Score" 
                value={`${stats.averageAtsScore}%`} 
                icon={Zap} 
                color="bg-amber-100 text-amber-600" 
                darkMode={darkMode}
            />
            <StatCard 
                title="Total Views" 
                value={stats.totalViews} 
                icon={Eye} 
                color="bg-purple-100 text-purple-600" 
                darkMode={darkMode}
            />
            <StatCard 
                title="Downloads" 
                value={stats.totalDownloads} 
                icon={Download} 
                color="bg-indigo-100 text-indigo-600" 
                darkMode={darkMode}
            />
            <StatCard 
                title="Completion" 
                value={`${stats.completionRate}%`} 
                icon={Activity} 
                color="bg-rose-100 text-rose-600" 
                darkMode={darkMode}
            />
        </div>
    );
};

export default StatsGrid;
