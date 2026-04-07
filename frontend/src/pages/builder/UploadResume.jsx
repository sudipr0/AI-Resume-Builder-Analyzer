// src/pages/builder/UploadResume.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import api from '../../services/axiosConfig';

// Icons
import {
  Upload, FileText, X, Check, AlertCircle,
  FileType, FileSearch, Clock, Shield, ChevronRight
} from 'lucide-react';

const UploadResume = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createResume, loading: resumeLoading, updateCurrentResumeData } = useResume();

  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setExtractedData(null);
    setShowPreview(false);
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resumeFile', uploadedFile);

      const response = await api.post('/extract/resume', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to extract resume data');
      }

      setExtractedData(response.data.extractedData);

      // Persist upload metadata so the resume can be edited later without re-upload
      try {
        if (response.data.uploadId || response.data.fileUrl) {
          updateCurrentResumeData && updateCurrentResumeData({
            uploadId: response.data.uploadId || null,
            fileUrl: response.data.fileUrl || null,
            uploadedFile: { name: uploadedFile.name, size: uploadedFile.size, type: uploadedFile.type }
          });
        }
      } catch (e) {
        console.warn('Failed to persist upload metadata:', e);
      }

      toast.success('Resume processed successfully!');
      setShowPreview(true);
    } catch (error) {
      console.error('Upload error:', error);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error || null;
      if (serverMessage) {
        console.warn('Server response error:', error.response.data);
      }
      toast.error(serverMessage || error.message || 'Failed to process resume');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleContinueToBuilder = async () => {
    if (!extractedData) return;

    setIsProcessing(true);

    try {
      // MAP EXTRACTED DATA TO RESUME SCHEMA
      const mappedData = {
        title: `Imported: ${uploadedFile?.name?.replace(/\.[^/.]+$/, "") || 'Resume'}`,
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
        projects: Array.isArray(extractedData.projects) ? extractedData.projects.map(p => ({
          name: p.name || p || '',
          description: p.description || ''
        })) : [],
        certifications: Array.isArray(extractedData.certifications) ? extractedData.certifications.map(c => ({
          name: c.name || c || '',
          issuer: c.issuer || ''
        })) : [],
        template: 'modern',
        status: 'draft'
      };

      navigate('/builder/new', { state: { importedData: mappedData } });
    } catch (error) {
      console.error('Mapping error:', error);
      toast.error('Error preparing data for builder');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect({ target: { files: [files[0]] } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upload Your Resume
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload your existing resume and ResumeAI will extract the information for you to edit and improve.
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${uploadedFile ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/10'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />

              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>

              {uploadedFile ? (
                <div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setExtractedData(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 mx-auto"
                  >
                    <X className="w-4 h-4" />
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX, TXT (Max 5MB)
                  </p>
                </div>
              )}
            </div>

            {uploadedFile && !isUploading && !extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-lg transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Process Resume with AI
                </button>
              </motion.div>
            )}

            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 bg-blue-50 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FileSearch className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Processing your resume...</h4>
                    <p className="text-gray-600 text-sm">ResumeAI is extracting information from your file</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{uploadProgress}%</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Resume Extracted Successfully!</h3>
                      <p className="text-gray-600">ResumeAI found your information</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-between mb-4 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {showPreview ? 'Hide Preview' : 'Show Extracted Information'}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform ${showPreview ? 'rotate-90' : ''}`} />
                </button>

                {showPreview && (
                  <div className="space-y-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                      <p className="text-sm text-gray-600">Name: {extractedData.personal?.name}</p>
                      <p className="text-sm text-gray-600">Email: {extractedData.personal?.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      {extractedData.experience?.slice(0, 2).map((exp, i) => (
                        <div key={i} className="mb-2 text-sm text-gray-600">
                          {exp.title} at {exp.company}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleContinueToBuilder}
                  disabled={isProcessing}
                  className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-lg transition-all shadow-lg"
                >
                  {isProcessing ? 'Creating Resume...' : 'Continue to Editor'}
                  {!isProcessing && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UploadResume);