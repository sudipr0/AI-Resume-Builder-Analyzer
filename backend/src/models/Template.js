import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Template name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Template name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Template description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['professional', 'creative', 'modern', 'technical', 'academic', 'executive', 'minimal'],
        index: true
    },
    style: {
        type: String,
        required: true,
        enum: ['minimal', 'colorful', 'elegant', 'bold', 'compact', 'spacious', 'classic'],
        index: true
    },
    thumbnail: {
        url: { type: String, required: true },
        publicId: String
    },
    previewImages: [{
        url: { type: String, required: true },
        caption: String,
        order: { type: Number, default: 0 },
        publicId: String
    }],
    templateFiles: {
        html: {
            path: { type: String, required: true },
            publicId: String
        },
        css: {
            path: { type: String, required: true },
            publicId: String
        },
        assets: [{
            name: String,
            path: String,
            type: String,
            publicId: String
        }]
    },
    layout: {
        type: {
            type: String,
            enum: ['single-column', 'two-column', 'hybrid', 'sidebar-left', 'sidebar-right'],
            default: 'single-column'
        },
        columns: {
            type: Number,
            min: 1,
            max: 3,
            default: 1
        }
    },
    customization: {
        colors: [{
            name: { type: String, required: true },
            primary: { type: String, required: true },
            secondary: String,
            accent: String,
            background: String,
            text: String,
            isDefault: { type: Boolean, default: false }
        }],
        fonts: {
            heading: { type: String, default: 'Arial' },
            body: { type: String, default: 'Arial' },
            options: [{
                name: String,
                heading: String,
                body: String,
                isDefault: { type: Boolean, default: false }
            }]
        },
        spacing: {
            compact: { type: Boolean, default: false },
            lineHeight: { type: Number, default: 1.5 },
            margins: {
                top: { type: Number, default: 20 },
                bottom: { type: Number, default: 20 },
                left: { type: Number, default: 20 },
                right: { type: Number, default: 20 }
            }
        }
    },
    sections: [{
        name: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true,
            lowercase: true
        },
        type: {
            type: String,
            enum: ['required', 'optional', 'custom', 'dynamic'],
            default: 'optional'
        },
        display: {
            type: String,
            enum: ['show', 'hide', 'conditional'],
            default: 'show'
        },
        order: {
            type: Number,
            default: 0
        },
        maxItems: {
            type: Number,
            default: null
        },
        placeholder: String,
        icon: String,
        settings: {
            showTitle: { type: Boolean, default: true },
            titleText: String,
            columns: { type: Number, default: 1 },
            layout: String
        }
    }],
    metadata: {
        isPremium: {
            type: Boolean,
            default: false,
            index: true
        },
        price: {
            type: Number,
            default: 0,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        },
        usageCount: {
            type: Number,
            default: 0
        },
        downloads: {
            type: Number,
            default: 0
        },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 }
        },
        tags: [{
            type: String,
            index: true
        }],
        version: {
            type: String,
            default: '1.0.0'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        lastUsed: Date
    },
    settings: {
        pageSize: {
            type: String,
            enum: ['A4', 'Letter', 'Legal'],
            default: 'A4'
        },
        orientation: {
            type: String,
            enum: ['portrait', 'landscape'],
            default: 'portrait'
        },
        allowCustomization: {
            type: Boolean,
            default: true
        },
        exportFormats: [{
            type: String,
            enum: ['pdf', 'docx', 'html', 'json'],
            default: ['pdf', 'html']
        }],
        responsive: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
templateSchema.index({ name: 'text', description: 'text', 'metadata.tags': 'text' });
templateSchema.index({ category: 1, 'metadata.isActive': 1 });
templateSchema.index({ style: 1, 'metadata.isPremium': 1 });
templateSchema.index({ 'metadata.usageCount': -1 });
templateSchema.index({ 'metadata.rating.average': -1 });
templateSchema.index({ createdAt: -1 });

// Virtual fields
templateSchema.virtual('thumbnailUrl').get(function () {
    return this.thumbnail?.url ? `/api/templates/thumbnail/${this._id}` : null;
});

templateSchema.virtual('previewUrls').get(function () {
    return this.previewImages?.map(img => ({
        url: `/api/templates/preview/${this._id}/${img.order}`,
        caption: img.caption
    }));
});

templateSchema.virtual('isFree').get(function () {
    return !this.metadata.isPremium || this.metadata.price === 0;
});

// Methods
templateSchema.methods.incrementUsage = async function () {
    this.metadata.usageCount += 1;
    this.metadata.lastUsed = new Date();
    return this.save();
};

templateSchema.methods.incrementDownloads = async function () {
    this.metadata.downloads += 1;
    return this.save();
};

templateSchema.methods.updateRating = async function (newRating) {
    const total = this.metadata.rating.average * this.metadata.rating.count + newRating;
    this.metadata.rating.count += 1;
    this.metadata.rating.average = total / this.metadata.rating.count;
    return this.save();
};

templateSchema.methods.addColorScheme = function (colorScheme) {
    this.customization.colors.push(colorScheme);
    return this.save();
};

templateSchema.methods.setDefaultColorScheme = function (colorName) {
    this.customization.colors.forEach(c => {
        c.isDefault = c.name === colorName;
    });
    return this.save();
};

// Statics
templateSchema.statics.getFeatured = function (limit = 6) {
    return this.find({ 'metadata.isActive': true, 'metadata.isFeatured': true })
        .sort('-metadata.usageCount -metadata.rating.average')
        .limit(limit)
        .select('-templateFiles');
};

templateSchema.statics.getPopular = function (limit = 10) {
    return this.find({ 'metadata.isActive': true })
        .sort('-metadata.usageCount -metadata.rating.average')
        .limit(limit)
        .select('-templateFiles');
};

templateSchema.statics.getByCategory = function (category, limit = 20) {
    return this.find({ category, 'metadata.isActive': true })
        .sort('-metadata.isFeatured -metadata.usageCount')
        .limit(limit)
        .select('-templateFiles');
};

templateSchema.statics.search = function (query, filters = {}) {
    const searchQuery = {
        'metadata.isActive': true,
        ...filters
    };

    if (query) {
        searchQuery.$text = { $search: query };
    }

    return this.find(searchQuery)
        .sort(query ? { score: { $meta: 'textScore' } } : '-metadata.usageCount')
        .select('-templateFiles');
};

templateSchema.statics.getCategories = async function () {
    return this.aggregate([
        { $match: { 'metadata.isActive': true } },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                premiumCount: {
                    $sum: { $cond: ['$metadata.isPremium', 1, 0] }
                },
                freeCount: {
                    $sum: { $cond: ['$metadata.isPremium', 0, 1] }
                },
                avgRating: { $avg: '$metadata.rating.average' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

templateSchema.statics.getStyles = async function () {
    return this.aggregate([
        { $match: { 'metadata.isActive': true } },
        {
            $group: {
                _id: '$style',
                count: { $sum: 1 },
                templates: { $push: { id: '$_id', name: '$name', thumbnail: '$thumbnail.url' } }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);
};

// Pre-save middleware
templateSchema.pre('save', async function (next) {
    // Generate slug if not provided
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Ensure unique slug
    const existing = await this.constructor.findOne({
        slug: this.slug,
        _id: { $ne: this._id }
    });

    if (existing) {
        this.slug = `${this.slug}-${Date.now()}`;
    }

    next();
});

const Template = mongoose.model('Template', templateSchema);
export default Template;