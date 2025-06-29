import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const uri = process.env.MONGODB_URI || "mongodb+srv://hoangtrongtra2004:1ZYn9bgiaSGTFUZS@cluster0.wiay4qq.mongodb.net/";
const dbName = "lofi-music-cafe";
let db;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: false
    };

    const result = await db.collection('users').insertOne(newUser);
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real application, you would send an email here
    // For now, we'll just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // In a real application, you would verify the reset token
    // For now, we'll just return success
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Dashboard API Routes

// Users CRUD
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await db.collection('users')
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('users').countDocuments(query);

    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: 'active',
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: false
    };

    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;
    
    const updateData = { username, email, role, status, updatedAt: new Date() };
    
    const result = await db.collection('users').updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('users').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tracks CRUD
app.get('/api/admin/tracks', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const tracks = await db.collection('tracks')
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('tracks').countDocuments(query);

    res.json({ tracks, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/tracks', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, artist, duration, genre, mood, isActive = true } = req.body;
    
    const newTrack = {
      id: `track-${Date.now()}`,
      title,
      artist,
      duration: parseInt(duration),
      genre,
      mood,
      isActive,
      playCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('tracks').insertOne(newTrack);
    res.status(201).json({ message: 'Track created successfully', track: newTrack });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/tracks/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const result = await db.collection('tracks').updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({ message: 'Track updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/tracks/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('tracks').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Playlists CRUD
app.get('/api/admin/playlists', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    const playlists = await db.collection('playlists')
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('playlists').countDocuments(query);

    res.json({ playlists, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/playlists', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, tracks, creator, status = 'public' } = req.body;
    
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks: parseInt(tracks) || 0,
      creator,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('playlists').insertOne(newPlaylist);
    res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/playlists/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const result = await db.collection('playlists').updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ message: 'Playlist updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/playlists/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('playlists').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reports CRUD
app.get('/api/admin/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type = 'all', status = 'all', search = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (type !== 'all') query.type = type;
    if (status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { user: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await db.collection('reports')
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('reports').countDocuments(query);

    res.json({ reports, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, content, user, status = 'pending' } = req.body;
    
    const newReport = {
      id: `report-${Date.now()}`,
      type,
      content,
      user,
      status,
      created: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('reports').insertOne(newReport);
    res.status(201).json({ message: 'Report created successfully', report: newReport });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/reports/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const result = await db.collection('reports').updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/reports/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('reports').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics
app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const usersCount = await db.collection('users').countDocuments();
    const tracksCount = await db.collection('tracks').countDocuments();
    const playlistsCount = await db.collection('playlists').countDocuments();
    const reportsCount = await db.collection('reports').countDocuments({ status: 'pending' });

    const analytics = {
      users: usersCount.toString(),
      tracks: tracksCount.toString(),
      playlists: playlistsCount.toString(),
      reports: reportsCount.toString(),
      listens: '0', // Placeholder
      uploads: '0'  // Placeholder
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cloudinary Upload
app.post('/api/admin/upload', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { file, type = 'image' } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: type,
      folder: 'lofi-music-cafe'
    });

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Cloudinary Asset Management
app.post('/api/admin/cloudinary/asset', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { public_id, url, resource_type, format, bytes, folder } = req.body;
    
    const asset = {
      id: `asset-${Date.now()}`,
      public_id,
      url,
      resource_type,
      format,
      bytes: parseInt(bytes),
      folder,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await db.collection('cloudinary_assets').insertOne(asset);
    res.status(201).json({ message: 'Asset saved successfully', asset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save asset' });
  }
});

app.get('/api/admin/cloudinary/assets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let query = {};
    if (type !== 'all') {
      query.resource_type = type === 'image' ? 'image' : 'video';
    }

    const assets = await db.collection('cloudinary_assets')
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    const images = assets.filter(asset => asset.resource_type === 'image');
    const audios = assets.filter(asset => asset.resource_type === 'video');

    res.json({ images, audios, total: assets.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

app.delete('/api/admin/cloudinary/asset/:publicId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.log('Cloudinary delete failed, but continuing with database cleanup:', cloudinaryError);
    }
    
    // Delete from database
    const result = await db.collection('cloudinary_assets').deleteOne({ public_id: publicId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Settings
app.get('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await db.collection('settings').findOne({ id: 'main' }) || {
      siteName: 'LoFi Music Cafe',
      apiKey: 'sk-xxxxxx',
      allowRegister: true
    };
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { siteName, apiKey, allowRegister } = req.body;
    
    const result = await db.collection('settings').updateOne(
      { id: 'main' },
      { 
        $set: { siteName, apiKey, allowRegister, updatedAt: new Date() }
      },
      { upsert: true }
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app; 