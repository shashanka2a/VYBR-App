import { useState } from "react";
import { User, Mail, Phone, GraduationCap, Calendar, Instagram, Twitter, Linkedin, Camera, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  graduationYear: string;
  major: string;
  initials: string;
  profileCompletion: number;
  socialMedia: {
    instagram: string;
    twitter: string;
    linkedin: string;
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
  socialMedia: {
    instagram: "@yourusername",
    twitter: "@yourusername",
    linkedin: "linkedin.com/in/yourusername"
  }
};

export function ProfileTab() {
  const [profile] = useState<UserProfile>(mockProfile);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-8 text-center border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Profile
        </h1>
        <p className="text-gray-600 text-sm">
          Manage your personal information
        </p>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Profile Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Tap the camera icon to update your photo
          </p>
          <p className="text-xs text-gray-400">
            Recommended: Square image, max 5MB
          </p>
        </div>

        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <User className="w-4 h-4 mr-2" />
                <span>Full Name</span>
              </div>
              <div className="text-gray-800 font-medium pl-6">
                {profile.name}
              </div>
            </div>

            {/* Education Email */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>Education Email</span>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="text-gray-800 font-medium pl-6">
                {profile.email}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>Phone Number</span>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="text-gray-800 font-medium pl-6">
                {profile.phone}
              </div>
            </div>

            {/* Expected Graduation Year */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Expected Graduation Year</span>
              </div>
              <div className="text-gray-800 font-medium pl-6">
                {profile.graduationYear}
              </div>
            </div>

            {/* Major */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Major</span>
              </div>
              <div className="text-gray-800 font-medium pl-6">
                {profile.major}
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Social Media</h2>
            <p className="text-sm text-gray-600">Connect your social profiles (optional)</p>
          </div>

          <div className="space-y-6">
            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Instagram className="w-4 h-4 mr-2" />
                <span>Instagram</span>
              </div>
              <div className="text-gray-500 pl-6">
                {profile.socialMedia.instagram}
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Twitter className="w-4 h-4 mr-2" />
                <span>X (Twitter)</span>
              </div>
              <div className="text-gray-500 pl-6">
                {profile.socialMedia.twitter}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Linkedin className="w-4 h-4 mr-2" />
                <span>LinkedIn</span>
              </div>
              <div className="text-gray-500 pl-6">
                {profile.socialMedia.linkedin}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Completion */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-indigo-50 border-emerald-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Completion</h3>
            <div className="text-3xl font-bold text-emerald-600 mb-3">
              {profile.profileCompletion}%
            </div>
            <Progress 
              value={profile.profileCompletion} 
              className="h-3 mb-4 bg-white/50"
            />
            <p className="text-sm text-gray-600">
              Complete your profile to get better matches!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}