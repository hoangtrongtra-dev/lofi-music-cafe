import React, { useState, useEffect } from 'react';
import { Flag, AlertTriangle, CheckCircle, XCircle, Clock, User, Music } from 'lucide-react';

interface Report {
  id: string;
  type: 'inappropriate' | 'copyright' | 'spam' | 'other';
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  reportedContent: {
    type: 'track' | 'playlist' | 'user' | 'comment';
    id: string;
    title: string;
    description?: string;
  };
  reason: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolution?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ReportsControllerProps {
  onClose: () => void;
}

const ReportsController: React.FC<ReportsControllerProps> = ({ onClose }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<Report['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Report['type'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Report['priority'] | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock reports data
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        type: 'inappropriate',
        status: 'pending',
        priority: 'high',
        reporter: {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        reportedContent: {
          type: 'track',
          id: 'track1',
          title: 'Inappropriate Track Title',
          description: 'This track contains inappropriate content'
        },
        reason: 'Inappropriate content',
        description: 'This track contains explicit lyrics that are not suitable for our platform.',
        createdAt: new Date('2024-02-05T10:30:00'),
        updatedAt: new Date('2024-02-05T10:30:00')
      },
      {
        id: '2',
        type: 'copyright',
        status: 'reviewed',
        priority: 'urgent',
        reporter: {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        reportedContent: {
          type: 'track',
          id: 'track2',
          title: 'Copyrighted Music',
          description: 'This track violates copyright laws'
        },
        reason: 'Copyright violation',
        description: 'This track appears to be a direct copy of a copyrighted song without permission.',
        createdAt: new Date('2024-02-04T15:45:00'),
        updatedAt: new Date('2024-02-05T09:15:00'),
        assignedTo: 'admin1',
        resolution: 'Track removed due to copyright violation'
      },
      {
        id: '3',
        type: 'spam',
        status: 'resolved',
        priority: 'medium',
        reporter: {
          id: 'user3',
          name: 'Bob Johnson',
          email: 'bob@example.com'
        },
        reportedContent: {
          type: 'playlist',
          id: 'playlist1',
          title: 'Spam Playlist',
          description: 'This playlist contains spam content'
        },
        reason: 'Spam content',
        description: 'This playlist contains multiple tracks with spam-like titles and descriptions.',
        createdAt: new Date('2024-02-03T12:20:00'),
        updatedAt: new Date('2024-02-04T14:30:00'),
        assignedTo: 'moderator1',
        resolution: 'Playlist removed and user warned'
      },
      {
        id: '4',
        type: 'other',
        status: 'dismissed',
        priority: 'low',
        reporter: {
          id: 'user4',
          name: 'Alice Brown',
          email: 'alice@example.com'
        },
        reportedContent: {
          type: 'user',
          id: 'user5',
          title: 'Suspicious User',
          description: 'This user has suspicious activity'
        },
        reason: 'Suspicious activity',
        description: 'This user has been creating multiple accounts and posting similar content.',
        createdAt: new Date('2024-02-02T08:15:00'),
        updatedAt: new Date('2024-02-03T11:45:00'),
        assignedTo: 'admin1',
        resolution: 'No violation found, report dismissed'
      }
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);
    setIsLoading(false);
  }, []);

  // Filter reports
  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, typeFilter, priorityFilter]);

  const handleStatusChange = async (reportId: string, newStatus: Report['status']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date() } : report
      ));
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleAssignReport = async (reportId: string, assignedTo: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, assignedTo, updatedAt: new Date() } : report
      ));
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'inappropriate':
        return 'bg-red-100 text-red-800';
      case 'copyright':
        return 'bg-orange-100 text-orange-800';
      case 'spam':
        return 'bg-purple-100 text-purple-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
              <p className="text-sm text-gray-600">Review and manage user reports</p>
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

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Report['status'] | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as Report['type'] | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="copyright">Copyright</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Report['priority'] | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.reportedContent.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.reportedContent.type} • {report.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(report.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.reporter.name}</div>
                        <div className="text-sm text-gray-500">{report.reporter.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(report.id, 'reviewed')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleStatusChange(report.id, 'dismissed')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsController; 