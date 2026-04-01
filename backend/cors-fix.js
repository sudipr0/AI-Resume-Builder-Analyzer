import fs from 'fs';

const serverFile = 'server.js';
let content = fs.readFileSync(serverFile, 'utf8');

// 🔥 CRITICAL: Replace CORS config to allow ALL origins
const corsConfig = `// CORS Configuration - ALLOW ALL
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins in development
        if (process.env.NODE_ENV === 'development' && (!origin || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
            return callback(null, true);
        }
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        callback(null, true); // TEMP: Allow all
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-User-ID', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization']
}));
app.options('*', cors());`;

// Replace existing CORS
if (content.includes('app.use(cors')) {
    content = content.replace(/app\.use\(cors\([^)]*\)\)[^;]*;/, corsConfig);
}
fs.writeFileSync(serverFile, content);
console.log('✅ CORS FIXED - Allow all origins');
