import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, UserStatus } from '../../types/User';
import { 
  Users, 
  Music, 
  Play, 
  Settings, 
  BarChart3, 
  Shield, 
  Flag, 
  Activity,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Cloud
} from 'lucide-react';
import CloudinaryManager from './CloudinaryManager';
import axios from 'axios';

interface AdminDashboardProps {
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalType, setModalType] = useState<'add'|'edit'|'delete'|'suspend'|null>(null);
  const [contentTab, setContentTab] = useState<'tracks'|'artists'>('tracks');
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackModalType, setTrackModalType] = useState<'add'|'edit'|'delete'|null>(null);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistModalType, setPlaylistModalType] = useState<'add'|'edit'|'delete'|'view'|null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [reportFilter, setReportFilter] = useState<'all'|'pending'|'resolved'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalType, setReportModalType] = useState<'add'|'edit'|'delete'|'view'|null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [settings, setSettings] = useState({ siteName: 'LoFi Music Cafe', apiKey: 'sk-xxxxxx', allowRegister: true });
  const [reportTypeFilter, setReportTypeFilter] = useState<'all'|'Copyright'|'Abuse'|'Spam'>('all');
  const [reportSearch, setReportSearch] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [settingsAlert, setSettingsAlert] = useState<string|null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string|null>(null);

  // USERS CRUD STATE
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userAlert, setUserAlert] = useState<string|null>(null);
  const [userError, setUserError] = useState<string|null>(null);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [userForm, setUserForm] = useState({ username: '', email: '', role: 'user', status: 'active', password: '' });

  const fetchUsers = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        params: { search: userSearch, page: userPage, limit: userLimit },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setUserTotal(res.data.total);
    } catch (err: any) {
      setUserError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [userSearch, userPage]);

  const handleUserFormChange = (e: any) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleUserSubmit = async (e: any) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError(null);
    try {
      const token = localStorage.getItem('token');
      if (modalType === 'add') {
        await axios.post(`${API_URL}/admin/users`, userForm, { headers: { Authorization: `Bearer ${token}` } });
        setUserAlert('User added successfully!');
      } else if (modalType === 'edit' && selectedUser) {
        await axios.put(`${API_URL}/admin/users/${selectedUser.id}`, userForm, { headers: { Authorization: `Bearer ${token}` } });
        setUserAlert('User updated!');
      }
      await fetchUsers();
      closeUserModal();
      setTimeout(()=>setUserAlert(null), 2000);
    } catch (err: any) {
      setUserError(err.response?.data?.error || 'Failed to save user');
    } finally {
      setUserLoading(false);
    }
  };
  const handleUserDelete = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUserAlert('User deleted!');
      await fetchUsers();
      closeUserModal();
      setTimeout(()=>setUserAlert(null), 2000);
    } catch (err: any) {
      setUserError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setUserLoading(false);
    }
  };
  const handleUserSuspend = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/users/${selectedUser.id}`, { ...selectedUser, status: selectedUser.status === 'active' ? 'suspended' : 'active' }, { headers: { Authorization: `Bearer ${token}` } });
      setUserAlert('User status updated!');
      await fetchUsers();
      closeUserModal();
      setTimeout(()=>setUserAlert(null), 2000);
    } catch (err: any) {
      setUserError(err.response?.data?.error || 'Failed to update user status');
    } finally {
      setUserLoading(false);
    }
  };
  const handleAddUser = () => {
    setSelectedUser(null);
    setModalType('add');
    setUserForm({ username: '', email: '', role: 'user', status: 'active', password: '' });
    setShowUserModal(true);
  };

  // ANALYTICS STATE
  const [analytics, setAnalytics] = useState({
    users: '0',
    tracks: '0',
    playlists: '0',
    reports: '0',
    listens: '0',
    uploads: '0'
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string|null>(null);

  // TRACKS CRUD STATE
  const [tracks, setTracks] = useState<any[]>([]);
  const [trackForm, setTrackForm] = useState({ title: '', artist: '', duration: '', status: 'active' });
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackAlert, setTrackAlert] = useState<string|null>(null);
  const [trackError, setTrackError] = useState<string|null>(null);
  const [trackTotal, setTrackTotal] = useState(0);
  const [trackPage, setTrackPage] = useState(1);
  const [trackLimit] = useState(10);

  const fetchTracks = async () => {
    setTrackLoading(true);
    setTrackError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/tracks`, {
        params: { search: '', page: trackPage, limit: trackLimit },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTracks(res.data.tracks);
      setTrackTotal(res.data.total);
    } catch (err: any) {
      setTrackError(err.response?.data?.error || 'Failed to fetch tracks');
    } finally {
      setTrackLoading(false);
    }
  };

  useEffect(() => { fetchTracks(); }, [trackPage]);

  const handleTrackFormChange = (e: any) => {
    setTrackForm({ ...trackForm, [e.target.name]: e.target.value });
  };
  const handleTrackSubmit = async (e: any) => {
    e.preventDefault();
    setTrackLoading(true);
    setTrackError(null);
    try {
      const token = localStorage.getItem('token');
      if (trackModalType === 'add') {
        await axios.post(`${API_URL}/admin/tracks`, trackForm, { headers: { Authorization: `Bearer ${token}` } });
        setTrackAlert('Track added successfully!');
      } else if (trackModalType === 'edit' && selectedTrack) {
        await axios.put(`${API_URL}/admin/tracks/${selectedTrack.id}`, trackForm, { headers: { Authorization: `Bearer ${token}` } });
        setTrackAlert('Track updated!');
      }
      await fetchTracks();
      closeTrackModal();
      setTimeout(()=>setTrackAlert(null), 2000);
    } catch (err: any) {
      setTrackError(err.response?.data?.error || 'Failed to save track');
    } finally {
      setTrackLoading(false);
    }
  };
  const handleTrackDelete = async () => {
    setTrackLoading(true);
    setTrackError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/tracks/${selectedTrack.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTrackAlert('Track deleted!');
      await fetchTracks();
      closeTrackModal();
      setTimeout(()=>setTrackAlert(null), 2000);
    } catch (err: any) {
      setTrackError(err.response?.data?.error || 'Failed to delete track');
    } finally {
      setTrackLoading(false);
    }
  };
  const handleAddTrack = () => {
    setSelectedTrack(null);
    setTrackModalType('add');
    setTrackForm({ title: '', artist: '', duration: '', status: 'active' });
    setShowTrackModal(true);
  };

  // PLAYLISTS CRUD STATE
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [playlistForm, setPlaylistForm] = useState({ name: '', tracks: 0, creator: '', status: 'public' });
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistAlert, setPlaylistAlert] = useState<string|null>(null);
  const [playlistError, setPlaylistError] = useState<string|null>(null);
  const [playlistTotal, setPlaylistTotal] = useState(0);
  const [playlistPage, setPlaylistPage] = useState(1);
  const [playlistLimit] = useState(10);

  const fetchPlaylists = async () => {
    setPlaylistLoading(true);
    setPlaylistError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/playlists`, {
        params: { search: '', page: playlistPage, limit: playlistLimit },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(res.data.playlists);
      setPlaylistTotal(res.data.total);
    } catch (err: any) {
      setPlaylistError(err.response?.data?.error || 'Failed to fetch playlists');
    } finally {
      setPlaylistLoading(false);
    }
  };

  useEffect(() => { fetchPlaylists(); }, [playlistPage]);

  const handlePlaylistFormChange = (e: any) => {
    const value = e.target.name === 'tracks' ? parseInt(e.target.value) || 0 : e.target.value;
    setPlaylistForm({ ...playlistForm, [e.target.name]: value });
  };
  const handlePlaylistSubmit = async (e: any) => {
    e.preventDefault();
    setPlaylistLoading(true);
    setPlaylistError(null);
    try {
      const token = localStorage.getItem('token');
      if (playlistModalType === 'add') {
        await axios.post(`${API_URL}/admin/playlists`, playlistForm, { headers: { Authorization: `Bearer ${token}` } });
        setPlaylistAlert('Playlist added successfully!');
      } else if (playlistModalType === 'edit' && selectedPlaylist) {
        await axios.put(`${API_URL}/admin/playlists/${selectedPlaylist.id}`, playlistForm, { headers: { Authorization: `Bearer ${token}` } });
        setPlaylistAlert('Playlist updated!');
      }
      await fetchPlaylists();
      closePlaylistModal();
      setTimeout(()=>setPlaylistAlert(null), 2000);
    } catch (err: any) {
      setPlaylistError(err.response?.data?.error || 'Failed to save playlist');
    } finally {
      setPlaylistLoading(false);
    }
  };
  const handlePlaylistDelete = async () => {
    setPlaylistLoading(true);
    setPlaylistError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/playlists/${selectedPlaylist.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPlaylistAlert('Playlist deleted!');
      await fetchPlaylists();
      closePlaylistModal();
      setTimeout(()=>setPlaylistAlert(null), 2000);
    } catch (err: any) {
      setPlaylistError(err.response?.data?.error || 'Failed to delete playlist');
    } finally {
      setPlaylistLoading(false);
    }
  };
  const handleAddPlaylist = () => {
    setSelectedPlaylist(null);
    setPlaylistModalType('add');
    setPlaylistForm({ name: '', tracks: 0, creator: '', status: 'public' });
    setShowPlaylistModal(true);
  };

  // REPORTS CRUD STATE
  const [reports, setReports] = useState<any[]>([]);
  const [reportForm, setReportForm] = useState({ type: 'Copyright', content: '', status: 'pending', user: '' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportAlert, setReportAlert] = useState<string|null>(null);
  const [reportError, setReportError] = useState<string|null>(null);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportPage, setReportPage] = useState(1);
  const [reportLimit] = useState(10);

  const fetchReports = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/reports`, {
        params: { search: reportSearch, page: reportPage, limit: reportLimit, type: reportTypeFilter, status: reportFilter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data.reports);
      setReportTotal(res.data.total);
    } catch (err: any) {
      setReportError(err.response?.data?.error || 'Failed to fetch reports');
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [reportSearch, reportPage, reportTypeFilter, reportFilter]);

  const handleReportFormChange = (e: any) => {
    setReportForm({ ...reportForm, [e.target.name]: e.target.value });
  };
  const handleReportSubmit = async (e: any) => {
    e.preventDefault();
    setReportLoading(true);
    setReportError(null);
    try {
      const token = localStorage.getItem('token');
      if (reportModalType === 'add') {
        await axios.post(`${API_URL}/admin/reports`, reportForm, { headers: { Authorization: `Bearer ${token}` } });
        setReportAlert('Report added successfully!');
      } else if (reportModalType === 'edit' && selectedReport) {
        await axios.put(`${API_URL}/admin/reports/${selectedReport.id}`, reportForm, { headers: { Authorization: `Bearer ${token}` } });
        setReportAlert('Report updated!');
      }
      await fetchReports();
      closeReportModal();
      setTimeout(()=>setReportAlert(null), 2000);
    } catch (err: any) {
      setReportError(err.response?.data?.error || 'Failed to save report');
    } finally {
      setReportLoading(false);
    }
  };
  const handleReportDelete = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/reports/${selectedReport.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setReportAlert('Report deleted!');
      await fetchReports();
      closeReportModal();
      setTimeout(()=>setReportAlert(null), 2000);
    } catch (err: any) {
      setReportError(err.response?.data?.error || 'Failed to delete report');
    } finally {
      setReportLoading(false);
    }
  };
  const handleAddReport = () => {
    setSelectedReport(null);
    setReportModalType('add');
    setReportForm({ type: 'Copyright', content: '', status: 'pending', user: '' });
    setShowReportModal(true);
  };

  // SETTINGS CRUD STATE
  const fetchSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data);
    } catch (err: any) {
      setSettingsError(err.response?.data?.error || 'Failed to fetch settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err: any) {
      setAnalyticsError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => { 
    fetchSettings(); 
    fetchAnalytics();
  }, []);

  const handleSettingsChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsSubmit = async (e: any) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettingsAlert('Settings saved successfully!');
      setTimeout(() => setSettingsAlert(null), 2000);
    } catch (err: any) {
      setSettingsError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'content', name: 'Content', icon: Music },
    { id: 'playlists', name: 'Playlists', icon: Play },
    { id: 'reports', name: 'Reports', icon: Flag },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'cloud', name: 'Cloud', icon: Cloud },
  ];

  const stats = [
    { name: 'Total Users', value: '12,847', change: '+12%', icon: Users },
    { name: 'Active Users', value: '8,234', change: '+8%', icon: UserCheck },
    { name: 'Total Tracks', value: '2,456', change: '+15%', icon: Music },
    { name: 'Total Playlists', value: '1,234', change: '+23%', icon: Play },
    { name: 'Pending Reports', value: '23', change: '-5%', icon: AlertTriangle },
    { name: 'System Health', value: '98%', change: '+2%', icon: CheckCircle },
  ];

  const mockArtists = [
    { id: 'a1', name: 'LoFi Artist', tracks: 12, status: 'active' },
    { id: 'a2', name: 'Dreamer', tracks: 8, status: 'active' },
    { id: 'a3', name: 'Rainy', tracks: 5, status: 'inactive' },
  ];

  const mockPlaylists = [
    { id: 'p1', name: 'Morning Chill', tracks: 12, creator: 'admin', status: 'public' },
    { id: 'p2', name: 'Study Beats', tracks: 8, creator: 'user1', status: 'private' },
    { id: 'p3', name: 'Night Drive', tracks: 15, creator: 'user2', status: 'public' },
  ];

  const mockReports = [
    { id: 'r1', type: 'Copyright', content: 'Track violates copyright', status: 'pending', created: '2 hours ago', user: 'user1' },
    { id: 'r2', type: 'Abuse', content: 'Inappropriate content', status: 'resolved', created: '1 day ago', user: 'user2' },
    { id: 'r3', type: 'Spam', content: 'Spam content detected', status: 'pending', created: '3 hours ago', user: 'user3' },
  ];

  const mockAnalytics = {
    users: '12,847',
    tracks: '2,456',
    playlists: '1,234',
    listens: '45,678',
    uploads: '89',
    active: '8,234'
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.content.toLowerCase().includes(reportSearch.toLowerCase()) || 
                         (r.user && r.user.toLowerCase().includes(reportSearch.toLowerCase()));
    const matchesType = reportTypeFilter === 'all' || r.type === reportTypeFilter;
    const matchesStatus = reportFilter === 'all' || r.status === reportFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUserAction = (user: any, type: 'edit'|'delete'|'suspend') => {
    setSelectedUser(user);
    setModalType(type);
    if (type === 'edit') {
      setUserForm({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active',
        password: ''
      });
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setModalType(null);
    setUserForm({ username: '', email: '', role: 'user', status: 'active', password: '' });
  };

  const handleTrackAction = (track: any, type: 'edit'|'delete') => {
    setSelectedTrack(track);
    setTrackModalType(type);
    if (type === 'edit') {
      setTrackForm({
        title: track.title || '',
        artist: track.artist || '',
        duration: track.duration?.toString() || '',
        status: track.status || 'active'
      });
    }
    setShowTrackModal(true);
  };
  const closeTrackModal = () => {
    setShowTrackModal(false);
    setSelectedTrack(null);
    setTrackModalType(null);
    setTrackForm({ title: '', artist: '', duration: '', status: 'active' });
  };

  const handlePlaylistAction = (playlist: any, type: 'edit'|'delete'|'view') => {
    setSelectedPlaylist(playlist);
    setPlaylistModalType(type);
    if (type === 'edit') {
      setPlaylistForm({
        name: playlist.name || '',
        tracks: playlist.tracks || 0,
        creator: playlist.creator || '',
        status: playlist.status || 'public'
      });
    }
    setShowPlaylistModal(true);
  };
  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
    setSelectedPlaylist(null);
    setPlaylistModalType(null);
    setPlaylistForm({ name: '', tracks: 0, creator: '', status: 'public' });
  };

  const handleReportAction = (report: any, type: 'edit'|'delete'|'view') => {
    setSelectedReport(report);
    setReportModalType(type);
    if (type === 'edit') {
      setReportForm({
        type: report.type || 'Copyright',
        content: report.content || '',
        status: report.status || 'pending',
        user: report.user || ''
      });
    }
    setShowReportModal(true);
  };
  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
    setReportModalType(null);
    setReportForm({ type: 'Copyright', content: '', status: 'pending', user: '' });
  };

  const handleResolveReport = () => {
    // Xử lý logic đánh dấu đã xử lý và lưu ghi chú (mock)
    closeReportModal();
    setReportNote('');
  };
  const handleDeleteReport = () => {
    // Xử lý logic xóa report (mock)
    closeReportModal();
    setReportNote('');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="flex items-center">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registration: john@example.com</span>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New playlist created: "Chill Vibes"</span>
              <span className="text-xs text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Content report submitted</span>
              <span className="text-xs text-gray-400">6 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System backup completed</span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border rounded px-3 py-1 text-sm w-full md:w-64"
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />
          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={handleAddUser}>+ Add User</button>
        </div>
      </div>
      {userAlert && <div className="p-2 bg-green-50 text-green-700 text-sm text-center">{userAlert}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.filter(u =>
              u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
              u.email.toLowerCase().includes(userSearch.toLowerCase())
            ).map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{user.username.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === UserRole.ADMIN
                      ? 'bg-red-100 text-red-800'
                      : user.role === UserRole.MODERATOR
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === UserStatus.ACTIVE
                      ? 'bg-green-100 text-green-800'
                      : user.status === UserStatus.SUSPENDED
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => handleUserAction(user, 'edit')}>Edit</button>
                  <button className="text-yellow-600 hover:text-yellow-900" onClick={() => handleUserAction(user, 'suspend')}>{user.status === UserStatus.ACTIVE ? 'Suspend' : 'Activate'}</button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleUserAction(user, 'delete')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal xác nhận và chỉnh sửa user */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {modalType === 'add' && 'Add User'}
              {modalType === 'edit' && 'Edit User'}
              {modalType === 'delete' && 'Delete User'}
              {modalType === 'suspend' && (selectedUser?.status === UserStatus.ACTIVE ? 'Suspend User' : 'Activate User')}
            </h3>
            {(modalType === 'add' || modalType === 'edit') && (
              <form className="space-y-4" onSubmit={handleUserSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input name="username" className="w-full border rounded px-3 py-1" value={userForm.username} onChange={handleUserFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input name="email" className="w-full border rounded px-3 py-1" value={userForm.email} onChange={handleUserFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select name="role" className="w-full border rounded px-3 py-1" value={userForm.role} onChange={handleUserFormChange}>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeUserModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={userLoading}>{userLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            )}
            {modalType === 'delete' && (
              <>
                <p>Bạn có chắc chắn muốn <span className="font-bold text-red-600">xóa</span> user <span className="font-semibold">{selectedUser?.username}</span> không?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeUserModal}>Cancel</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleUserDelete} disabled={userLoading}>{userLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
              </>
            )}
            {modalType === 'suspend' && (
              <>
                <p>Bạn có chắc chắn muốn {selectedUser?.status === UserStatus.ACTIVE ? <span className="font-bold text-yellow-600">khóa</span> : <span className="font-bold text-green-600">mở khóa</span>} user <span className="font-semibold">{selectedUser?.username}</span> không?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeUserModal}>Cancel</button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded" onClick={handleUserSuspend} disabled={userLoading}>{userLoading ? 'Processing...' : (selectedUser?.status === UserStatus.ACTIVE ? 'Suspend' : 'Activate')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Content Management</h3>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${contentTab==='tracks'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}
              onClick={()=>setContentTab('tracks')}
            >Tracks</button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${contentTab==='artists'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}
              onClick={()=>setContentTab('artists')}
            >Artists</button>
          </div>
        </div>
        {contentTab==='tracks' ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total: {tracks.length} tracks</span>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={handleAddTrack}>+ Add Track</button>
            </div>
            {trackAlert && <div className="p-2 bg-green-50 text-green-700 text-sm text-center">{trackAlert}</div>}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tracks.map(track => (
                  <tr key={track.id}>
                    <td className="px-4 py-2">{track.title}</td>
                    <td className="px-4 py-2">{track.artist}</td>
                    <td className="px-4 py-2">{track.duration}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${track.status==='active'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-500'}`}>{track.status}</span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => handleTrackAction(track, 'edit')}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleTrackAction(track, 'delete')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Modal thêm/sửa/xóa track */}
            {showTrackModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">
                    {trackModalType==='add' && 'Add Track'}
                    {trackModalType==='edit' && 'Edit Track'}
                    {trackModalType==='delete' && 'Delete Track'}
                  </h3>
                  {(trackModalType==='add'||trackModalType==='edit') && (
                    <form className="space-y-4" onSubmit={handleTrackSubmit}>
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input name="title" className="w-full border rounded px-3 py-1" value={trackForm.title} onChange={handleTrackFormChange} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Artist</label>
                        <input name="artist" className="w-full border rounded px-3 py-1" value={trackForm.artist} onChange={handleTrackFormChange} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <input name="duration" className="w-full border rounded px-3 py-1" value={trackForm.duration} onChange={handleTrackFormChange} required />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeTrackModal}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={trackLoading}>{trackLoading ? 'Saving...' : 'Save'}</button>
                      </div>
                    </form>
                  )}
                  {trackModalType==='delete' && (
                    <div>
                      <p>Bạn có chắc chắn muốn <span className="font-bold text-red-600">xóa</span> track <span className="font-semibold">{selectedTrack?.title}</span> không?</p>
                      <div className="flex justify-end gap-2 mt-6">
                        <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeTrackModal}>Cancel</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleTrackDelete} disabled={trackLoading}>{trackLoading ? 'Deleting...' : 'Delete'}</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total: {mockArtists.length} artists</span>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">+ Add Artist</button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tracks</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockArtists.map(artist => (
                  <tr key={artist.id}>
                    <td className="px-4 py-2">{artist.name}</td>
                    <td className="px-4 py-2">{artist.tracks}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${artist.status==='active'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-500'}`}>{artist.status}</span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Playlist Management</h3>
        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={handleAddPlaylist}>+ Add Playlist</button>
      </div>
      <div className="overflow-x-auto">
        {playlistAlert && <div className="p-2 bg-green-50 text-green-700 text-sm text-center">{playlistAlert}</div>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tracks</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playlists.map(pl => (
              <tr key={pl.id}>
                <td className="px-4 py-2">{pl.name}</td>
                <td className="px-4 py-2">{pl.tracks}</td>
                <td className="px-4 py-2">{pl.creator}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pl.status==='public'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-500'}`}>{pl.status}</span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => handlePlaylistAction(pl, 'view')}>View</button>
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => handlePlaylistAction(pl, 'edit')}>Edit</button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handlePlaylistAction(pl, 'delete')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal xem/sửa/xóa playlist */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {playlistModalType==='add' && 'Add Playlist'}
              {playlistModalType==='view' && 'Playlist Details'}
              {playlistModalType==='edit' && 'Edit Playlist'}
              {playlistModalType==='delete' && 'Delete Playlist'}
            </h3>
            {(playlistModalType==='add'||playlistModalType==='edit') && (
              <form className="space-y-4" onSubmit={handlePlaylistSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input name="name" className="w-full border rounded px-3 py-1" value={playlistForm.name} onChange={handlePlaylistFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tracks</label>
                  <input name="tracks" type="number" className="w-full border rounded px-3 py-1" value={playlistForm.tracks} onChange={handlePlaylistFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Creator</label>
                  <input name="creator" className="w-full border rounded px-3 py-1" value={playlistForm.creator} onChange={handlePlaylistFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" className="w-full border rounded px-3 py-1" value={playlistForm.status} onChange={handlePlaylistFormChange}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closePlaylistModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={playlistLoading}>{playlistLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            )}
            {playlistModalType==='view' && (
              <div>
                <p><b>Name:</b> {selectedPlaylist?.name}</p>
                <p><b>Tracks:</b> {selectedPlaylist?.tracks}</p>
                <p><b>Creator:</b> {selectedPlaylist?.creator}</p>
                <p><b>Status:</b> {selectedPlaylist?.status}</p>
                <div className="flex justify-end mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closePlaylistModal}>Close</button>
                </div>
              </div>
            )}
            {playlistModalType==='delete' && (
              <div>
                <p>Bạn có chắc chắn muốn <span className="font-bold text-red-600">xóa</span> playlist <span className="font-semibold">{selectedPlaylist?.name}</span> không?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closePlaylistModal}>Cancel</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handlePlaylistDelete} disabled={playlistLoading}>{playlistLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">Reports Management</h3>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={handleAddReport}>+ Add Report</button>
          <input
            type="text"
            placeholder="Search content or user..."
            className="border rounded px-2 py-1 text-sm"
            value={reportSearch}
            onChange={e=>setReportSearch(e.target.value)}
          />
          <select className="border rounded px-2 py-1 text-sm" value={reportTypeFilter} onChange={e=>setReportTypeFilter(e.target.value as any)}>
            <option value="all">All Types</option>
            <option value="Copyright">Copyright</option>
            <option value="Abuse">Abuse</option>
            <option value="Spam">Spam</option>
          </select>
          <select className="border rounded px-2 py-1 text-sm" value={reportFilter} onChange={e=>setReportFilter(e.target.value as any)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        {reportAlert && <div className="p-2 bg-green-50 text-green-700 text-sm text-center">{reportAlert}</div>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-2">{r.type}</td>
                <td className="px-4 py-2">{r.content}</td>
                <td className="px-4 py-2">{r.user}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status==='pending'?'bg-yellow-100 text-yellow-800':'bg-green-100 text-green-800'}`}>{r.status}</span>
                </td>
                <td className="px-4 py-2">{r.created}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => handleReportAction(r, 'view')}>View</button>
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => handleReportAction(r, 'edit')}>Edit</button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleReportAction(r, 'delete')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal xem/resolve report */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {reportModalType==='add' && 'Add Report'}
              {reportModalType==='view' && 'Report Details'}
              {reportModalType==='edit' && 'Edit Report'}
              {reportModalType==='delete' && 'Delete Report'}
            </h3>
            {(reportModalType==='add'||reportModalType==='edit') && (
              <form className="space-y-4" onSubmit={handleReportSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select name="type" className="w-full border rounded px-3 py-1" value={reportForm.type} onChange={handleReportFormChange}>
                    <option value="Copyright">Copyright</option>
                    <option value="Abuse">Abuse</option>
                    <option value="Spam">Spam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea name="content" className="w-full border rounded px-3 py-1" rows={3} value={reportForm.content} onChange={handleReportFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">User</label>
                  <input name="user" className="w-full border rounded px-3 py-1" value={reportForm.user} onChange={handleReportFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" className="w-full border rounded px-3 py-1" value={reportForm.status} onChange={handleReportFormChange}>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeReportModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={reportLoading}>{reportLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            )}
            {reportModalType==='view' && (
              <div>
                <p><b>Type:</b> {selectedReport.type}</p>
                <p><b>Content:</b> {selectedReport.content}</p>
                <p><b>User:</b> {selectedReport.user}</p>
                <p><b>Status:</b> {selectedReport.status}</p>
                <p><b>Created:</b> {selectedReport.created}</p>
                {/* Thông tin liên quan */}
                {selectedReport.type==='Copyright' && <div className="mt-2 text-sm text-gray-600">Related Track: <span className="font-semibold">Chill Vibes</span></div>}
                {selectedReport.type==='Abuse' && <div className="mt-2 text-sm text-gray-600">Related User: <span className="font-semibold">{selectedReport.user}</span></div>}
                {selectedReport.type==='Spam' && <div className="mt-2 text-sm text-gray-600">Related Track: <span className="font-semibold">Night Drive</span></div>}
                {/* Ghi chú xử lý */}
                {selectedReport.status==='pending' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Xử lý/Ghi chú</label>
                    <textarea className="w-full border rounded px-3 py-1" rows={2} value={reportNote} onChange={e=>setReportNote(e.target.value)} placeholder="Nhập ghi chú xử lý..." />
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeReportModal}>Close</button>
                  {selectedReport.status==='pending' && <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleResolveReport}>Mark as Resolved</button>}
                </div>
              </div>
            )}
            {reportModalType==='delete' && (
              <div>
                <p>Bạn có chắc chắn muốn <span className="font-bold text-red-600">xóa</span> report <span className="font-semibold">{selectedReport.type}</span> không?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeReportModal}>Cancel</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleReportDelete} disabled={reportLoading}>{reportLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics Dashboard</h3>
      {analyticsLoading && <div className="text-center py-4">Loading analytics...</div>}
      {analyticsError && <div className="p-2 bg-red-50 text-red-700 text-sm text-center mb-4">{analyticsError}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-700 mb-1">{analytics.users}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-700 mb-1">{analytics.tracks}</div>
          <div className="text-gray-600">Tracks</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-700 mb-1">{analytics.playlists}</div>
          <div className="text-gray-600">Playlists</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-700 mb-1">{analytics.listens}</div>
          <div className="text-gray-600">Listens</div>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-pink-700 mb-1">{analytics.uploads}</div>
          <div className="text-gray-600">Uploads</div>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-teal-700 mb-1">{analytics.reports}</div>
          <div className="text-gray-600">Pending Reports</div>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Coming soon: Charts & Trends</h4>
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-lg mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-6">System Settings</h3>
      {settingsAlert && <div className="p-2 bg-green-50 text-green-700 text-sm text-center mb-4">{settingsAlert}</div>}
      {settingsError && <div className="p-2 bg-red-50 text-red-700 text-sm text-center mb-4">{settingsError}</div>}
      <form className="space-y-4" onSubmit={handleSettingsSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input name="siteName" className="w-full border rounded px-3 py-1" value={settings.siteName} onChange={handleSettingsChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input name="apiKey" className="w-full border rounded px-3 py-1" value={settings.apiKey} onChange={handleSettingsChange} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="allowRegister" checked={settings.allowRegister} onChange={handleSettingsChange} />
          <label className="text-sm">Allow User Registration</label>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={settingsLoading}>{settingsLoading ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </form>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return renderContent();
      case 'playlists':
        return renderPlaylists();
      case 'reports':
        return renderReports();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      case 'cloud':
        return <CloudinaryManager />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg max-w-7xl w-full h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200">
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 