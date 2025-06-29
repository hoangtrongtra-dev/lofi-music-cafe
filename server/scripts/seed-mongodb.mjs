import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB connection string
const uri = "mongodb+srv://hoangtrongtra2004:1ZYn9bgiaSGTFUZS@cluster0.wiay4qq.mongodb.net/";

// Database and collection names
const dbName = "lofi-music-cafe";
const collections = {
  users: "users",
  tracks: "tracks",
  playlists: "playlists",
  artists: "artists",
  reports: "reports",
  settings: "settings",
  cloudinary_assets: "cloudinary_assets"
};

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);

    // Clear existing data
    console.log('Clearing existing data...');
    for (const collectionName of Object.values(collections)) {
      await db.collection(collectionName).deleteMany({});
    }

    // Hash passwords properly
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const chillPassword = await bcrypt.hash('chill123', 10);
    const studyPassword = await bcrypt.hash('study123', 10);

    // Sample Users Data
    const users = [
      {
        id: "admin-001",
        username: "admin",
        email: "admin@lofi-cafe.com",
        password: adminPassword,
        role: "admin",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        favorites: [],
        playlists: [],
        following: [],
        followers: [],
        listeningHistory: [],
        preferences: {
          audioQuality: "high",
          notifications: {
            newReleases: true,
            recommendations: true,
            social: true,
            achievements: true
          },
          privacy: {
            showActivity: true,
            allowFollowing: true
          }
        },
        createdAt: new Date("2024-01-01"),
        lastLogin: new Date(),
        isVerified: true
      },
      {
        id: "user-001",
        username: "musiclover",
        email: "user@lofi-cafe.com",
        password: userPassword,
        role: "user",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
        favorites: ["track-001", "track-003"],
        playlists: ["playlist-001"],
        following: ["artist-001"],
        followers: [],
        listeningHistory: [
          {
            trackId: "track-001",
            timestamp: new Date("2024-01-15T10:30:00Z"),
            duration: 180
          },
          {
            trackId: "track-003",
            timestamp: new Date("2024-01-16T14:20:00Z"),
            duration: 200
          }
        ],
        preferences: {
          audioQuality: "normal",
          notifications: {
            newReleases: true,
            recommendations: true,
            social: false,
            achievements: true
          },
          privacy: {
            showActivity: false,
            allowFollowing: true
          }
        },
        createdAt: new Date("2024-01-10"),
        lastLogin: new Date(),
        isVerified: true
      },
      {
        id: "user-002",
        username: "chillvibes",
        email: "chill@lofi-cafe.com",
        password: chillPassword,
        role: "user",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        favorites: ["track-002", "track-004"],
        playlists: ["playlist-002"],
        following: ["artist-002"],
        followers: ["user-001"],
        listeningHistory: [
          {
            trackId: "track-002",
            timestamp: new Date("2024-01-20T09:15:00Z"),
            duration: 240
          }
        ],
        preferences: {
          audioQuality: "high",
          notifications: {
            newReleases: true,
            recommendations: true,
            social: true,
            achievements: false
          },
          privacy: {
            showActivity: true,
            allowFollowing: true
          }
        },
        createdAt: new Date("2024-01-15"),
        lastLogin: new Date(),
        isVerified: true
      },
      {
        id: "user-003",
        username: "studymaster",
        email: "study@lofi-cafe.com",
        password: studyPassword,
        role: "user",
        status: "suspended",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        favorites: ["track-002"],
        playlists: [],
        following: ["artist-002"],
        followers: [],
        listeningHistory: [
          {
            trackId: "track-002",
            timestamp: new Date("2024-01-25T16:45:00Z"),
            duration: 240
          }
        ],
        preferences: {
          audioQuality: "normal",
          notifications: {
            newReleases: false,
            recommendations: true,
            social: false,
            achievements: true
          },
          privacy: {
            showActivity: false,
            allowFollowing: false
          }
        },
        createdAt: new Date("2024-01-20"),
        lastLogin: new Date("2024-02-01"),
        isVerified: true
      }
    ];

    // Sample Tracks Data
    const tracks = [
      {
        id: "track-001",
        title: "Chill Vibes",
        artist: "LoFi Artist",
        album: "Chill Collection",
        duration: 180,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/chill-vibes.mp3",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        color: "#8B5CF6",
        genre: "Lo-Fi Hip Hop",
        releaseDate: "2024-01-15",
        isFavorite: false,
        isActive: true,
        mood: "chill",
        energy: 0.3,
        danceability: 0.4,
        valence: 0.6,
        playCount: 1250,
        likeCount: 89,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date()
      },
      {
        id: "track-002",
        title: "Study Session",
        artist: "Study Beats",
        album: "Focus Music",
        duration: 240,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/study-session.mp3",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
        color: "#10B981",
        genre: "Ambient",
        releaseDate: "2024-01-20",
        isFavorite: false,
        isActive: true,
        mood: "focused",
        energy: 0.2,
        danceability: 0.3,
        valence: 0.5,
        playCount: 890,
        likeCount: 67,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date()
      },
      {
        id: "track-003",
        title: "Night Drive",
        artist: "Synthwave Master",
        album: "Retro Vibes",
        duration: 200,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/night-drive.mp3",
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        color: "#F59E0B",
        genre: "Synthwave",
        releaseDate: "2024-02-01",
        isFavorite: false,
        isActive: true,
        mood: "energetic",
        energy: 0.7,
        danceability: 0.8,
        valence: 0.6,
        playCount: 2100,
        likeCount: 156,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date()
      },
      {
        id: "track-004",
        title: "Rainy Day",
        artist: "LoFi Artist",
        album: "Weather Moods",
        duration: 195,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/rainy-day.mp3",
        cover: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=300&h=300&fit=crop",
        color: "#3B82F6",
        genre: "Lo-Fi Hip Hop",
        releaseDate: "2024-02-10",
        isFavorite: false,
        isActive: true,
        mood: "rainy",
        energy: 0.2,
        danceability: 0.3,
        valence: 0.4,
        playCount: 750,
        likeCount: 45,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date()
      },
      {
        id: "track-005",
        title: "Sunset Dreams",
        artist: "Ambient Dreams",
        album: "Golden Hour",
        duration: 220,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/sunset-dreams.mp3",
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        color: "#F97316",
        genre: "Ambient",
        releaseDate: "2024-02-15",
        isFavorite: false,
        isActive: false,
        mood: "chill",
        energy: 0.1,
        danceability: 0.2,
        valence: 0.8,
        playCount: 320,
        likeCount: 23,
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date()
      },
      {
        id: "track-006",
        title: "Midnight Jazz",
        artist: "Jazz Collective",
        album: "Late Night Sessions",
        duration: 280,
        src: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/audio/midnight-jazz.mp3",
        cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
        color: "#1F2937",
        genre: "Jazz",
        releaseDate: "2024-02-20",
        isFavorite: false,
        isActive: true,
        mood: "sophisticated",
        energy: 0.5,
        danceability: 0.6,
        valence: 0.7,
        playCount: 450,
        likeCount: 34,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date()
      }
    ];

    // Sample Artists Data
    const artists = [
      {
        id: "artist-001",
        name: "LoFi Artist",
        bio: "Creating chill vibes and relaxing beats for your daily moments. Specializing in lo-fi hip hop and ambient music.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        tracks: ["track-001", "track-004"],
        followers: 15420,
        verified: true,
        monthlyListeners: 45000,
        genres: ["Lo-Fi Hip Hop", "Ambient"],
        socialLinks: {
          instagram: "https://instagram.com/lofiartist",
          twitter: "https://twitter.com/lofiartist",
          youtube: "https://youtube.com/lofiartist"
        },
        createdAt: new Date("2023-06-01"),
        updatedAt: new Date()
      },
      {
        id: "artist-002",
        name: "Study Beats",
        bio: "Focus music for productivity and concentration. Helping students and professionals stay focused.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
        tracks: ["track-002"],
        followers: 8900,
        verified: true,
        monthlyListeners: 23000,
        genres: ["Ambient", "Study Music"],
        socialLinks: {
          instagram: "https://instagram.com/studybeats",
          twitter: "https://twitter.com/studybeats"
        },
        createdAt: new Date("2023-08-15"),
        updatedAt: new Date()
      },
      {
        id: "artist-003",
        name: "Synthwave Master",
        bio: "Retro synthwave and electronic music inspired by the 80s. Driving beats and nostalgic melodies.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        tracks: ["track-003"],
        followers: 12300,
        verified: false,
        monthlyListeners: 18000,
        genres: ["Synthwave", "Electronic"],
        socialLinks: {
          instagram: "https://instagram.com/synthwavemaster",
          soundcloud: "https://soundcloud.com/synthwavemaster"
        },
        createdAt: new Date("2023-09-20"),
        updatedAt: new Date()
      },
      {
        id: "artist-004",
        name: "Ambient Dreams",
        bio: "Dreamy ambient soundscapes for relaxation and meditation. Creating peaceful atmospheres.",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
        tracks: ["track-005"],
        followers: 6700,
        verified: true,
        monthlyListeners: 12000,
        genres: ["Ambient", "Meditation"],
        socialLinks: {
          instagram: "https://instagram.com/ambientdreams",
          spotify: "https://spotify.com/artist/ambientdreams"
        },
        createdAt: new Date("2023-10-01"),
        updatedAt: new Date()
      }
    ];

    // Sample Playlists Data
    const playlists = [
      {
        id: "playlist-001",
        name: "Chill Vibes Collection",
        description: "A curated collection of the best chill and relaxing tracks for your downtime.",
        tracks: ["track-001", "track-004"],
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date(),
        isPublic: true,
        mood: "chill",
        collaborative: false,
        createdBy: "user-001",
        followers: 45,
        totalDuration: 375
      },
      {
        id: "playlist-002",
        name: "Study Focus",
        description: "Perfect music for studying and concentration sessions.",
        tracks: ["track-002"],
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date(),
        isPublic: true,
        mood: "focused",
        collaborative: false,
        createdBy: "admin-001",
        followers: 123,
        totalDuration: 240
      },
      {
        id: "playlist-003",
        name: "Night Drive",
        description: "Synthwave and electronic music for late night drives.",
        tracks: ["track-003"],
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date(),
        isPublic: true,
        mood: "energetic",
        collaborative: true,
        createdBy: "user-001",
        followers: 67,
        totalDuration: 200
      },
      {
        id: "playlist-004",
        name: "Rainy Day Vibes",
        description: "Perfect soundtrack for rainy days and cozy moments.",
        tracks: ["track-004"],
        cover: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=300&h=300&fit=crop",
        createdAt: new Date("2024-02-12"),
        updatedAt: new Date(),
        isPublic: true,
        mood: "rainy",
        collaborative: false,
        createdBy: "user-002",
        followers: 23,
        totalDuration: 195
      },
      {
        id: "playlist-005",
        name: "Private Collection",
        description: "My personal collection of favorite tracks.",
        tracks: ["track-001", "track-003"],
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        createdAt: new Date("2024-02-18"),
        updatedAt: new Date(),
        isPublic: false,
        mood: "mixed",
        collaborative: false,
        createdBy: "user-003",
        followers: 0,
        totalDuration: 380
      }
    ];

    // Sample Reports Data
    const reports = [
      {
        id: "report-001",
        type: "Copyright",
        content: "Track 'Chill Vibes' appears to use copyrighted material without permission",
        user: "musiclover",
        status: "pending",
        created: new Date("2024-02-15T10:30:00Z"),
        updatedAt: new Date("2024-02-15T10:30:00Z"),
        notes: "",
        relatedTrack: "track-001",
        severity: "high"
      },
      {
        id: "report-002",
        type: "Abuse",
        content: "User 'studymaster' has been sending inappropriate messages",
        user: "studymaster",
        status: "resolved",
        created: new Date("2024-02-10T14:20:00Z"),
        updatedAt: new Date("2024-02-12T09:15:00Z"),
        notes: "User has been suspended for 7 days. Warning issued.",
        relatedUser: "studymaster",
        severity: "medium"
      },
      {
        id: "report-003",
        type: "Spam",
        content: "Multiple spam comments detected on track 'Night Drive'",
        user: "chillvibes",
        status: "pending",
        created: new Date("2024-02-18T16:45:00Z"),
        updatedAt: new Date("2024-02-18T16:45:00Z"),
        notes: "",
        relatedTrack: "track-003",
        severity: "low"
      },
      {
        id: "report-004",
        type: "Copyright",
        content: "Artist 'Synthwave Master' using unlicensed samples",
        user: "musiclover",
        status: "resolved",
        created: new Date("2024-02-05T11:20:00Z"),
        updatedAt: new Date("2024-02-08T15:30:00Z"),
        notes: "Artist has provided proper licensing documentation. Report closed.",
        relatedArtist: "artist-003",
        severity: "high"
      },
      {
        id: "report-005",
        type: "Abuse",
        content: "Inappropriate playlist description",
        user: "chillvibes",
        status: "pending",
        created: new Date("2024-02-20T13:10:00Z"),
        updatedAt: new Date("2024-02-20T13:10:00Z"),
        notes: "",
        relatedPlaylist: "playlist-005",
        severity: "medium"
      }
    ];

    // Sample Settings Data
    const settings = [
      {
        id: "main",
        siteName: "LoFi Music Cafe",
        apiKey: "sk-xxxxxx",
        allowRegister: true,
        maxUploadSize: 50,
        allowedFileTypes: ["mp3", "wav", "ogg", "jpg", "png", "gif"],
        maintenanceMode: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date()
      }
    ];

    // Sample Cloudinary Assets Data
    const cloudinaryAssets = [
      {
        id: "asset-001",
        public_id: "lofi-cafe/admin/images/artist-profile-1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/lofi-cafe/admin/images/artist-profile-1",
        resource_type: "image",
        format: "jpg",
        bytes: 245760,
        folder: "lofi-cafe/admin/images",
        created_at: new Date("2024-02-15T10:00:00Z"),
        updated_at: new Date("2024-02-15T10:00:00Z")
      },
      {
        id: "asset-002",
        public_id: "lofi-cafe/admin/images/album-cover-1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/lofi-cafe/admin/images/album-cover-1",
        resource_type: "image",
        format: "png",
        bytes: 512000,
        folder: "lofi-cafe/admin/images",
        created_at: new Date("2024-02-16T14:30:00Z"),
        updated_at: new Date("2024-02-16T14:30:00Z")
      },
      {
        id: "asset-003",
        public_id: "lofi-cafe/admin/audio/chill-vibes-demo",
        url: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/lofi-cafe/admin/audio/chill-vibes-demo",
        resource_type: "video",
        format: "mp3",
        bytes: 5242880,
        folder: "lofi-cafe/admin/audio",
        created_at: new Date("2024-02-17T09:15:00Z"),
        updated_at: new Date("2024-02-17T09:15:00Z")
      },
      {
        id: "asset-004",
        public_id: "lofi-cafe/admin/audio/study-session-demo",
        url: "https://res.cloudinary.com/your-cloud-name/video/upload/v1/lofi-cafe/admin/audio/study-session-demo",
        resource_type: "video",
        format: "mp3",
        bytes: 3145728,
        folder: "lofi-cafe/admin/audio",
        created_at: new Date("2024-02-18T16:45:00Z"),
        updated_at: new Date("2024-02-18T16:45:00Z")
      },
      {
        id: "asset-005",
        public_id: "lofi-cafe/admin/images/background-1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/lofi-cafe/admin/images/background-1",
        resource_type: "image",
        format: "jpg",
        bytes: 1024000,
        folder: "lofi-cafe/admin/images",
        created_at: new Date("2024-02-19T11:20:00Z"),
        updated_at: new Date("2024-02-19T11:20:00Z")
      }
    ];

    // Insert data into collections
    console.log('Inserting users...');
    const usersResult = await db.collection(collections.users).insertMany(users);
    console.log(`Inserted ${usersResult.insertedCount} users`);

    console.log('Inserting tracks...');
    const tracksResult = await db.collection(collections.tracks).insertMany(tracks);
    console.log(`Inserted ${tracksResult.insertedCount} tracks`);

    console.log('Inserting artists...');
    const artistsResult = await db.collection(collections.artists).insertMany(artists);
    console.log(`Inserted ${artistsResult.insertedCount} artists`);

    console.log('Inserting playlists...');
    const playlistsResult = await db.collection(collections.playlists).insertMany(playlists);
    console.log(`Inserted ${playlistsResult.insertedCount} playlists`);

    console.log('Inserting reports...');
    const reportsResult = await db.collection(collections.reports).insertMany(reports);
    console.log(`Inserted ${reportsResult.insertedCount} reports`);

    console.log('Inserting settings...');
    const settingsResult = await db.collection(collections.settings).insertMany(settings);
    console.log(`Inserted ${settingsResult.insertedCount} settings`);

    console.log('Inserting cloudinary assets...');
    const assetsResult = await db.collection(collections.cloudinary_assets).insertMany(cloudinaryAssets);
    console.log(`Inserted ${assetsResult.insertedCount} cloudinary assets`);

    // Create indexes for better performance
    console.log('Creating indexes...');
    await db.collection(collections.users).createIndex({ email: 1 }, { unique: true });
    await db.collection(collections.users).createIndex({ username: 1 }, { unique: true });
    await db.collection(collections.tracks).createIndex({ title: 1 });
    await db.collection(collections.tracks).createIndex({ artist: 1 });
    await db.collection(collections.tracks).createIndex({ genre: 1 });
    await db.collection(collections.artists).createIndex({ name: 1 });
    await db.collection(collections.playlists).createIndex({ createdBy: 1 });
    await db.collection(collections.reports).createIndex({ status: 1 });
    await db.collection(collections.reports).createIndex({ type: 1 });
    await db.collection(collections.reports).createIndex({ created: -1 });
    await db.collection(collections.cloudinary_assets).createIndex({ resource_type: 1 });
    await db.collection(collections.cloudinary_assets).createIndex({ created_at: -1 });

    console.log('Database seeding completed successfully!');
    console.log('\n=== Sample Data Summary ===');
    console.log(`Users: ${usersResult.insertedCount}`);
    console.log(`Tracks: ${tracksResult.insertedCount}`);
    console.log(`Artists: ${artistsResult.insertedCount}`);
    console.log(`Playlists: ${playlistsResult.insertedCount}`);
    console.log(`Reports: ${reportsResult.insertedCount}`);
    console.log(`Settings: ${settingsResult.insertedCount}`);
    console.log(`Cloudinary Assets: ${assetsResult.insertedCount}`);
    
    console.log('\n=== Login Credentials ===');
    console.log('Admin Account:');
    console.log('  Username: admin');
    console.log('  Email: admin@lofi-cafe.com');
    console.log('  Password: admin123');
    console.log('\nUser Accounts:');
    console.log('  Username: musiclover | Email: user@lofi-cafe.com | Password: user123');
    console.log('  Username: chillvibes | Email: chill@lofi-cafe.com | Password: chill123');
    console.log('  Username: studymaster | Email: study@lofi-cafe.com | Password: study123 (Suspended)');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase().catch(console.error); 