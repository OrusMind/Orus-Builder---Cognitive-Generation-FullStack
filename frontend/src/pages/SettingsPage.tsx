/**
 * ============================================================================
 * ORUS BUILDER - SETTINGS PAGE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T10:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T10:00:00-03:00
 * COMPONENT_HASH: orus.frontend.page.settings.20251010.SET9Z0A1
 * 
 * PURPOSE:
 * - User settings and preferences
 * - Profile management
 * - Editor preferences
 * - Notification settings
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: SettingsManagementAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 68
 * - TRINITY_INTEGRATED: None (Configuration)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  User,
  Bell,
  Code,
  Palette,
  Shield,
  Key,
  Mail,
  Moon,
  Sun,
  Check,
  X,
} from 'lucide-react';
import { Navigation } from '@components/layout/Navigation';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Avatar } from '@components/common/Avatar';
import toast from 'react-hot-toast';

// ============================================================================
// SETTINGS PAGE COMPONENT
// ============================================================================

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'editor' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    bio: 'Full-stack developer passionate about AI and automation.',
  });

  // Editor state
  const [editorSettings, setEditorSettings] = useState({
    theme: 'dark' as 'dark' | 'light',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    formatOnSave: true,
    autoSave: true,
  });

  // Notification state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    commentNotifications: true,
    mentionNotifications: true,
    generationNotifications: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Navigation>
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-foreground-muted">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-background-surface rounded-lg border border-primary/20 p-2">
                <SettingsTab
                  icon={<User className="w-5 h-5" />}
                  label="Profile"
                  isActive={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                />
                <SettingsTab
                  icon={<Code className="w-5 h-5" />}
                  label="Editor"
                  isActive={activeTab === 'editor'}
                  onClick={() => setActiveTab('editor')}
                />
                <SettingsTab
                  icon={<Bell className="w-5 h-5" />}
                  label="Notifications"
                  isActive={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                />
                <SettingsTab
                  icon={<Shield className="w-5 h-5" />}
                  label="Security"
                  isActive={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-background-surface rounded-lg border border-primary/20 p-6"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Profile Settings</h2>
                      <p className="text-sm text-foreground-muted mb-6">
                        Manage your public profile information
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={profileData.avatar}
                        name={profileData.name}
                        size="xl"
                      />
                      <div>
                        <Button variant="secondary" size="sm">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-foreground-muted mt-2">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        fullWidth
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        fullWidth
                        leftIcon={<Mail className="w-4 h-4" />}
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg resize-none focus:outline-none focus:border-primary text-foreground"
                        rows={4}
                      />
                    </div>

                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}

                {/* Editor Tab */}
                {activeTab === 'editor' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Editor Preferences</h2>
                      <p className="text-sm text-foreground-muted mb-6">
                        Customize your code editor experience
                      </p>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Theme
                      </label>
                      <div className="flex gap-3">
                        <ThemeOption
                          icon={<Moon className="w-5 h-5" />}
                          label="Dark"
                          isActive={editorSettings.theme === 'dark'}
                          onClick={() => setEditorSettings({ ...editorSettings, theme: 'dark' })}
                        />
                        <ThemeOption
                          icon={<Sun className="w-5 h-5" />}
                          label="Light"
                          isActive={editorSettings.theme === 'light'}
                          onClick={() => setEditorSettings({ ...editorSettings, theme: 'light' })}
                        />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Font Size: {editorSettings.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="24"
                        value={editorSettings.fontSize}
                        onChange={(e) => setEditorSettings({ ...editorSettings, fontSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Tab Size */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tab Size: {editorSettings.tabSize} spaces
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="2"
                        value={editorSettings.tabSize}
                        onChange={(e) => setEditorSettings({ ...editorSettings, tabSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-3">
                      <ToggleOption
                        label="Word Wrap"
                        description="Wrap long lines"
                        checked={editorSettings.wordWrap}
                        onChange={(checked) => setEditorSettings({ ...editorSettings, wordWrap: checked })}
                      />
                      <ToggleOption
                        label="Minimap"
                        description="Show code minimap"
                        checked={editorSettings.minimap}
                        onChange={(checked) => setEditorSettings({ ...editorSettings, minimap: checked })}
                      />
                      <ToggleOption
                        label="Format on Save"
                        description="Automatically format code when saving"
                        checked={editorSettings.formatOnSave}
                        onChange={(checked) => setEditorSettings({ ...editorSettings, formatOnSave: checked })}
                      />
                      <ToggleOption
                        label="Auto Save"
                        description="Automatically save changes"
                        checked={editorSettings.autoSave}
                        onChange={(checked) => setEditorSettings({ ...editorSettings, autoSave: checked })}
                      />
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Notification Settings</h2>
                      <p className="text-sm text-foreground-muted mb-6">
                        Choose what notifications you want to receive
                      </p>
                    </div>

                    <div className="space-y-3">
                      <ToggleOption
                        label="Email Notifications"
                        description="Receive notifications via email"
                        checked={notificationSettings.emailNotifications}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                      />
                      <ToggleOption
                        label="Push Notifications"
                        description="Receive browser push notifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                      />
                      <ToggleOption
                        label="Comments"
                        description="Notify when someone comments on your code"
                        checked={notificationSettings.commentNotifications}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, commentNotifications: checked })}
                      />
                      <ToggleOption
                        label="Mentions"
                        description="Notify when someone mentions you"
                        checked={notificationSettings.mentionNotifications}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, mentionNotifications: checked })}
                      />
                      <ToggleOption
                        label="Generation Complete"
                        description="Notify when code generation is complete"
                        checked={notificationSettings.generationNotifications}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, generationNotifications: checked })}
                      />
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Security Settings</h2>
                      <p className="text-sm text-foreground-muted mb-6">
                        Manage your account security
                      </p>
                    </div>

                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <Input
                          type="password"
                          placeholder="Current password"
                          fullWidth
                          leftIcon={<Key className="w-4 h-4" />}
                        />
                        <Input
                          type="password"
                          placeholder="New password"
                          fullWidth
                          leftIcon={<Key className="w-4 h-4" />}
                        />
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          fullWidth
                          leftIcon={<Key className="w-4 h-4" />}
                        />
                        <Button variant="secondary">Update Password</Button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-6 border-t border-primary/20">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-foreground-muted mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="secondary">Enable 2FA</Button>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-error/20">
                      <h3 className="text-lg font-semibold text-error mb-2">Danger Zone</h3>
                      <p className="text-sm text-foreground-muted mb-4">
                        Irreversible actions for your account
                      </p>
                      <Button variant="danger">Delete Account</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface SettingsTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
      isActive
        ? 'bg-primary text-background'
        : 'text-foreground-muted hover:bg-background-elevated hover:text-foreground'
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
      isActive
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-primary/20 text-foreground-muted hover:border-primary/40'
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-primary/20">
    <div>
      <div className="font-medium text-foreground mb-1">{label}</div>
      <div className="text-sm text-foreground-muted">{description}</div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-12 h-6 rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-background-elevated border border-primary/20'
      )}
    >
      <span
        className={clsx(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
          checked ? 'right-1' : 'left-1'
        )}
      />
    </button>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: SettingsPage (Settings page)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
