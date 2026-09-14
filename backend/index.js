import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/speaking_db';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure fallback JSON folder and files exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([
      {
        id: 'demo-user-1',
        name: 'Nguyễn Văn A',
        email: 'demo@speaking.ai',
        createdAt: new Date().toISOString()
      }
    ], null, 2));
  }
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
  }
} catch (e) {
  console.warn('⚠️ Environment filesystem is read-only (Serverless mode). Skipping local file creation.');
}

// Helpers to read/write fallback JSON data
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('⚠️ Unable to write to filesystem (Serverless mode).', e.message);
  }
}

// Mongoose Models & Schemas
let isMongoConnected = false;

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const submissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  date: { type: String },
  examTitle: { type: String },
  examType: { type: String },
  score: { type: Number },
  overallFeedback: { type: String }
}, { strict: false, timestamps: true });

const UserModel = mongoose.model('User', userSchema);
const SubmissionModel = mongoose.model('Submission', submissionSchema);

// Connect to MongoDB
console.log(`🔌 Đang kết nối tới MongoDB: ${MONGODB_URI}...`);
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout 5s nếu không kết nối được
})
.then(() => {
  isMongoConnected = true;
  console.log('✅ Đã kết nối thành công tới MongoDB Database!');
})
.catch((err) => {
  isMongoConnected = false;
  console.warn('⚠️ Không thể kết nối MongoDB Database (sẽ chuyển sang chế độ lưu bằng JSON file local).');
  console.warn('Chi tiết lỗi:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('⚠️ Mất kết nối tới MongoDB Database. Đã chuyển sang JSON File Fallback.');
});

// REST API Endpoints

// 1. Get Health status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Speaking Backend Server Running',
    database: isMongoConnected ? 'MongoDB Connected' : 'JSON Fallback Mode',
    timestamp: new Date().toISOString()
  });
});

// 2. Auth: Register & Login handler
const handleAuth = async (req, res) => {
  const { name, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email là bắt buộc' });
  }

  const userId = 'user-' + Date.now();
  const userName = name || email.split('@')[0];

  if (isMongoConnected) {
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          id: userId,
          name: userName,
          email,
          createdAt: new Date()
        });
      }
      return res.json({ success: true, user, storage: 'MongoDB' });
    } catch (err) {
      console.error('Mongo User Auth error, falling back to JSON:', err.message);
    }
  }

  // Fallback JSON persistence
  const users = readJSON(USERS_FILE);
  let user = users.find((u) => u.email === email);

  if (!user) {
    user = {
      id: userId,
      name: userName,
      email,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJSON(USERS_FILE, users);
  }

  res.json({ success: true, user, storage: 'JSON' });
};

app.post('/api/auth/register', handleAuth);
app.post('/api/auth/login', handleAuth);

// 3. Submissions: Get user submissions history
app.get('/api/submissions', async (req, res) => {
  const { userId } = req.query;

  if (isMongoConnected) {
    try {
      const query = userId ? { $or: [{ userId }, { userId: 'guest' }] } : {};
      const submissions = await SubmissionModel.find(query).sort({ createdAt: -1, _id: -1 }).lean();
      return res.json(submissions);
    } catch (err) {
      console.error('Mongo Get Submissions error, falling back to JSON:', err.message);
    }
  }

  // Fallback JSON persistence
  const submissions = readJSON(SUBMISSIONS_FILE);
  if (userId) {
    const filtered = submissions.filter((s) => s.userId === userId || s.userId === 'guest');
    return res.json(filtered);
  }
  res.json(submissions);
});

// 4. Submissions: Save new test submission to database
app.post('/api/submissions', async (req, res) => {
  const submission = req.body;
  if (!submission || !submission.id) {
    return res.status(400).json({ error: 'Dữ liệu bài thi không hợp lệ' });
  }

  if (isMongoConnected) {
    try {
      const saved = await SubmissionModel.findOneAndUpdate(
        { id: submission.id },
        submission,
        { upsert: true, new: true }
      );
      return res.json({
        success: true,
        message: 'Đã lưu bài thi vào MongoDB Database',
        submission: saved,
        storage: 'MongoDB'
      });
    } catch (err) {
      console.error('Mongo Save Submission error, falling back to JSON:', err.message);
    }
  }

  // Fallback JSON persistence
  const submissions = readJSON(SUBMISSIONS_FILE);
  const existingIndex = submissions.findIndex((s) => s.id === submission.id);
  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions.unshift(submission);
  }
  writeJSON(SUBMISSIONS_FILE, submissions);

  res.json({
    success: true,
    message: 'Đã lưu bài thi vào JSON Database',
    submission,
    storage: 'JSON'
  });
});

// 5. Submissions: Delete test submission by ID
app.delete('/api/submissions/:id', async (req, res) => {
  const { id } = req.params;

  if (isMongoConnected) {
    try {
      await SubmissionModel.deleteOne({ id });
      return res.json({
        success: true,
        message: 'Đã xóa bài thi khỏi MongoDB Database',
        storage: 'MongoDB'
      });
    } catch (err) {
      console.error('Mongo Delete Submission error, falling back to JSON:', err.message);
    }
  }

  // Fallback JSON persistence
  let submissions = readJSON(SUBMISSIONS_FILE);
  submissions = submissions.filter((s) => s.id !== id);
  writeJSON(SUBMISSIONS_FILE, submissions);

  res.json({
    success: true,
    message: 'Đã xóa bài thi khỏi Backend JSON Database',
    storage: 'JSON'
  });
});

// 6. Dictionary API Proxy với In-Memory Fast Cache (bỏ qua giới hạn CORS & phản hồi 0ms)
const backendDictCache = new Map();

app.get('/api/dictionary/:word', async (req, res) => {
  const { word } = req.params;
  const cleanWord = (word || '').trim().toLowerCase();

  if (backendDictCache.has(cleanWord)) {
    return res.json(backendDictCache.get(cleanWord));
  }

  try {
    const apiRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      backendDictCache.set(cleanWord, data);
      return res.json(data);
    }
  } catch (err) {
    console.error('Error proxying primary dictionary request:', err.message);
  }

  // Fallback: Query Datamuse API for real English definition & part of speech
  try {
    const dmRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&md=d,p&max=1`);
    if (dmRes.ok) {
      const dmData = await dmRes.json();
      if (Array.isArray(dmData) && dmData.length > 0) {
        const item = dmData[0];
        const defs = item.defs || [];
        const formattedDefs = defs.map((d) => {
          const parts = d.split('\t');
          return {
            definition: parts.length > 1 ? parts[1] : d
          };
        });

        const fallbackEntry = [
          {
            word: item.word || cleanWord,
            phonetic: `/${cleanWord}/`,
            meanings: [
              {
                partOfSpeech: item.tags?.[0] || 'vocabulary',
                definitions: formattedDefs.length > 0 ? formattedDefs : [{ definition: `Definition of ${cleanWord}` }]
              }
            ]
          }
        ];

        backendDictCache.set(cleanWord, fallbackEntry);
        return res.json(fallbackEntry);
      }
    }
  } catch (err) {
    console.error('Error proxying Datamuse dictionary request:', err.message);
  }

  return res.status(404).json({ error: 'Word not found in dictionary' });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server AI Speaking đang chạy tại: http://localhost:${PORT}`);
  });
}

export default app;
