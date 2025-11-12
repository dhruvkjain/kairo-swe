import React, { useState } from 'react';
import Recruiter_PostInternshipModel from './Recruiter_PostInternshipModel';

import {
  LayoutDashboard, Briefcase, Users, MessageSquare, Calendar,
  BarChart3, Settings, Bell, Search, Plus, Filter, Download,
  Eye, Edit2, Trash2, MoreVertical, TrendingUp, TrendingDown,
  Clock, MapPin, DollarSign, X, ChevronDown, FileText, Mail,
  Phone, Linkedin, ExternalLink, CheckCircle, XCircle, User,
  Building2, GraduationCap, Award
} from 'lucide-react';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);


  // Mock data
  const dashboardStats = [
    { label: 'Active Internships', value: '12', change: '+2', trend: 'up', icon: Briefcase },
    { label: 'Total Applicants', value: '248', change: '+18', trend: 'up', icon: Users },
    { label: 'Shortlisted', value: '45', change: '+8', trend: 'up', icon: CheckCircle },
    { label: 'Interviews Scheduled', value: '15', change: '-3', trend: 'down', icon: Calendar },
  ];

  const internships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      location: 'Remote',
      type: 'Full-time',
      stipend: '₹15,000/month',
      duration: '6 months',
      applicants: 45,
      views: 234,
      status: 'Active',
      postedDate: '2024-11-01',
      deadline: '2024-12-01'
    },
    {
      id: 2,
      title: 'Backend Developer Intern',
      location: 'Bangalore',
      type: 'Full-time',
      stipend: '₹18,000/month',
      duration: '6 months',
      applicants: 38,
      views: 189,
      status: 'Active',
      postedDate: '2024-10-28',
      deadline: '2024-11-28'
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      location: 'Hybrid',
      type: 'Part-time',
      stipend: '₹12,000/month',
      duration: '3 months',
      applicants: 52,
      views: 301,
      status: 'Paused',
      postedDate: '2024-10-25',
      deadline: '2024-11-25'
    },
  ];

  const applicants = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      college: 'IIT Delhi',
      course: 'B.Tech CSE',
      year: '3rd Year',
      cgpa: '8.9',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      experience: '2 Internships',
      appliedFor: 'Frontend Developer Intern',
      appliedDate: '2024-11-10',
      status: 'Shortlisted',
      resumeUrl: '#'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul.v@email.com',
      phone: '+91 98123 45678',
      college: 'NIT Trichy',
      course: 'B.Tech IT',
      year: '4th Year',
      cgpa: '8.5',
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
      experience: '1 Internship',
      appliedFor: 'Backend Developer Intern',
      appliedDate: '2024-11-09',
      status: 'Applied',
      resumeUrl: '#'
    },
    {
      id: 3,
      name: 'Sneha Patel',
      email: 'sneha.p@email.com',
      phone: '+91 99887 76655',
      college: 'BITS Pilani',
      course: 'B.Des',
      year: '3rd Year',
      cgpa: '9.1',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      experience: '3 Projects',
      appliedFor: 'UI/UX Design Intern',
      appliedDate: '2024-11-08',
      status: 'Interview',
      resumeUrl: '#'
    },
  ];

  const notifications = [
    { id: 1, text: 'New application for Frontend Developer Intern', time: '5 min ago', unread: true },
    { id: 2, text: 'Interview scheduled with Priya Sharma', time: '1 hour ago', unread: true },
    { id: 3, text: 'Deadline approaching for Backend Developer Intern', time: '2 hours ago', unread: false },
  ];

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kairo</h1>
            <p className="text-xs text-gray-500">Recruiter Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'internships', label: 'Internships', icon: Briefcase },
          { id: 'applicants', label: 'Applicants', icon: Users },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Tech Corp Inc.</p>
            <p className="text-xs text-gray-500 truncate">recruiter@techcorp.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-3 ml-64 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search internships, applicants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Post Internship</span>
          </button>

        </div>
      </div>

      {showNotifications && (
        <div className="absolute right-6 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notif.unread ? 'bg-blue-50' : ''
              }`}>
                <p className="text-sm text-gray-900">{notif.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${
                stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applicants</h3>
          <div className="space-y-3">
            {applicants.slice(0, 3).map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedApplicant(applicant)}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{applicant.name}</p>
                    <p className="text-xs text-gray-500">{applicant.appliedFor}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  applicant.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                  applicant.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {applicant.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Internships</h3>
          <div className="space-y-3">
            {internships.filter(i => i.status === 'Active').slice(0, 3).map((internship) => (
              <div key={internship.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{internship.title}</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {internship.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{internship.applicants} applicants</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{internship.views} views</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InternshipsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Internships</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Internship</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stipend</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Applicants</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {internships.map((internship) => (
              <tr key={internship.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{internship.title}</p>
                    <p className="text-xs text-gray-500">{internship.duration} • {internship.type}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{internship.location}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{internship.stipend}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{internship.applicants}</span>
                    <span className="text-xs text-gray-500">({internship.views} views)</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    internship.status === 'Active' ? 'bg-green-100 text-green-700' :
                    internship.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {internship.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ApplicantsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Applicants</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option>All Internships</option>
            <option>Frontend Developer Intern</option>
            <option>Backend Developer Intern</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option>All Status</option>
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Interview</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedApplicant(applicant)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      applicant.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                      applicant.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                      applicant.status === 'Applied' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {applicant.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{applicant.appliedFor}</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{applicant.college}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Award className="w-3.5 h-3.5" />
                      <span>CGPA: {applicant.cgpa}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{applicant.email}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Applied {applicant.appliedDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {applicant.skills.length > 4 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        +{applicant.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800">
                  View Profile
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50">
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Applicant Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{applicant.name}</h3>
                <p className="text-gray-600 mb-2">{applicant.course} • {applicant.year}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{applicant.college}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>CGPA: {applicant.cgpa}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href={`mailto:${applicant.email}`} className="flex items-center space-x-1 text-blue-600 hover:underline">
                    <Mail className="w-4 h-4" />
                    <span>{applicant.email}</span>
                  </a>
                  <a href={`tel:${applicant.phone}`} className="flex items-center space-x-1 text-blue-600 hover:underline">
                    <Phone className="w-4 h-4" />
                    <span>{applicant.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Applied For</h4>
              <p className="text-gray-700">{applicant.appliedFor}</p>
              <p className="text-sm text-gray-500 mt-1">Applied on {applicant.appliedDate}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
              <p className="text-gray-700">{applicant.experience}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                applicant.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                applicant.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                applicant.status === 'Applied' ? 'bg-gray-100 text-gray-700' :
                'bg-red-100 text-red-700'
              }`}>
                {applicant.status}
              </span>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Shortlist</span>
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>

            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'internships' && <InternshipsView />}
          {activeTab === 'applicants' && <ApplicantsView />}
          {activeTab === 'messages' && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600">Communication module coming soon</p>
            </div>
          )}
          {activeTab === 'interviews' && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interviews</h3>
              <p className="text-gray-600">Interview scheduling module coming soon</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600">Analytics dashboard coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" defaultValue="Tech Corp Inc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" defaultValue="recruiter@techcorp.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input type="url" defaultValue="https://techcorp.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Company</label>
                    <textarea rows="4" defaultValue="Tech Corp Inc. is a leading technology company..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"></textarea>
                  </div>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </main>
        {showPostModal && (
          <Recruiter_PostInternshipModel onClose={() => setShowPostModal(false)} />
        )}
      </div>

      {selectedApplicant && (
        <ApplicantModal applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
      )}
      

    </div>
  );
};

export default RecruiterDashboard;