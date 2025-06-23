import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Clock, 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Building2,
  UserPlus,
  FolderPlus,
  ClipboardList,
  BarChart3,
  Mail,
  Save,
  X
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

// Types
interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'staff';
  name: string;
  email: string;
  department: string;
  manager?: string;
}

interface Department {
  id: string;
  name: string;
  manager: string;
  tasks: string[];
}

interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'wfh';
  checkIn?: string;
  checkOut?: string;
}

interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface TaskEntry {
  task: string;
  description: string;
  hours: number;
}

interface DailyReport {
  id: string;
  userId: string;
  date: string;
  tasks: TaskEntry[];
  submittedAt: string;
}

interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  dailyReports: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
}

// Initial data
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@mgegroup.com',
    department: 'Management'
  },
  {
    id: '2',
    username: 'john',
    password: 'john123',
    role: 'staff',
    name: 'John Doe',
    email: 'john@mgegroup.com',
    department: 'Development',
    manager: 'Admin User'
  },
  {
    id: '3',
    username: 'jane',
    password: 'jane123',
    role: 'staff',
    name: 'Jane Smith',
    email: 'jane@mgegroup.com',
    department: 'Design',
    manager: 'Admin User'
  }
];

const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Development',
    manager: 'Admin User',
    tasks: ['Frontend Development', 'Backend Development', 'Database Design', 'Testing', 'Code Review']
  },
  {
    id: '2',
    name: 'Design',
    manager: 'Admin User',
    tasks: ['UI Design', 'UX Research', 'Prototyping', 'Brand Design', 'User Testing']
  },
  {
    id: '3',
    name: 'Marketing',
    manager: 'Admin User',
    tasks: ['Content Creation', 'Social Media', 'SEO', 'Email Marketing', 'Analytics']
  }
];

// Login Component
const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(initialUsers));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">MGE GROUP</h1>
          <p className="text-white/80 text-lg">Staff Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm text-center mb-4">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/90 font-medium">Admin</p>
                <p className="text-white/70">admin / admin123</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/90 font-medium">Staff</p>
                <p className="text-white/70">john / john123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2024 MGE GROUP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// Staff Dashboard Component
const StaffDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Daily report form state
  const [reportTasks, setReportTasks] = useState<TaskEntry[]>([{ task: '', description: '', hours: 0 }]);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load data from localStorage
    const storedAttendance = localStorage.getItem('attendanceRecords');
    const storedLeaveRequests = localStorage.getItem('leaveRequests');
    const storedDailyReports = localStorage.getItem('dailyReports');
    const storedWeeklyReports = localStorage.getItem('weeklyReports');
    const storedDepartments = localStorage.getItem('departments');
    const storedUsers = localStorage.getItem('users');

    if (storedAttendance) setAttendanceRecords(JSON.parse(storedAttendance));
    if (storedLeaveRequests) setLeaveRequests(JSON.parse(storedLeaveRequests));
    if (storedDailyReports) setDailyReports(JSON.parse(storedDailyReports));
    if (storedWeeklyReports) setWeeklyReports(JSON.parse(storedWeeklyReports));
    if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
    else setDepartments(initialDepartments);
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else setUsers(initialUsers);
  }, []);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCheckIn = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingRecord = attendanceRecords.find(
      record => record.userId === user.id && record.date === today
    );

    if (existingRecord) {
      alert('You have already checked in today!');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      userId: user.id,
      date: today,
      status: 'present',
      checkIn: format(new Date(), 'HH:mm:ss')
    };

    const updatedRecords = [...attendanceRecords, newRecord];
    setAttendanceRecords(updatedRecords);
    saveToLocalStorage('attendanceRecords', updatedRecords);
  };

  const handleCheckOut = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingRecord = attendanceRecords.find(
      record => record.userId === user.id && record.date === today
    );

    if (!existingRecord) {
      alert('You need to check in first!');
      return;
    }

    if (existingRecord.checkOut) {
      alert('You have already checked out today!');
      return;
    }

    const updatedRecords = attendanceRecords.map(record =>
      record.id === existingRecord.id
        ? { ...record, checkOut: format(new Date(), 'HH:mm:ss') }
        : record
    );

    setAttendanceRecords(updatedRecords);
    saveToLocalStorage('attendanceRecords', updatedRecords);
  };

  const handleWFH = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingRecord = attendanceRecords.find(
      record => record.userId === user.id && record.date === today
    );

    if (existingRecord) {
      alert('You have already marked attendance for today!');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      userId: user.id,
      date: today,
      status: 'wfh'
    };

    const updatedRecords = [...attendanceRecords, newRecord];
    setAttendanceRecords(updatedRecords);
    saveToLocalStorage('attendanceRecords', updatedRecords);
  };

  const addTaskEntry = () => {
    setReportTasks([...reportTasks, { task: '', description: '', hours: 0 }]);
  };

  const removeTaskEntry = (index: number) => {
    if (reportTasks.length > 1) {
      setReportTasks(reportTasks.filter((_, i) => i !== index));
    }
  };

  const updateTaskEntry = (index: number, field: keyof TaskEntry, value: string | number) => {
    const updatedTasks = reportTasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    );
    setReportTasks(updatedTasks);
  };

  const handleSubmitDailyReport = (e: React.FormEvent) => {
    e.preventDefault();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Validate that all tasks have required fields
    const isValid = reportTasks.every(task => task.task && task.description && task.hours > 0);
    if (!isValid) {
      alert('Please fill in all task fields');
      return;
    }

    const existingReport = dailyReports.find(
      report => report.userId === user.id && report.date === today
    );

    if (existingReport) {
      alert('You have already submitted a report for today!');
      return;
    }

    const newReport: DailyReport = {
      id: Date.now().toString(),
      userId: user.id,
      date: today,
      tasks: reportTasks,
      submittedAt: new Date().toISOString()
    };

    const updatedReports = [...dailyReports, newReport];
    setDailyReports(updatedReports);
    saveToLocalStorage('dailyReports', updatedReports);
    
    // Reset form
    setReportTasks([{ task: '', description: '', hours: 0 }]);
    alert('Daily report submitted successfully!');
  };

  const handleSubmitLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      userId: user.id,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: leaveReason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const updatedRequests = [...leaveRequests, newRequest];
    setLeaveRequests(updatedRequests);
    saveToLocalStorage('leaveRequests', updatedRequests);
    
    // Reset form
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveReason('');
    alert('Leave request submitted successfully!');
  };

  const handleSubmitWeeklyReport = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    // Check if it's Friday
    if (today.getDay() !== 5) {
      alert('Weekly reports can only be submitted on Fridays!');
      return;
    }

    // Get daily reports for this week
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weeklyDailyReports = dailyReports.filter(report => 
      report.userId === user.id && 
      weekDays.some(day => isSameDay(new Date(report.date), day))
    );

    if (weeklyDailyReports.length === 0) {
      alert('No daily reports found for this week!');
      return;
    }

    const existingWeeklyReport = weeklyReports.find(report => 
      report.userId === user.id && 
      report.weekStart === format(weekStart, 'yyyy-MM-dd')
    );

    if (existingWeeklyReport) {
      alert('Weekly report already submitted for this week!');
      return;
    }

    const newWeeklyReport: WeeklyReport = {
      id: Date.now().toString(),
      userId: user.id,
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      weekEnd: format(weekEnd, 'yyyy-MM-dd'),
      dailyReports: weeklyDailyReports.map(report => report.id),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedWeeklyReports = [...weeklyReports, newWeeklyReport];
    setWeeklyReports(updatedWeeklyReports);
    saveToLocalStorage('weeklyReports', updatedWeeklyReports);
    alert('Weekly report submitted successfully!');
  };

  // Get current user's department
  const userDepartment = departments.find(dept => dept.name === user.department);
  const departmentMembers = users.filter(u => u.department === user.department);
  const todayAttendance = attendanceRecords.filter(record => 
    record.date === format(new Date(), 'yyyy-MM-dd') &&
    departmentMembers.some(member => member.id === record.userId)
  );

  const todayRecord = attendanceRecords.find(
    record => record.userId === user.id && record.date === format(new Date(), 'yyyy-MM-dd')
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mb-4">Current Time: {format(currentTime, 'PPpp')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleCheckIn}
            disabled={!!todayRecord}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Clock className="inline mr-2" size={20} />
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!todayRecord || !!todayRecord?.checkOut}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Clock className="inline mr-2" size={20} />
            Check Out
          </button>
          <button
            onClick={handleWFH}
            disabled={!!todayRecord}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Home className="inline mr-2" size={20} />
            Work From Home
          </button>
        </div>

        {todayRecord && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Today's Status</h3>
            <p>Status: <span className="capitalize font-medium">{todayRecord.status}</span></p>
            {todayRecord.checkIn && <p>Check In: {todayRecord.checkIn}</p>}
            {todayRecord.checkOut && <p>Check Out: {todayRecord.checkOut}</p>}
          </div>
        )}
      </div>

      {/* Department Members */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Department Members ({user.department})</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status Today</th>
              </tr>
            </thead>
            <tbody>
              {departmentMembers.map(member => {
                const memberAttendance = todayAttendance.find(att => att.userId === member.id);
                return (
                  <tr key={member.id}>
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        memberAttendance 
                          ? memberAttendance.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : memberAttendance.status === 'wfh'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {memberAttendance ? memberAttendance.status : 'absent'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Report Submission */}
      {new Date().getDay() === 5 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Report</h3>
          <p className="text-gray-600 mb-4">It's Friday! Submit your weekly report for review.</p>
          <button
            onClick={handleSubmitWeeklyReport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FileText className="inline mr-2" size={20} />
            Submit Weekly Report
          </button>
        </div>
      )}
    </div>
  );

  const renderDailyReport = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Daily Report</h2>
      <form onSubmit={handleSubmitDailyReport} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Tasks Completed</h3>
            <button
              type="button"
              onClick={addTaskEntry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Task
            </button>
          </div>
          
          {reportTasks.map((taskEntry, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Task {index + 1}</h4>
                {reportTasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTaskEntry(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task
                  </label>
                  <select
                    value={taskEntry.task}
                    onChange={(e) => updateTaskEntry(index, 'task', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a task</option>
                    {userDepartment?.tasks.map(task => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Spent
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    max="24"
                    value={taskEntry.hours}
                    onChange={(e) => updateTaskEntry(index, 'hours', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={taskEntry.description}
                    onChange={(e) => updateTaskEntry(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="Describe what you accomplished..."
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <FileText className="inline mr-2" size={20} />
          Submit Daily Report
        </button>
      </form>
    </div>
  );

  const renderLeaveRequest = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Leave</h2>
      <form onSubmit={handleSubmitLeaveRequest} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={leaveStartDate}
              onChange={(e) => setLeaveStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={leaveEndDate}
              onChange={(e) => setLeaveEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Calendar className="inline mr-2" size={20} />
          Submit Leave Request
        </button>
      </form>

      {/* Display existing leave requests */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Leave Requests</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests
                .filter(request => request.userId === user.id)
                .map(request => (
                  <tr key={request.id}>
                    <td className="px-4 py-2">{request.startDate}</td>
                    <td className="px-4 py-2">{request.endDate}</td>
                    <td className="px-4 py-2">{request.reason}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">MGE GROUP - Staff Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogOut className="inline mr-2" size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="inline mr-2" size={16} />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('daily-report')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'daily-report' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="inline mr-2" size={16} />
                  Daily Report
                </button>
                <button
                  onClick={() => setActiveTab('leave-request')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'leave-request' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="inline mr-2" size={16} />
                  Leave Request
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'daily-report' && renderDailyReport()}
            {activeTab === 'leave-request' && renderLeaveRequest()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTasks, setEditingTasks] = useState<{departmentId: string, tasks: string[]} | null>(null);

  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: '', manager: '' });
  const [newMember, setNewMember] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    department: '',
    manager: ''
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'on-hold'
  });

  useEffect(() => {
    // Load data from localStorage
    const storedUsers = localStorage.getItem('users');
    const storedDepartments = localStorage.getItem('departments');
    const storedLeaveRequests = localStorage.getItem('leaveRequests');
    const storedDailyReports = localStorage.getItem('dailyReports');
    const storedWeeklyReports = localStorage.getItem('weeklyReports');
    const storedProjects = localStorage.getItem('projects');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else setUsers(initialUsers);
    
    if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
    else setDepartments(initialDepartments);
    
    if (storedLeaveRequests) setLeaveRequests(JSON.parse(storedLeaveRequests));
    if (storedDailyReports) setDailyReports(JSON.parse(storedDailyReports));
    if (storedWeeklyReports) setWeeklyReports(JSON.parse(storedWeeklyReports));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
  }, []);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const department: Department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      manager: newDepartment.manager,
      tasks: []
    };
    const updatedDepartments = [...departments, department];
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setNewDepartment({ name: '', manager: '' });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const member: User = {
      id: Date.now().toString(),
      username: newMember.username,
      password: newMember.password,
      role: 'staff',
      name: newMember.name,
      email: newMember.email,
      department: newMember.department,
      manager: newMember.manager
    };
    const updatedUsers = [...users, member];
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
    setNewMember({
      username: '',
      password: '',
      name: '',
      email: '',
      department: '',
      manager: ''
    });
  };

  const handleEditUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      saveToLocalStorage('users', updatedUsers);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      createdAt: new Date().toISOString()
    };
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    saveToLocalStorage('projects', updatedProjects);
    setNewProject({ name: '', description: '', status: 'active' });
  };

  const handleLeaveRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    const updatedRequests = leaveRequests.map(request =>
      request.id === requestId ? { ...request, status: action } : request
    );
    setLeaveRequests(updatedRequests);
    saveToLocalStorage('leaveRequests', updatedRequests);
  };

  const handleWeeklyReportAction = (reportId: string, action: 'approved' | 'rejected') => {
    const updatedReports = weeklyReports.map(report =>
      report.id === reportId ? { ...report, status: action } : report
    );
    setWeeklyReports(updatedReports);
    saveToLocalStorage('weeklyReports', updatedReports);
  };

  const handleEditTasks = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      setEditingTasks({ departmentId, tasks: [...department.tasks] });
    }
  };

  const handleSaveTasks = () => {
    if (editingTasks) {
      const updatedDepartments = departments.map(dept =>
        dept.id === editingTasks.departmentId
          ? { ...dept, tasks: editingTasks.tasks }
          : dept
      );
      setDepartments(updatedDepartments);
      saveToLocalStorage('departments', updatedDepartments);
      setEditingTasks(null);
    }
  };

  const handleAddTask = () => {
    if (editingTasks) {
      setEditingTasks({
        ...editingTasks,
        tasks: [...editingTasks.tasks, '']
      });
    }
  };

  const handleUpdateTask = (index: number, value: string) => {
    if (editingTasks) {
      const updatedTasks = editingTasks.tasks.map((task, i) => i === index ? value : task);
      setEditingTasks({ ...editingTasks, tasks: updatedTasks });
    }
  };

  const handleRemoveTask = (index: number) => {
    if (editingTasks) {
      const updatedTasks = editingTasks.tasks.filter((_, i) => i !== index);
      setEditingTasks({ ...editingTasks, tasks: updatedTasks });
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'staff').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{leaveRequests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Reports</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyReports.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Departments & Members</h3>
        </div>
        <div className="space-y-4">
          {departments.map(department => (
            <div key={department.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">{department.name}</h4>
                <button
                  onClick={() => handleEditTasks(department.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit Tasks
                </button>
              </div>
              <p className="text-gray-600 mb-2">Manager: {department.manager}</p>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Tasks:</p>
                <div className="flex flex-wrap gap-2">
                  {department.tasks.map((task, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {task}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Members:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {users.filter(u => u.department === department.name).map(member => (
                    <div key={member.id} className="bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderManageMembers = () => (
    <div className="space-y-6">
      {/* Add New Member */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Member</h3>
        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={newMember.username}
            onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newMember.password}
            onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={newMember.department}
            onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Manager"
            value={newMember.manager}
            onChange={(e) => setNewMember({ ...newMember, manager: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <UserPlus className="inline mr-2" size={16} />
              Add Member
            </button>
          </div>
        </form>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Members</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Manager</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === 'staff').map(member => (
                <tr key={member.id}>
                  <td className="px-4 py-2">{member.name}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">{member.department}</td>
                  <td className="px-4 py-2">{member.manager}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(member)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(member.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Member</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditUser(editingUser);
            }} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={editingUser.department}
                onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Manager"
                value={editingUser.manager || ''}
                onChange={(e) => setEditingUser({ ...editingUser, manager: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      {/* Add New Department */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Department</h3>
        <form onSubmit={handleAddDepartment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Department Name"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Manager Name"
            value={newDepartment.manager}
            onChange={(e) => setNewDepartment({ ...newDepartment, manager: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <FolderPlus className="inline mr-2" size={16} />
              Add Department
            </button>
          </div>
        </form>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Departments</h3>
        <div className="space-y-4">
          {departments.map(department => (
            <div key={department.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">{department.name}</h4>
                <button
                  onClick={() => handleEditTasks(department.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit Tasks
                </button>
              </div>
              <p className="text-gray-600 mb-3">Manager: {department.manager}</p>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Tasks:</p>
                <div className="flex flex-wrap gap-2">
                  {department.tasks.map((task, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {task}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Members ({users.filter(u => u.department === department.name).length}):</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {users.filter(u => u.department === department.name).map(member => (
                    <div key={member.id} className="bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Tasks Modal */}
      {editingTasks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Department Tasks</h3>
            <div className="space-y-3">
              {editingTasks.tasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleUpdateTask(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task name"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(index)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTask}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={16} className="inline mr-1" />
                Add Task
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSaveTasks}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save size={16} className="inline mr-1" />
                Save Changes
              </button>
              <button
                onClick={() => setEditingTasks(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {/* Add New Project */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Project</h3>
        <form onSubmit={handleAddProject} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
          <select
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'active' | 'completed' | 'on-hold' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus className="inline mr-2" size={16} />
            Create Project
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h4>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeaveRequests = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Leave Requests</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(request => {
              const employee = users.find(u => u.id === request.userId);
              return (
                <tr key={request.id}>
                  <td className="px-4 py-2">{employee?.name}</td>
                  <td className="px-4 py-2">{request.startDate}</td>
                  <td className="px-4 py-2">{request.endDate}</td>
                  <td className="px-4 py-2">{request.reason}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLeaveRequestAction(request.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          <CheckCircle size={14} className="inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveRequestAction(request.id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          <XCircle size={14} className="inline mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Daily Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Reports</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Tasks</th>
                <th className="px-4 py-2 text-left">Total Hours</th>
                <th className="px-4 py-2 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {dailyReports.map(report => {
                const employee = users.find(u => u.id === report.userId);
                const totalHours = report.tasks.reduce((sum, task) => sum + task.hours, 0);
                return (
                  <tr key={report.id}>
                    <td className="px-4 py-2">{employee?.name}</td>
                    <td className="px-4 py-2">{report.date}</td>
                    <td className="px-4 py-2">
                      <div className="space-y-1">
                        {report.tasks.map((task, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{task.task}</span> ({task.hours}h)
                            <br />
                            <span className="text-gray-600">{task.description}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">{totalHours}h</td>
                    <td className="px-4 py-2">{format(new Date(report.submittedAt), 'MMM dd, HH:mm')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Reports</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Week Period</th>
                <th className="px-4 py-2 text-left">Daily Reports</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weeklyReports.map(report => {
                const employee = users.find(u => u.id === report.userId);
                return (
                  <tr key={report.id}>
                    <td className="px-4 py-2">{employee?.name}</td>
                    <td className="px-4 py-2">
                      {format(new Date(report.weekStart), 'MMM dd')} - {format(new Date(report.weekEnd), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-2">{report.dailyReports.length} reports</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : report.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {report.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleWeeklyReportAction(report.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            <CheckCircle size={14} className="inline mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleWeeklyReportAction(report.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            <XCircle size={14} className="inline mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">MGE GROUP - Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogOut className="inline mr-2" size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="inline mr-2" size={16} />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'members' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="inline mr-2" size={16} />
                  Manage Members
                </button>
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'departments' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="inline mr-2" size={16} />
                  Departments
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'projects' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ClipboardList className="inline mr-2" size={16} />
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('leave-requests')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'leave-requests' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="inline mr-2" size={16} />
                  Leave Requests
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'reports' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="inline mr-2" size={16} />
                  Reports
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'members' && renderManageMembers()}
            {activeTab === 'departments' && renderDepartments()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'leave-requests' && renderLeaveRequests()}
            {activeTab === 'reports' && renderReports()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize localStorage with default data if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('departments')) {
      localStorage.setItem('departments', JSON.stringify(initialDepartments));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {currentUser.role === 'admin' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <StaffDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;