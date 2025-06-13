import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import FormField from '../molecules/FormField';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'John Doe',
    email: 'john.doe@example.com',
    currency: 'USD',
    timeFormat: '12h',
    language: 'en',
    
    // Notification preferences
    emailNotifications: true,
    pushNotifications: true,
    tripReminders: true,
    weatherAlerts: true,
    budgetAlerts: true,
    
    // Trip preferences
    defaultBudgetRange: 'moderate',
    preferredTransport: 'flight',
    defaultTravelers: 2,
    
    // Privacy settings
    profileVisibility: 'private',
    shareTrips: false,
    dataCollection: true
  });

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' }
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.info('Data export feature coming soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.info('Account deletion feature coming soon!');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            value={settings.name}
            onChange={(e) => updateSetting('name', e.target.value)}
          />
          <FormField
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Currency">
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </FormField>

          <FormField label="Time Format">
            <select
              value={settings.timeFormat}
              onChange={(e) => updateSetting('timeFormat', e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </FormField>

          <FormField label="Language">
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Default Trip Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Default Budget Range">
            <select
              value={settings.defaultBudgetRange}
              onChange={(e) => updateSetting('defaultBudgetRange', e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="budget">Budget ($500-1500)</option>
              <option value="moderate">Moderate ($1500-3500)</option>
              <option value="premium">Premium ($3500-7000)</option>
              <option value="luxury">Luxury ($7000+)</option>
            </select>
          </FormField>

          <FormField label="Preferred Transport">
            <select
              value={settings.preferredTransport}
              onChange={(e) => updateSetting('preferredTransport', e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
            </select>
          </FormField>

          <FormField
            label="Default Travelers"
            type="number"
            min="1"
            max="10"
            value={settings.defaultTravelers}
            onChange={(e) => updateSetting('defaultTravelers', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive trip updates and reminders via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications on your device' },
            { key: 'tripReminders', label: 'Trip Reminders', description: 'Reminders about upcoming trips and activities' },
            { key: 'weatherAlerts', label: 'Weather Alerts', description: 'Weather updates for your travel destinations' },
            { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Notifications when approaching budget limits' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-start space-x-3 p-4 border border-surface-200 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-surface-900">{setting.label}</div>
                <div className="text-sm text-surface-600 mt-1">{setting.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={(e) => updateSetting(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="p-4 border border-surface-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-surface-900">Profile Visibility</div>
                <div className="text-sm text-surface-600 mt-1">Control who can see your profile information</div>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border border-surface-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-surface-900">Share Trips</div>
              <div className="text-sm text-surface-600 mt-1">Allow others to see your trip itineraries</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shareTrips}
                onChange={(e) => updateSetting('shareTrips', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-start space-x-3 p-4 border border-surface-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-surface-900">Data Collection</div>
              <div className="text-sm text-surface-600 mt-1">Allow us to collect usage data to improve the app</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataCollection}
                onChange={(e) => updateSetting('dataCollection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-surface-900">Export Your Data</h4>
                <p className="text-sm text-surface-600 mt-1">Download a copy of all your trip data</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                Export Data
              </Button>
            </div>
          </Card>

          <Card className="border-error/20">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-error">Delete Account</h4>
                <p className="text-sm text-surface-600 mt-1">Permanently delete your account and all data</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 font-heading">Settings</h1>
        <p className="text-surface-600 mt-1">Manage your account preferences and privacy settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors
                    ${activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-surface-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-surface-600">
                  Changes are saved automatically
                </p>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;