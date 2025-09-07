import { useState } from "react";
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Edit3, Camera, Star, MapPin, GraduationCap, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface UserProfile {
  name: string;
  email: string;
  major: string;
  year: string;
  location: string;
  joinDate: string;
  avatar: string;
  bio: string;
  interests: string[];
  stats: {
    eventsAttended: number;
    roommateMatches: number;
    profileViews: number;
  };
  preferences: {
    sleepSchedule: string;
    cleanliness: string;
    socialLevel: string;
    studyHabits: string;
  };
}

const mockProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  major: "Computer Science",
  year: "Junior",
  location: "Campus Area",
  joinDate: "September 2024",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHN0dWRlbnR8ZW58MXx8fHwxNzU3MjM5ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  bio: "CS student passionate about technology and making connections. Looking for like-minded roommates and fun campus experiences!",
  interests: ["Coding", "Gaming", "Coffee", "Study Groups", "Tech Events"],
  stats: {
    eventsAttended: 12,
    roommateMatches: 8,
    profileViews: 45
  },
  preferences: {
    sleepSchedule: "Night Owl 🌙",
    cleanliness: "Neat & Tidy 🧹",
    socialLevel: "Social & Outgoing 🎉",
    studyHabits: "Focused Studier 📚"
  }
};

export function ProfileTab() {
  const [profile] = useState<UserProfile>(mockProfile);
  const [activeSection, setActiveSection] = useState<'profile' | 'settings' | 'preferences'>('profile');

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  const settingsOptions = [
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Shield, label: 'Privacy & Safety', description: 'Control who can see your profile' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help or contact support' },
    { icon: LogOut, label: 'Sign Out', description: 'Sign out of your account', danger: true },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3 max-w-4xl mx-auto">
        <h1 className="heading-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="body-normal md:body-large text-gray-600">
          Manage your profile, preferences, and account settings
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSection(item.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white text-indigo-600 shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                    <ImageWithFallback 
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.major} • {profile.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinDate}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 max-w-md">{profile.bio}</p>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{profile.stats.eventsAttended}</div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{profile.stats.roommateMatches}</div>
                <div className="text-sm text-gray-600">Roommate Matches</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{profile.stats.profileViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </Card>
            </div>

            {/* Interests */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Interests</h3>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="bg-indigo-100 text-indigo-700">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Lifestyle Preferences */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lifestyle Preferences</h3>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(profile.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-4">
            {settingsOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.label} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      option.danger ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${option.danger ? 'text-red-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${option.danger ? 'text-red-600' : 'text-gray-800'}`}>
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'New roommate matches', description: 'Get notified when you have new compatible roommates' },
                  { label: 'Event recommendations', description: 'Receive personalized event suggestions' },
                  { label: 'Messages', description: 'Notifications for new messages and chats' },
                  { label: 'Housing updates', description: 'Updates about housing availability and changes' }
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{pref.label}</div>
                      <div className="text-sm text-gray-600">{pref.description}</div>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Profile visibility', description: 'Who can see your profile' },
                  { label: 'Contact information', description: 'Who can see your contact details' },
                  { label: 'Activity status', description: 'Show when you&apos;re online' }
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{pref.label}</div>
                      <div className="text-sm text-gray-600">{pref.description}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}