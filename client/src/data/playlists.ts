import { Playlist } from '../types/Track';

export const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Study Focus',
    description: 'Perfect beats for deep concentration and productivity',
    tracks: ['1', '4', '6'],
    cover: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-15',
    isPublic: true
  },
  {
    id: '2',
    name: 'Chill Evening',
    description: 'Relaxing vibes for unwinding after a long day',
    tracks: ['2', '3', '5', '8'],
    cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-12',
    isPublic: true
  },
  {
    id: '3',
    name: 'Morning Routine',
    description: 'Start your day with peaceful and energizing sounds',
    tracks: ['6', '7', '4'],
    cover: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-10',
    isPublic: true
  },
  {
    id: '4',
    name: 'Night Drive',
    description: 'Atmospheric beats for late night adventures',
    tracks: ['5', '7', '1'],
    cover: 'https://images.pexels.com/photos/2526935/pexels-photo-2526935.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-08',
    isPublic: true
  }
];