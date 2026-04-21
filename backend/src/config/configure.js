import dotenv from 'dotenv';
import path from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if(!mongoUri){
    throw new Error('MONGODB_URI (or MONGO_URI) is not defined');
    exit(1);
}

if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined');
    exit(1);
}

if(!process.env.PORT){
    console.warn('PORT is not defined, using default 3000');
    exit(1);
}

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_USER){
    console.warn('Google OAuth credentials are not fully defined, Google login will not work');
    exit(1);
}

const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: mongoUri,
    JWT_SECRET: process.env.JWT_SECRET
};

export default config;