import { useState } from "react";
import { User, Mail, Phone, GraduationCap, Calendar, Instagram, Twitter, Linkedin, Camera, Edit, Plus, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { AuthGate } from "./auth/AuthGate";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  graduationYear: string;
  major: string;
  initials: string;
  profileCompletion: number;
  hasPhoto: boolean;
  socialMedia: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  completionItems: {
    photo: boolean;
    basicInfo: boolean;
    socialMedia: boolean;
    preferences: boolean;
  };
}

const mockProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  phone: "+1 (555) 123-4567",
  graduationYear: "2026",
  major: "Computer Science",
  initials: "AJ",
  profileCompletion: 56,
  hasPhoto: false,
  socialMedia: {
    instagram: "",
    twitter: "",
    linkedin: ""
  },
  completionItems: {
    photo: false,
    basicInfo: true,
    socialMedia: false,
    preferences: false
  }
};

function ProfileTabContent() {
  const [profile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);

  const getMissingItems = () => {
    const missing = [];
    if (!profile.completionItems.photo) missing.push("Add profile photo (+20%)");
    if (!profile.completionItems.socialMedia) missing.push("Connect social media (+15%)");
    if (!profile.completionItems.preferences) missing.push("Set preferences (+21%)");
    return missing;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-8 text-center border-b border-gray-100">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Your Profile
        </h1>
        <p className="text-gray-700 text-base mb-4">
          {profile.name}
        </p>
        
        {/* Profile Completion - Moved to top */}
        <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-lg font-bold text-emerald-600">{profile.profileCompletion}%</span>
          </div>
          <Progress 
            value={profile.profileCompletion} 
            className="h-2 mb-2 bg-white/50"
          />
          <p className="text-xs text-gray-600">
            Complete your profile to get better matches!
          </p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Profile Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.initials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            Add a photo (max 5MB)
          </p>
        </div>

        {/* Basic Information */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <User className="w-4 h-4 mr-3 text-indigo-500" />
                <span>Full Name</span>
              </div>
              <div className="text-gray-900 font-semibold text-lg pl-7">
                {profile.name}
              </div>
            </div>

            {/* Education Email */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <Mail className="w-4 h-4 mr-3 text-emerald-500" />
                <span>Education Email</span>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="text-gray-900 font-semibold text-base pl-7">
                {profile.email}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <Phone className="w-4 h-4 mr-3 text-purple-500" />
                <span>Phone Number</span>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="text-gray-900 font-semibold text-base pl-7">
                {profile.phone}
              </div>
            </div>

            {/* Expected Graduation Year */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                <span>Expected Graduation Year</span>
              </div>
              <div className="text-gray-900 font-semibold text-base pl-7">
                {profile.graduationYear}
              </div>
            </div>

            {/* Major */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <GraduationCap className="w-4 h-4 mr-3 text-emerald-600" />
                <span>Major</span>
              </div>
              <div className="text-gray-900 font-semibold text-base pl-7">
                {profile.major}
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Social Media</h2>
              <p className="text-sm text-gray-600">Connect your social profiles (optional)</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            {/* Instagram */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 focus-within:border-pink-300 focus-within:ring-1 focus-within:ring-pink-300">
              <Instagram className="w-5 h-5 text-pink-600 flex-shrink-0" />
              <Input
                placeholder="@yourusername"
                value={profile.socialMedia.instagram}
                className="border-0 bg-transparent p-0 text-gray-900 font-medium placeholder-gray-400 focus:ring-0"
              />
            </div>

            {/* Twitter/X */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200 focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300">
              <Twitter className="w-5 h-5 text-slate-700 flex-shrink-0" />
              <Input
                placeholder="@yourusername"
                value={profile.socialMedia.twitter}
                className="border-0 bg-transparent p-0 text-gray-900 font-medium placeholder-gray-400 focus:ring-0"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300">
              <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
              <Input
                placeholder="linkedin.com/in/yourusername"
                value={profile.socialMedia.linkedin}
                className="border-0 bg-transparent p-0 text-gray-900 font-medium placeholder-gray-400 focus:ring-0"
              />
            </div>
          </div>
        </Card>

        {/* What's Missing */}
        {getMissingItems().length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Your Profile</h3>
                <div className="space-y-2">
                  {getMissingItems().map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Floating Edit Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <Button 
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg px-6 py-3 font-medium"
        >
          <Edit className="w-5 h-5 mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}

export function ProfileTab() {
  return (
    <AuthGate 
      feature="Your Profile" 
      description="Manage your profile information and preferences to find the perfect roommate matches."
    >
      <ProfileTabContent />
    </AuthGate>
  );
}