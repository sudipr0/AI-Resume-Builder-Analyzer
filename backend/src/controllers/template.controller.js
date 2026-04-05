import Template from '../models/Template.js';
import Resume from '../models/Resume.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logger utility
const logger = {
    info: (msg, data) => console.log(`📘 [TEMPLATE] ${msg}`, data || ''),
    success: (msg, data) => console.log(`✅ [TEMPLATE] ${msg}`, data || ''),
    warn: (msg, data) => console.log(`⚠️ [TEMPLATE] ${msg}`, data || ''),
    error: (msg, data) => console.log(`❌ [TEMPLATE] ${msg}`, data || '')
};

// Sample templates data for seeding
const sampleTemplates = [
    {
        name: 'Modern Professional',
        slug: 'modern-professional',
        description: 'Clean and modern design perfect for corporate professionals',
        category: 'professional',
        style: 'modern',
        thumbnail: { url: '/templates/modern-professional.jpg' },
        previewImages: [
            { url: '/templates/previews/modern-1.jpg', caption: 'Main layout', order: 0 },
            { url: '/templates/previews/modern-2.jpg', caption: 'Experience section', order: 1 }
        ],
        templateFiles: {
            html: { path: '/templates/modern-professional/index.html' },
            css: { path: '/templates/modern-professional/style.css' }
        },
        layout: { type: 'single-column', columns: 1 },
        customization: {
            colors: [
                { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa', background: '#ffffff', text: '#1f2937', isDefault: true },
                { name: 'Green', primary: '#059669', secondary: '#10b981', accent: '#34d399', background: '#ffffff', text: '#1f2937' },
                { name: 'Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', background: '#ffffff', text: '#1f2937' }
            ],
            fonts: {
                heading: 'Inter',
                body: 'Inter',
                options: [
                    { name: 'Default', heading: 'Inter', body: 'Inter', isDefault: true },
                    { name: 'Classic', heading: 'Merriweather', body: 'Open Sans' },
                    { name: 'Modern', heading: 'Poppins', body: 'Roboto' }
                ]
            }
        },
        sections: [
            { name: 'Summary', key: 'summary', type: 'required', order: 1 },
            { name: 'Experience', key: 'experience', type: 'required', order: 2, maxItems: 10 },
            { name: 'Education', key: 'education', type: 'required', order: 3, maxItems: 5 },
            { name: 'Skills', key: 'skills', type: 'required', order: 4 },
            { name: 'Projects', key: 'projects', type: 'optional', order: 5 },
            { name: 'Certifications', key: 'certifications', type: 'optional', order: 6 }
        ],
        metadata: {
            isPremium: false,
            isActive: true,
            isFeatured: true,
            tags: ['professional', 'modern', 'corporate', 'clean']
        }
    },
    {
        name: 'Creative Portfolio',
        slug: 'creative-portfolio',
        description: 'Eye-catching design for creative professionals and designers',
        category: 'creative',
        style: 'colorful',
        thumbnail: { url: '/templates/creative-portfolio.jpg' },
        previewImages: [
            { url: '/templates/previews/creative-1.jpg', caption: 'Portfolio layout', order: 0 },
            { url: '/templates/previews/creative-2.jpg', caption: 'Skills showcase', order: 1 }
        ],
        templateFiles: {
            html: { path: '/templates/creative-portfolio/index.html' },
            css: { path: '/templates/creative-portfolio/style.css' }
        },
        layout: { type: 'two-column', columns: 2 },
        customization: {
            colors: [
                { name: 'Vibrant', primary: '#f97316', secondary: '#fb923c', accent: '#fdba74', background: '#ffffff', text: '#1f2937', isDefault: true },
                { name: 'Cool', primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee', background: '#ffffff', text: '#1f2937' },
                { name: 'Warm', primary: '#b91c1c', secondary: '#dc2626', accent: '#ef4444', background: '#ffffff', text: '#1f2937' }
            ],
            fonts: {
                heading: 'Montserrat',
                body: 'Open Sans',
                options: [
                    { name: 'Default', heading: 'Montserrat', body: 'Open Sans', isDefault: true },
                    { name: 'Playful', heading: 'Comfortaa', body: 'Quicksand' },
                    { name: 'Bold', heading: 'Raleway', body: 'Lato' }
                ]
            }
        },
        sections: [
            { name: 'About Me', key: 'summary', type: 'required', order: 1 },
            { name: 'Work Experience', key: 'experience', type: 'required', order: 2 },
            { name: 'Education', key: 'education', type: 'required', order: 3 },
            { name: 'Skills', key: 'skills', type: 'required', order: 4, settings: { columns: 2 } },
            { name: 'Portfolio', key: 'projects', type: 'optional', order: 5 },
            { name: 'Achievements', key: 'certifications', type: 'optional', order: 6 }
        ],
        metadata: {
            isPremium: true,
            price: 9.99,
            isActive: true,
            isFeatured: true,
            tags: ['creative', 'design', 'portfolio', 'colorful']
        }
    },
    {
        name: 'Technical Resume',
        slug: 'technical-resume',
        description: 'Optimized for tech professionals with skills matrix',
        category: 'technical',
        style: 'minimal',
        thumbnail: { url: '/templates/technical-resume.jpg' },
        previewImages: [
            { url: '/templates/previews/technical-1.jpg', caption: 'Technical layout', order: 0 },
            { url: '/templates/previews/technical-2.jpg', caption: 'Skills matrix', order: 1 }
        ],
        templateFiles: {
            html: { path: '/templates/technical-resume/index.html' },
            css: { path: '/templates/technical-resume/style.css' }
        },
        layout: { type: 'hybrid', columns: 2 },
        customization: {
            colors: [
                { name: 'Dark', primary: '#111827', secondary: '#1f2937', accent: '#3b82f6', background: '#f9fafb', text: '#111827', isDefault: true },
                { name: 'Light', primary: '#f3f4f6', secondary: '#e5e7eb', accent: '#2563eb', background: '#ffffff', text: '#1f2937' },
                { name: 'Tech', primary: '#0f172a', secondary: '#1e293b', accent: '#06b6d4', background: '#f8fafc', text: '#0f172a' }
            ],
            fonts: {
                heading: 'Fira Code',
                body: 'Source Sans Pro',
                options: [
                    { name: 'Default', heading: 'Fira Code', body: 'Source Sans Pro', isDefault: true },
                    { name: 'Clean', heading: 'Roboto Mono', body: 'Roboto' },
                    { name: 'Professional', heading: 'IBM Plex Sans', body: 'IBM Plex Serif' }
                ]
            }
        },
        sections: [
            { name: 'Summary', key: 'summary', type: 'required', order: 1 },
            { name: 'Technical Skills', key: 'skills', type: 'required', order: 2, settings: { columns: 2, showTitle: true, titleText: 'Technical Skills' } },
            { name: 'Experience', key: 'experience', type: 'required', order: 3 },
            { name: 'Projects', key: 'projects', type: 'required', order: 4 },
            { name: 'Education', key: 'education', type: 'required', order: 5 },
            { name: 'Certifications', key: 'certifications', type: 'optional', order: 6 }
        ],
        metadata: {
            isPremium: false,
            isActive: true,
            isFeatured: true,
            tags: ['technical', 'developer', 'engineer', 'skills']
        }
    }
];

const templateController = {
    // Initialize templates (seed data)
    async initialize(req, res) {
        try {
            const count = await Template.countDocuments();

            if (count === 0) {
                await Template.insertMany(sampleTemplates);
                logger.success('Sample templates seeded successfully');

                res.json({
                    success: true,
                    message: 'Templates initialized successfully',
                    count: sampleTemplates.length
                });
            } else {
                res.json({
                    success: true,
                    message: 'Templates already exist',
                    count
                });
            }
        } catch (error) {
            logger.error('Failed to initialize templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all templates with filtering
    async getAll(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                category,
                style,
                isPremium,
                search,
                sort = '-metadata.usageCount',
                featured
            } = req.query;

            const query = { 'metadata.isActive': true };

            if (category) query.category = category;
            if (style) query.style = style;
            if (isPremium !== undefined) query['metadata.isPremium'] = isPremium === 'true';
            if (featured === 'true') query['metadata.isFeatured'] = true;

            if (search) {
                query.$text = { $search: search };
            }

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const [templates, total] = await Promise.all([
                Template.find(query)
                    .select('-templateFiles')
                    .sort(sort)
                    .limit(parseInt(limit))
                    .skip(skip)
                    .lean(),
                Template.countDocuments(query)
            ]);

            // Add computed fields
            const enhancedTemplates = templates.map(t => ({
                ...t,
                thumbnailUrl: t.thumbnail?.url,
                previewUrls: t.previewImages?.map(img => ({
                    url: img.url,
                    caption: img.caption
                })),
                isFree: !t.metadata.isPremium || t.metadata.price === 0
            }));

            res.json({
                success: true,
                data: enhancedTemplates,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            logger.error('Error fetching templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get single template by ID or slug
    async getOne(req, res) {
        try {
            const { id } = req.params;

            const query = mongoose.Types.ObjectId.isValid(id)
                ? { _id: id }
                : { slug: id };

            const template = await Template.findOne({
                ...query,
                'metadata.isActive': true
            }).lean();

            if (!template) {
                return res.status(404).json({
                    success: false,
                    error: 'Template not found'
                });
            }

            // Increment view count
            await Template.findByIdAndUpdate(template._id, {
                $inc: { 'metadata.usageCount': 1 }
            });

            // Enhanced response
            const enhancedTemplate = {
                ...template,
                thumbnailUrl: template.thumbnail?.url,
                previewUrls: template.previewImages?.map(img => ({
                    url: img.url,
                    caption: img.caption
                })),
                isFree: !template.metadata.isPremium || template.metadata.price === 0
            };

            res.json({
                success: true,
                data: enhancedTemplate
            });
        } catch (error) {
            logger.error('Error fetching template:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Create new template
    async create(req, res) {
        try {
            const templateData = req.body;

            // Check for existing template with same name
            const existing = await Template.findOne({
                name: templateData.name
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: 'Template with this name already exists'
                });
            }

            const template = new Template(templateData);
            await template.save();

            logger.success(`Template created: ${template.name}`);

            res.status(201).json({
                success: true,
                data: template,
                message: 'Template created successfully'
            });
        } catch (error) {
            logger.error('Error creating template:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update template
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const template = await Template.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            );

            if (!template) {
                return res.status(404).json({
                    success: false,
                    error: 'Template not found'
                });
            }

            logger.info(`Template updated: ${template.name}`);

            res.json({
                success: true,
                data: template,
                message: 'Template updated successfully'
            });
        } catch (error) {
            logger.error('Error updating template:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Delete template
    async delete(req, res) {
        try {
            const { id } = req.params;

            const template = await Template.findByIdAndDelete(id);

            if (!template) {
                return res.status(404).json({
                    success: false,
                    error: 'Template not found'
                });
            }

            logger.warn(`Template deleted: ${template.name}`);

            res.json({
                success: true,
                message: 'Template deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting template:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get template categories with counts
    async getCategories(req, res) {
        try {
            const categories = await Template.getCategories();

            res.json({
                success: true,
                data: categories.map(c => ({
                    name: c._id,
                    count: c.count,
                    premiumCount: c.premiumCount,
                    freeCount: c.freeCount,
                    avgRating: Math.round(c.avgRating * 10) / 10
                }))
            });
        } catch (error) {
            logger.error('Error fetching categories:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get featured templates
    async getFeatured(req, res) {
        try {
            const templates = await Template.getFeatured(8);

            const enhanced = templates.map(t => ({
                ...t.toObject(),
                thumbnailUrl: t.thumbnail?.url,
                isFree: !t.metadata.isPremium || t.metadata.price === 0
            }));

            res.json({
                success: true,
                data: enhanced
            });
        } catch (error) {
            logger.error('Error fetching featured templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get popular templates
    async getPopular(req, res) {
        try {
            const { limit = 10 } = req.query;

            const templates = await Template.getPopular(parseInt(limit));

            const enhanced = templates.map(t => ({
                ...t.toObject(),
                thumbnailUrl: t.thumbnail?.url,
                isFree: !t.metadata.isPremium || t.metadata.price === 0
            }));

            res.json({
                success: true,
                data: enhanced
            });
        } catch (error) {
            logger.error('Error fetching popular templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get templates by category
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const { limit = 20 } = req.query;

            const templates = await Template.getByCategory(category, parseInt(limit));

            const enhanced = templates.map(t => ({
                ...t.toObject(),
                thumbnailUrl: t.thumbnail?.url,
                isFree: !t.metadata.isPremium || t.metadata.price === 0
            }));

            res.json({
                success: true,
                data: enhanced
            });
        } catch (error) {
            logger.error('Error fetching templates by category:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get template styles
    async getStyles(req, res) {
        try {
            const styles = await Template.getStyles();

            res.json({
                success: true,
                data: styles
            });
        } catch (error) {
            logger.error('Error fetching styles:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get template preview
    async getPreview(req, res) {
        try {
            const { id } = req.params;
            const { index = 0 } = req.query;

            const template = await Template.findById(id).select('previewImages');

            if (!template || !template.previewImages || template.previewImages.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Preview not found'
                });
            }

            const preview = template.previewImages[parseInt(index)] || template.previewImages[0];

            res.json({
                success: true,
                data: {
                    url: preview.url,
                    caption: preview.caption,
                    total: template.previewImages.length,
                    current: parseInt(index) || 0
                }
            });
        } catch (error) {
            logger.error('Error fetching preview:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get template thumbnail
    async getThumbnail(req, res) {
        try {
            const { id } = req.params;

            const template = await Template.findById(id).select('thumbnail');

            if (!template || !template.thumbnail || !template.thumbnail.url) {
                return res.status(404).json({
                    success: false,
                    error: 'Thumbnail not found'
                });
            }

            // If it's a file path, serve the file
            if (template.thumbnail.url.startsWith('/')) {
                const filePath = path.join(process.cwd(), 'uploads', template.thumbnail.url);
                return res.sendFile(filePath);
            }

            // Otherwise return URL
            res.json({
                success: true,
                url: template.thumbnail.url
            });
        } catch (error) {
            logger.error('Error fetching thumbnail:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Upload template files
    async uploadFiles(req, res) {
        try {
            const { id } = req.params;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No files uploaded'
                });
            }

            const template = await Template.findById(id);
            if (!template) {
                return res.status(404).json({
                    success: false,
                    error: 'Template not found'
                });
            }

            // Process uploaded files
            const filePaths = {};

            for (const file of files) {
                if (file.fieldname === 'html') {
                    filePaths.html = { path: file.path };
                } else if (file.fieldname === 'css') {
                    filePaths.css = { path: file.path };
                } else if (file.fieldname === 'thumbnail') {
                    template.thumbnail = {
                        url: file.path,
                        publicId: file.filename
                    };
                } else if (file.fieldname === 'preview') {
                    if (!template.previewImages) template.previewImages = [];
                    template.previewImages.push({
                        url: file.path,
                        caption: file.originalname,
                        order: template.previewImages.length,
                        publicId: file.filename
                    });
                }
            }

            // Update template files if any
            if (Object.keys(filePaths).length > 0) {
                template.templateFiles = {
                    ...template.templateFiles,
                    ...filePaths
                };
            }

            await template.save();

            logger.success(`Files uploaded for template: ${template.name}`);

            res.json({
                success: true,
                message: 'Files uploaded successfully',
                data: {
                    thumbnail: template.thumbnail,
                    previewImages: template.previewImages,
                    templateFiles: template.templateFiles
                }
            });
        } catch (error) {
            logger.error('Error uploading files:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Toggle favorite (requires user model integration)
    async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // This would integrate with your User model
            // For now, return success message

            res.json({
                success: true,
                message: 'Favorite toggled',
                isFavorited: true // This would come from actual check
            });
        } catch (error) {
            logger.error('Error toggling favorite:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Track template usage
    async trackUsage(req, res) {
        try {
            const { id } = req.params;
            const { action = 'view' } = req.body;

            const update = {};
            if (action === 'view') {
                update.$inc = { 'metadata.usageCount': 1 };
                update.$set = { 'metadata.lastUsed': new Date() };
            } else if (action === 'download') {
                update.$inc = { 'metadata.downloads': 1 };
            }

            await Template.findByIdAndUpdate(id, update);

            res.json({
                success: true,
                message: 'Usage tracked'
            });
        } catch (error) {
            logger.error('Error tracking usage:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get template statistics
    async getStats(req, res) {
        try {
            const stats = await Template.aggregate([
                { $match: { 'metadata.isActive': true } },
                {
                    $group: {
                        _id: null,
                        totalTemplates: { $sum: 1 },
                        premiumTemplates: {
                            $sum: { $cond: ['$metadata.isPremium', 1, 0] }
                        },
                        freeTemplates: {
                            $sum: { $cond: ['$metadata.isPremium', 0, 1] }
                        },
                        totalViews: { $sum: '$metadata.usageCount' },
                        totalDownloads: { $sum: '$metadata.downloads' },
                        avgRating: { $avg: '$metadata.rating.average' },
                        categories: { $addToSet: '$category' },
                        styles: { $addToSet: '$style' }
                    }
                }
            ]);

            res.json({
                success: true,
                data: stats[0] || {
                    totalTemplates: 0,
                    premiumTemplates: 0,
                    freeTemplates: 0,
                    totalViews: 0,
                    totalDownloads: 0,
                    avgRating: 0,
                    categories: [],
                    styles: []
                }
            });
        } catch (error) {
            logger.error('Error fetching stats:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get templates using a specific template (resumes)
    async getUsages(req, res) {
        try {
            const { id } = req.params;

            const resumes = await Resume.find({ template: id })
                .select('title user createdAt metadata.views metadata.downloads')
                .populate('user', 'name email')
                .limit(20)
                .sort('-createdAt');

            res.json({
                success: true,
                data: resumes,
                count: resumes.length
            });
        } catch (error) {
            logger.error('Error fetching usages:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Admin: Get all templates (including inactive)
    async adminGetAll(req, res) {
        try {
            const {
                page = 1,
                limit = 50,
                includeInactive = false
            } = req.query;

            const query = includeInactive === 'true' ? {} : { 'metadata.isActive': true };

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const [templates, total] = await Promise.all([
                Template.find(query)
                    .sort('-createdAt')
                    .limit(parseInt(limit))
                    .skip(skip)
                    .populate('metadata.createdBy', 'name email'),
                Template.countDocuments(query)
            ]);

            res.json({
                success: true,
                data: templates,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            logger.error('Error fetching admin templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Admin: Bulk update templates
    async adminBulkUpdate(req, res) {
        try {
            const { ids, updates } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Template IDs required'
                });
            }

            const result = await Template.updateMany(
                { _id: { $in: ids } },
                { $set: updates }
            );

            res.json({
                success: true,
                message: 'Templates updated',
                modified: result.modifiedCount
            });
        } catch (error) {
            logger.error('Error bulk updating templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Admin: Duplicate template
    async adminDuplicate(req, res) {
        try {
            const { id } = req.params;

            const source = await Template.findById(id);
            if (!source) {
                return res.status(404).json({
                    success: false,
                    error: 'Template not found'
                });
            }

            // Clone the template
            const cloneData = source.toObject();
            delete cloneData._id;
            delete cloneData.createdAt;
            delete cloneData.updatedAt;

            cloneData.name = `${source.name} (Copy)`;
            cloneData.slug = `${source.slug}-copy-${Date.now()}`;
            cloneData.metadata = {
                ...source.metadata,
                usageCount: 0,
                downloads: 0,
                rating: { average: 0, count: 0 },
                isActive: false, // Inactive by default
                isFeatured: false
            };

            const clone = new Template(cloneData);
            await clone.save();

            res.status(201).json({
                success: true,
                data: clone,
                message: 'Template duplicated successfully'
            });
        } catch (error) {
            logger.error('Error duplicating template:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Admin: Reorder templates
    async adminReorder(req, res) {
        try {
            const { orders } = req.body;

            if (!orders || !Array.isArray(orders)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid order data'
                });
            }

            // This would update some order field if you had one
            // For now, just acknowledge

            res.json({
                success: true,
                message: 'Templates reordered'
            });
        } catch (error) {
            logger.error('Error reordering templates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

export default templateController;