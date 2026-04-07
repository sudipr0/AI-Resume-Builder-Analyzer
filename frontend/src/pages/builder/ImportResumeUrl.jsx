// src/pages/builder/ImportResumeUrl.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Globe, Link2, Sparkles, ChevronRight, X, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/axiosConfig';

const ImportResumeUrl = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isValidUrl = (value) => {
        try {
            return Boolean(new URL(value));
        } catch {
            return false;
        }
    };

    const mapExtractedData = (extractedData) => ({
        title: `Imported: ${extractedData.personal?.name || 'Resume'}`,
        personalInfo: {
            firstName: extractedData.personal?.name?.split(' ')[0] || user?.name?.split(' ')[0] || '',
            lastName: extractedData.personal?.name?.split(' ').slice(1).join(' ') || user?.name?.split(' ').slice(1).join(' ') || '',
            email: extractedData.personal?.email || user?.email || '',
            phone: extractedData.personal?.phone || '',
            location: extractedData.personal?.location || '',
            linkedin: extractedData.personal?.linkedin || url,
            portfolio: extractedData.personal?.portfolio || ''
        },
        summary: extractedData.summary || '',
        experience: Array.isArray(extractedData.experience) ? extractedData.experience.map((exp) => ({
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.start_date || exp.startDate || '',
            endDate: exp.end_date || exp.endDate || '',
            current: !exp.end_date && !exp.endDate,
            bullets: Array.isArray(exp.bullets) ? exp.bullets : []
        })) : [],
        education: Array.isArray(extractedData.education) ? extractedData.education.map((edu) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            endDate: edu.year || edu.endDate || '',
            gpa: edu.gpa || ''
        })) : [],
        skills: extractedData.skills ? Object.entries(extractedData.skills).map(([category, items]) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            items: Array.isArray(items) ? items.map((name) => ({ name, level: 3 })) : []
        })) : [],
        projects: Array.isArray(extractedData.projects) ? extractedData.projects.map((project) => ({
            name: project.name || '',
            description: project.description || ''
        })) : [],
        certifications: Array.isArray(extractedData.certifications) ? extractedData.certifications.map((cert) => ({
            name: cert.name || '',
            issuer: cert.issuer || ''
        })) : [],
        languages: Array.isArray(extractedData.languages) ? extractedData.languages.map((lang) => ({
            name: lang.name || lang || '',
            level: lang.level || 'Intermediate'
        })) : [],
        references: Array.isArray(extractedData.references) ? extractedData.references : [],
        template: 'modern',
        status: 'draft'
    });

    const handleImportUrl = async () => {
        // TEMPORARY: Allow access in development mode for testing
        const isDevelopment = import.meta.env.MODE === 'development';
        if (!isAuthenticated) {
            if (!isDevelopment) {
                toast.error('Please login to import your resume');
                navigate('/login');
                return;
            }
        }

        if (!url.trim() || !isValidUrl(url.trim())) {
            toast.error('Please enter a valid URL');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Fetching content from URL...');

        try {
            const extractTextResponse = await api.get('/analyze/extract-url', {
                params: { url: url.trim() }
            });

            const rawText = extractTextResponse.data?.content || extractTextResponse.data?.text || '';

            if (!rawText) {
                throw new Error('Unable to extract resume content from the provided URL.');
            }

            const parseResponse = await api.post('/ai/extract', { rawText });
            const parsed = parseResponse.data?.data;

            if (!parsed) {
                throw new Error('AI extraction failed to parse the resume content.');
            }

            const importedData = mapExtractedData(parsed);
            toast.success('URL imported successfully!', { id: toastId });
            navigate('/builder/new', { state: { importedData } });
        } catch (error) {
            console.error('Import URL error:', error);
            toast.error(error?.message || 'Failed to import resume from URL', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-4">
                            <Globe className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Import from LinkedIn or Resume URL</h1>
                        <p className="text-gray-600">Provide a public URL and ResumeAI will parse the page, extract your profile, and pre-fill the builder.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 p-8 border border-gray-100"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                                <div className="flex items-center gap-3 text-gray-700 mb-3">
                                    <Link2 className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold">Paste a URL or LinkedIn profile</span>
                                </div>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://linkedin.com/in/yourname or https://example.com/resume"
                                    className="w-full rounded-3xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                <button
                                    onClick={handleImportUrl}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl disabled:opacity-50 transition"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Import Resume
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => navigate('/builder')}
                                    className="w-full sm:w-auto px-8 py-4 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-100 transition"
                                    disabled={isLoading}
                                >
                                    Back to Builder Options
                                </button>
                            </div>

                            <div className="rounded-3xl border border-gray-200 p-5 bg-slate-50">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>We will use the page content to extract your resume sections and pre-fill the builder.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ImportResumeUrl;
