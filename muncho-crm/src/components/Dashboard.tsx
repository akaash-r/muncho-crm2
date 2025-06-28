import React, { useState } from 'react';
import { 
  Store, Users, TrendingUp, Calendar, Bell, Settings, ChevronDown, 
  Mail, Download, Info, Gift, CreditCard, MessageCircle, QrCode,
  UserPlus, Star, BarChart3, PieChart, Clock, Target, Zap, 
  ArrowUpRight, ExternalLink, Plus, Eye, ChevronRight, Sparkles,
  Phone, AtSign, MessageSquare, Send, Award, Heart, RefreshCw,
  AlertCircle, HelpCircle, Play
} from 'lucide-react';

interface DashboardProps {
  user: {
    firstName: string;
    role: string;
    onboardingComplete: boolean;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedOutlet, setSelectedOutlet] = useState('Main Branch');
  const [highlightsTimeframe, setHighlightsTimeframe] = useState('Today');
  const [salesChartView, setSalesChartView] = useState('30days');
  const [visitsChartView, setVisitsChartView] = useState('line');
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');

  const outlets = ['Main Branch', 'Mall Location', 'Airport Branch'];
  const timeframes = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];

  const navigationItems = [
    { name: 'Dashboard', icon: BarChart3, active: true },
    { name: 'Campaigns', icon: Send },
    { name: 'Customer Insights', icon: Users },
    { name: 'Loyalty', icon: Award },
    { name: 'Auto-Campaigns', icon: Zap },
    { name: 'Feedback', icon: Star },
    { name: 'QR Code', icon: QrCode },
    { name: 'Referrals', icon: UserPlus },
    { name: 'Membership', icon: CreditCard, badge: 'NEW' },
    { name: 'WhatsApp Chat', icon: MessageCircle },
    { name: 'Add Customers', icon: Plus }
  ];

  const credits = [
    { type: 'SMS', icon: MessageSquare, remaining: 150, color: 'bg-blue-500' },
    { type: 'Email', icon: AtSign, remaining: 200, color: 'bg-green-500' },
    { type: 'WhatsApp Utility', icon: MessageCircle, remaining: 75, color: 'bg-emerald-500' },
    { type: 'WhatsApp Marketing', icon: Send, remaining: 50, color: 'bg-purple-500' }
  ];

  const upcomingCelebrations = [
    { name: 'Priya S.', type: 'Birthday', date: 'Dec 28', phone: '98***43210' },
    { name: 'Rahul K.', type: 'Anniversary', date: 'Dec 30', phone: '91***56789' },
    { name: 'Anita M.', type: 'Birthday', date: 'Jan 2', phone: '99***12345' },
    { name: 'Vikram P.', type: 'Anniversary', date: 'Jan 5', phone: '97***67890' }
  ];

  const topRewards = [
    { name: 'Free Dessert', redeemed: 45 },
    { name: '10% Off Bill', redeemed: 32 },
    { name: 'Free Appetizer', redeemed: 28 },
    { name: 'Buy 1 Get 1', redeemed: 15 }
  ];

  const frequencyData = [
    { label: 'Visit 1', count: 234, percentage: 45 },
    { label: 'Visit 2', count: 156, percentage: 30 },
    { label: 'Visit 3-5', count: 89, percentage: 17 },
    { label: 'Visit 6+', count: 42, percentage: 8 },
    { label: 'Total Visitors', count: 521, percentage: 100 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Muncho CRM</h1>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNavItem(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeNavItem === item.name
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Trial Banner */}
        <div className="p-4 mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Free Trial</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">You have 14 days left in your free trial</p>
            <button className="w-full bg-yellow-600 text-white text-xs py-2 px-3 rounded-md hover:bg-yellow-700 transition-colors">
              Upgrade Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-semibold mb-2">See your company's future</h3>
            <p className="text-xs opacity-90 mb-3">with the Muncho CRM Growth Plan</p>
            <button className="flex items-center space-x-1 text-xs font-medium hover:underline">
              <span>View Demo Account</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Outlet Switcher */}
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Store className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{selectedOutlet}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Quick Links */}
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Customer life cycle
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book a Demo
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Get email report</span>
                </button>

                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 mb-2">
              <span>Your business at a glance</span>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </h1>
            <p className="text-gray-600">This feed will look a lot more exciting once you start adding customers.</p>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highlights Widget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Highlights for</h3>
                <select 
                  value={highlightsTimeframe}
                  onChange={(e) => setHighlightsTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  {timeframes.map(tf => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Sales</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹12,450</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Orders</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Customers</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">34</p>
                  <div className="mt-2 flex space-x-1">
                    <div className="h-1 bg-blue-500 rounded" style={{ width: '60%' }}></div>
                    <div className="h-1 bg-gray-300 rounded" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">20 new, 14 repeat</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Rewards Redeemed</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales</h3>
                <select 
                  value={salesChartView}
                  onChange={(e) => setSalesChartView(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                </select>
              </div>
              
              <div className="h-48 flex items-end justify-between space-x-2">
                {[65, 45, 78, 52, 89, 67, 94, 56, 73, 85, 69, 91, 77, 83].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`Day ${index + 1}: ₹${(height * 100).toLocaleString()}`}
                    ></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Valid numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-300 rounded"></div>
                  <span className="text-gray-600">Blocked numbers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Balance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Credits Balance</h3>
                <Info className="w-4 h-4 text-gray-400 cursor-help" title="Credits are used for SMS, Email, and WhatsApp campaigns" />
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto Refill Credits</span>
                  <span className="px-2 py-0.5 text-xs bg-green-500 rounded-full">NEW</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  Refill Credits
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {credits.map((credit) => (
                <div key={credit.type} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 ${credit.color} rounded-lg`}>
                      <credit.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{credit.type}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{credit.remaining}</p>
                  <p className="text-sm text-gray-600">credits remaining</p>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Celebrations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Celebrations</h3>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-purple-800">
                  People spend 25% more on their birthdays
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {upcomingCelebrations.map((celebration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{celebration.name}</p>
                      <p className="text-sm text-gray-600">{celebration.type} • {celebration.date}</p>
                      <p className="text-xs text-gray-500">{celebration.phone}</p>
                    </div>
                    <Gift className="w-5 h-5 text-purple-500" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Activate Offer
                </button>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  See all
                </button>
              </div>
            </div>

            {/* Customer Profile Completion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Profile Completion</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-bold text-gray-900">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 cursor-pointer hover:bg-gray-300 transition-colors">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                0% of customers have completed their profile.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Tips to gather more data:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ask for birthday during checkout</li>
                  <li>• Use QR codes for profile completion</li>
                  <li>• Offer incentives for complete profiles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Top Insights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top insights for you</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <h4 className="font-semibold text-gray-900">Revenue Impact</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">₹8,450</p>
                <p className="text-sm text-gray-600 mb-4">Generated by Muncho CRM</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Boost this number →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <PieChart className="w-6 h-6 text-purple-500" />
                  <h4 className="font-semibold text-gray-900">Revenue Distribution</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Top 20% customers</span>
                    <span className="font-medium">68% revenue</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bottom 80% customers</span>
                    <span className="font-medium">32% revenue</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Average Order Value</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">₹365</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <h4 className="font-semibold text-gray-900">Visit Frequency</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">2.3x</p>
                <p className="text-sm text-gray-600">visits per year</p>
              </div>
            </div>
          </div>

          {/* Traffic & Behaviour */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Visits in Last 30 Days</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setVisitsChartView('line')}
                    className={`p-1 rounded ${visitsChartView === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setVisitsChartView('bar')}
                    className={`p-1 rounded ${visitsChartView === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="h-32 flex items-end justify-between space-x-1">
                {[12, 8, 15, 9, 22, 18, 25, 14, 19, 16, 28, 21, 17, 13].map((height, index) => (
                  <div 
                    key={index} 
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${(height / 28) * 100}%` }}
                    title={`${height} visits`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total customers with purchase</h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">234</p>
                <p className="text-gray-600 mb-4">customers made purchases</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View customer list →
                </button>
              </div>
            </div>
          </div>

          {/* Customer Frequency & Top Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Frequency</h3>
              <div className="space-y-4">
                {frequencyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">{item.label}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top rewards redeemed</h3>
              {topRewards.length > 0 ? (
                <div className="space-y-4">
                  {topRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{reward.name}</span>
                      <span className="text-sm font-bold text-gray-900">{reward.redeemed}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">There is no data at the moment; this will look exciting once customers redeem rewards.</p>
                </div>
              )}
            </div>
          </div>

          {/* Programme Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Programme performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Loyalty</h4>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Redemptions</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Gain</span>
                    <span className="font-medium">₹12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Redemption Rate</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
                <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  View More →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Campaign</h4>
                  <Send className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sent</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customers Visited</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Gain</span>
                    <span className="font-medium">₹8,900</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View More →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Feedback</h4>
                  <Star className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Feedbacks</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <span className="font-medium">4.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Negative Feedback</span>
                    <span className="font-medium">8%</span>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View More →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Auto-Campaign</h4>
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Currently Active</span>
                    <span className="font-medium">3 / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customers Visited</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Gain</span>
                    <span className="font-medium">₹5,670</span>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View More →
                </button>
              </div>
            </div>
          </div>

          {/* Acquisition */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <QrCode className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-gray-900">QR Codes</h4>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active QRs</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customers Captured</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approx. Revenue</span>
                  <span className="font-medium">₹6,780</span>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm underline">
                Create your first QR code
              </button>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg shadow-sm border border-pink-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <UserPlus className="w-6 h-6 text-pink-600" />
                <h4 className="font-semibold text-gray-900">Referrals</h4>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potential Customers</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Customers</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approx. Revenue</span>
                  <span className="font-medium">₹2,940</span>
                </div>
              </div>
              <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                View More →
              </button>
            </div>
          </div>

          {/* Help Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Need help getting started?</h4>
                  <p className="text-sm text-yellow-700">Book a free consultation call with our experts</p>
                </div>
              </div>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                Book Call
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;