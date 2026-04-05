// src/pages/builder/PasteResume.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Clipboard, Sparkles, ChevronRight, X, Layout, FileText, Brain } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../services/axiosConfig';

const PasteResume = () => {
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleProcessText = async () => {
    if (!rawText || rawText.trim().length < 50) {
      toast.error('Please paste a substantial amount of resume text (at least 50 characters)');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('ResumeAI is analyzing your text...');

    try {
      // Direct call to AI extraction endpoint
      // We can use the same logic as upload but send raw text
      const response = await api.post('/ai/extract', { rawText });
      
      if (response.data.success) {
        const extractedData = response.data.data;
        
        // Map data to schema (reusing the logic from UploadResume)
        const mappedData = {
          title: `Pasted: ${extractedData.personal?.name || 'Resume'}`,
          personalInfo: {
            firstName: extractedData.personal?.name?.split(' ')[0] || '',
            lastName: extractedData.personal?.name?.split(' ').slice(1).join(' ') || '',
            email: extractedData.personal?.email || '',
            phone: extractedData.personal?.phone || '',
            location: extractedData.personal?.location || '',
            linkedin: extractedData.personal?.linkedin || '',
            portfolio: extractedData.personal?.portfolio || ''
          },
          summary: extractedData.summary || '',
          experience: Array.isArray(extractedData.experience) ? extractedData.experience.map(exp => ({
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.start_date || '',
            endDate: exp.end_date || '',
            current: !exp.end_date || exp.end_date.toLowerCase().includes('present'),
            bullets: Array.isArray(exp.bullets) ? exp.bullets : []
          })) : [],
          education: Array.isArray(extractedData.education) ? extractedData.education.map(edu => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            endDate: edu.year || '',
            gpa: edu.gpa || ''
          })) : [],
          skills: extractedData.skills ? Object.entries(extractedData.skills).map(([category, items]) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            items: Array.isArray(items) ? items.map(name => ({ name, level: 3 })) : []
          })) : [],
          template: 'modern',
          status: 'draft'
        };

        toast.success('Extracted successfully!', { id: toastId });
        navigate('/builder/new', { state: { importedData: mappedData } });
      } else {
        throw new Error(response.data.message || 'Failed to extract data');
      }
    } catch (error) {
      console.error('Paste extraction error:', error);
      toast.error('AI failed to parse text. Please try again or build from scratch.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
              <Clipboard className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Paste Your Resume</h1>
            <p className="text-gray-600">Paste your raw resume text or LinkedIn profile content below. ResumeAI will structure it for you.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 border border-gray-100"
          >
            <div className="relative">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-96 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-700 font-mono text-sm leading-relaxed"
                disabled={isProcessing}
              />
              {rawText && (
                <button 
                  onClick={() => setRawText('')}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>ResumeAI will automatically detect sections and skills</span>
              </div>
              <button
                onClick={handleProcessText}
                disabled={isProcessing || !rawText.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Text...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Import with AI
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Layout />, title: "Structured Sections", text: "AI maps your text to work, education, and skills." },
              { icon: <FileText />, title: "Ready to Edit", text: "Go straight to the builder with your data pre-filled." },
              { icon: <Sparkles />, title: "AI Optimized", text: "Our models ensure your data is ATS-friendly." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="text-blue-500 mb-3">{feature.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasteResume;
