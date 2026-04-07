// src/components/ResumeCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Edit3,
    Trash2,
    Zap,
    Download,
    Eye,
    Calendar,
    MoreVertical,
    Star,
    Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResumeCard = ({ resume, darkMode, view = 'grid' }) => {
    const navigate = useNavigate();
    const isCompleted = resume.status === 'completed';
    const score = resume.analysis?.atsScore || 0;
    const resumeId = resume?._id || resume?.id;

    const handleEdit = (e) => {
        if (e?.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('🔍 ResumeCard - edit click', {
            resumeId,
            title: resume?.title,
            navigationPath: `/builder/edit/${resumeId}`
        });

        if (!resumeId) {
            console.error('❌ ResumeCard: missing resumeId', resume);
            toast.error('Invalid resume ID');
            return;
        }

        navigate(`/builder/edit/${resumeId}`);
    };

    const handleView = (e) => {
        if (e?.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('🔍 ResumeCard - preview click', {
            resumeId,
            title: resume?.title,
            navigationPath: `/builder/preview/${resumeId}`
        });

        if (!resumeId) {
            console.error('❌ ResumeCard: missing resumeId', resume);
            toast.error('Invalid resume ID');
            return;
        }

        navigate(`/builder/preview/${resumeId}`);
    };

    if (view === 'list') {
        return (
            <motion.div
                whileHover={{ x: 5 }}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
                    }`}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                        <Edit3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-bold truncate max-w-xs">{resume.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(resume.updatedAt).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full capitalize ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                {resume.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">ATS Score</p>
                        <span className={`font-bold ${score >= 80 ? 'text-green-500' : 'text-amber-500'}`}>
                            {score}%
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <button onClick={handleView} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                            <Eye className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 ${darkMode
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10'
                }`}
        >
            {/* Card Header/Thumbnail Preview */}
            <div className={`relative aspect-[3/4] overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-green-500 text-white' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                            }`}>
                            {resume.status}
                        </span>
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
                            <Star className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                        <button
                            onClick={handleEdit}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
                        >
                            <Edit3 className="w-4 h-4" />
                            Continue Building
                        </button>
                        <button
                            onClick={handleView}
                            className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                    </div>
                </div>

                {/* ATS Score Badge */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className={`p-2 rounded-2xl backdrop-blur-xl border flex items-center gap-2 ${darkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-black/5'
                        }`}>
                        <div className={`p-1.5 rounded-lg ${score >= 80 ? 'bg-green-500' : 'bg-amber-500'}`}>
                            <Zap className="w-3 h-3 text-white fill-current" />
                        </div>
                        <span className="text-xs font-bold">{score}%</span>
                    </div>
                </div>

                {/* Mock Template Grid */}
                <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center">
                    <div className="w-full p-4 space-y-2 opacity-20">
                        <div className="h-4 w-3/4 bg-current rounded" />
                        <div className="h-2 w-full bg-current rounded" />
                        <div className="h-2 w-full bg-current rounded" />
                        <div className="h-2 w-1/2 bg-current rounded" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg truncate flex-1 group-hover:text-blue-500 transition-colors">
                        {resume.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ResumeCard);
