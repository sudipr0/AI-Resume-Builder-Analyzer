import Resume from '../models/Resume.js';
import mongoose from 'mongoose';

class ResumeService {

    async createResume(resumeData, userId) {
        try {
            console.log('📝 [SERVICE] Creating resume for user:', userId);
            console.log('📦 [SERVICE] Resume data received:', JSON.stringify(resumeData, null, 2));

            // ✅ CRITICAL: Ensure personalInfo has required fields
            if (!resumeData.personalInfo) {
                resumeData.personalInfo = {
                    firstName: '',
                    lastName: '',
                    email: ''
                };
            }

            // Ensure required personalInfo fields exist
            if (!resumeData.personalInfo.firstName) {
                resumeData.personalInfo.firstName = 'User';
            }
            if (!resumeData.personalInfo.lastName) {
                resumeData.personalInfo.lastName = 'Name';
            }
            if (!resumeData.personalInfo.email) {
                // Try to get from user or use placeholder
                resumeData.personalInfo.email = 'user@example.com';
            }

            // ✅ Ensure title exists
            if (!resumeData.title || resumeData.title.trim() === '') {
                resumeData.title = `New Resume ${new Date().toLocaleDateString()}`;
            }

            // ✅ Ensure templateSettings exists
            if (!resumeData.templateSettings) {
                resumeData.templateSettings = {
                    templateName: resumeData.template || 'modern',
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#6b7280',
                        accent: '#10b981',
                        background: '#ffffff',
                        text: '#000000',
                        header: '#1e40af'
                    },
                    font: 'Roboto',
                    fontSize: 'medium',
                    spacing: 'normal',
                    showPhoto: false,
                    layout: 'single-column'
                };
            }

            // ✅ Ensure arrays exist
            resumeData.experience = resumeData.experience || [];
            resumeData.education = resumeData.education || [];
            resumeData.skills = resumeData.skills || [];
            resumeData.projects = resumeData.projects || [];
            resumeData.certifications = resumeData.certifications || [];
            resumeData.languages = resumeData.languages || [];
            resumeData.tags = resumeData.tags || [];

            // ✅ Create resume with all required fields
            const resume = new Resume({
                ...resumeData,
                user: userId,
                status: resumeData.status || 'draft',
                visibility: resumeData.visibility || 'private',
                progress: 0,
                views: 0,
                downloads: 0,
                version: 1,
                isPrimary: false,
                isStarred: false,
                isPinned: false
            });

            // ✅ Validate before saving to get detailed errors
            const validationError = resume.validateSync();
            if (validationError) {
                console.error('❌ [SERVICE] Validation failed:', {
                    errors: validationError.errors,
                    message: validationError.message
                });

                // Format validation errors for better debugging
                const formattedErrors = {};
                Object.keys(validationError.errors || {}).forEach(key => {
                    formattedErrors[key] = validationError.errors[key].message;
                });

                return {
                    success: false,
                    error: 'Resume validation failed',
                    validationErrors: formattedErrors,
                    message: validationError.message
                };
            }

            const savedResume = await resume.save();
            console.log('✅ [SERVICE] Resume saved successfully with ID:', savedResume._id);

            return {
                success: true,
                data: savedResume
            };

        } catch (error) {
            console.error('❌ [SERVICE] Error creating resume:', {
                name: error.name,
                message: error.message,
                code: error.code,
                errors: error.errors,
                stack: error.stack
            });

            // Handle specific MongoDB errors
            if (error.name === 'ValidationError') {
                const formattedErrors = {};
                Object.keys(error.errors || {}).forEach(key => {
                    formattedErrors[key] = error.errors[key].message;
                });

                return {
                    success: false,
                    error: 'Resume validation failed',
                    validationErrors: formattedErrors,
                    message: error.message
                };
            }

            if (error.code === 11000) {
                return {
                    success: false,
                    error: 'Duplicate resume entry',
                    message: 'A resume with this slug already exists'
                };
            }

            return {
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            };
        }
    }

    async getUserResumes(userId) {
        try {
            console.log('📥 [SERVICE] Getting resumes for user:', userId);

            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required'
                };
            }

            const resumes = await Resume.find({ user: userId })
                .sort({ createdAt: -1 })
                .lean(); // Use lean() for better performance

            console.log('✅ [SERVICE] Found', resumes.length, 'resumes');

            return {
                success: true,
                data: resumes,
                count: resumes.length
            };
        } catch (error) {
            console.error('❌ [SERVICE] Error getting user resumes:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getResumeById(resumeId, userId) {
        try {
            console.log('📥 [SERVICE] Getting resume:', resumeId, 'for user:', userId);

            if (!mongoose.Types.ObjectId.isValid(resumeId)) {
                return {
                    success: false,
                    error: 'Invalid resume ID format'
                };
            }

            const resume = await Resume.findOne({
                _id: resumeId,
                user: userId
            }).lean();

            if (!resume) {
                console.log('⚠️ [SERVICE] Resume not found:', resumeId);
                return {
                    success: false,
                    error: 'Resume not found'
                };
            }

            console.log('✅ [SERVICE] Resume found:', resume._id);

            return {
                success: true,
                data: resume
            };
        } catch (error) {
            console.error('❌ [SERVICE] Error getting resume by ID:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateResume(resumeId, userId, updateData) {
        try {
            console.log('📝 [SERVICE] Updating resume:', resumeId, 'for user:', userId);

            if (!mongoose.Types.ObjectId.isValid(resumeId)) {
                return {
                    success: false,
                    error: 'Invalid resume ID format'
                };
            }

            // Remove fields that shouldn't be updated directly
            const { _id, id, __v, user, createdAt, ...safeUpdateData } = updateData;

            const resume = await Resume.findOneAndUpdate(
                { _id: resumeId, user: userId },
                {
                    ...safeUpdateData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    lean: true
                }
            );

            if (!resume) {
                console.log('⚠️ [SERVICE] Resume not found for update:', resumeId);
                return {
                    success: false,
                    error: 'Resume not found'
                };
            }

            console.log('✅ [SERVICE] Resume updated successfully:', resume._id);

            return {
                success: true,
                data: resume
            };
        } catch (error) {
            console.error('❌ [SERVICE] Error updating resume:', error);

            if (error.name === 'ValidationError') {
                const formattedErrors = {};
                Object.keys(error.errors || {}).forEach(key => {
                    formattedErrors[key] = error.errors[key].message;
                });

                return {
                    success: false,
                    error: 'Resume validation failed',
                    validationErrors: formattedErrors,
                    message: error.message
                };
            }

            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteResume(resumeId, userId) {
        try {
            console.log('🗑️ [SERVICE] Deleting resume:', resumeId, 'for user:', userId);

            if (!mongoose.Types.ObjectId.isValid(resumeId)) {
                return {
                    success: false,
                    error: 'Invalid resume ID format'
                };
            }

            const resume = await Resume.findOneAndDelete({
                _id: resumeId,
                user: userId
            });

            if (!resume) {
                console.log('⚠️ [SERVICE] Resume not found for deletion:', resumeId);
                return {
                    success: false,
                    error: 'Resume not found'
                };
            }

            console.log('✅ [SERVICE] Resume deleted successfully:', resumeId);

            return {
                success: true,
                message: 'Resume deleted successfully',
                data: { id: resumeId }
            };
        } catch (error) {
            console.error('❌ [SERVICE] Error deleting resume:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ResumeService();