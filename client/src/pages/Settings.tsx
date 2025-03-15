import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Globe, 
  LayoutTemplate, 
  Moon, 
  Sun, 
  Save,
  BellRing,
  Mail,
  Calendar,
  LogOut,
  Info
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-dark">Settings</h2>
        <p className="mt-1 text-sm text-neutral-medium">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:grid-cols-6 grid-cols-3 gap-4">
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex gap-2 items-center">
            <LayoutTemplate className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex gap-2 items-center">
            <Info className="h-4 w-4" />
            <span className="hidden md:inline">About</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium">Profile Information</h3>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" defaultValue="Tom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" defaultValue="Cook" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="tom.cook@example.com" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Company Information</h3>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyId">Employee ID</Label>
                    <Input id="companyId" defaultValue="EMP-2023-001" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select defaultValue="hr">
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="HR Manager" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Preferences</h3>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-8">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Email Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="email-leaves">Leave Requests</Label>
                    </div>
                    <Switch id="email-leaves" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="email-performance">Performance Reviews</Label>
                    </div>
                    <Switch id="email-performance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="email-payroll">Payroll Updates</Label>
                    </div>
                    <Switch id="email-payroll" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="email-announcements">Company Announcements</Label>
                    </div>
                    <Switch id="email-announcements" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">In-App Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="app-tasks">Task Reminders</Label>
                    </div>
                    <Switch id="app-tasks" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="app-messages">Direct Messages</Label>
                    </div>
                    <Switch id="app-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="app-events">Calendar Events</Label>
                    </div>
                    <Switch id="app-events" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Calendar Integration</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-neutral-medium" />
                      <Label htmlFor="calendar-sync">Sync with Google Calendar</Label>
                    </div>
                    <Switch id="calendar-sync" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calendar-email">Calendar Email</Label>
                    <Input id="calendar-email" defaultValue="tom.cook@example.com" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-fit">Change Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enhance your account security</p>
                    <p className="text-sm text-neutral-medium">
                      Add an extra layer of security by enabling two-factor authentication
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Sessions</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-sm text-neutral-medium">
                      You're currently logged in on this device
                    </p>
                  </div>
                  <Button variant="outline" className="text-error border-error hover:bg-error/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the HR system looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Theme</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="theme-light" className="cursor-pointer">
                        <Sun className="h-4 w-4" />
                        <span className="ml-2">Light</span>
                      </Label>
                      <input
                        type="radio"
                        id="theme-light"
                        name="theme"
                        value="light"
                        className="accent-primary"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="theme-dark" className="cursor-pointer">
                        <Moon className="h-4 w-4" />
                        <span className="ml-2">Dark</span>
                      </Label>
                      <input
                        type="radio"
                        id="theme-dark"
                        name="theme"
                        value="dark"
                        className="accent-primary"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="theme-system" className="cursor-pointer">
                        <Globe className="h-4 w-4" />
                        <span className="ml-2">System</span>
                      </Label>
                      <input
                        type="radio"
                        id="theme-system"
                        name="theme"
                        value="system"
                        className="accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Layout</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sidebar">Sidebar Position</Label>
                    <Select defaultValue="left">
                      <SelectTrigger id="sidebar">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <Switch id="compact-mode" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Accessibility</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="large-text">Larger Text</Label>
                    <Switch id="large-text" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <Switch id="high-contrast" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Data Sharing</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Profile Visibility</p>
                      <p className="text-sm text-neutral-medium">
                        Control who can see your profile information
                      </p>
                    </div>
                    <Select defaultValue="company">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="company">Company Only</SelectItem>
                        <SelectItem value="team">Team Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Activity Status</p>
                      <p className="text-sm text-neutral-medium">
                        Show when you're online or active
                      </p>
                    </div>
                    <Switch id="activity-status" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Data Usage</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Usage Analytics</p>
                      <p className="text-sm text-neutral-medium">
                        Help improve the platform by sharing usage data
                      </p>
                    </div>
                    <Switch id="usage-analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Error Reporting</p>
                      <p className="text-sm text-neutral-medium">
                        Automatically send error reports to improve system stability
                      </p>
                    </div>
                    <Switch id="error-reporting" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Data Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Download Your Data</p>
                      <p className="text-sm text-neutral-medium">
                        Get a copy of all your personal data
                      </p>
                    </div>
                    <Button variant="outline">Request Data</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About HR Management System</CardTitle>
              <CardDescription>
                System information and resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium">System Information</h3>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-medium">Version</span>
                    <span className="text-sm">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-medium">Last Updated</span>
                    <span className="text-sm">November 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-medium">Environment</span>
                    <span className="text-sm">Production</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Support & Help</h3>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    <Info className="mr-2 h-4 w-4" />
                    User Guide & Documentation
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Legal Information</h3>
                <div className="grid gap-3">
                  <Button variant="link" className="justify-start p-0 h-auto">
                    Terms of Service
                  </Button>
                  <Button variant="link" className="justify-start p-0 h-auto">
                    Privacy Policy
                  </Button>
                  <Button variant="link" className="justify-start p-0 h-auto">
                    Compliance Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
