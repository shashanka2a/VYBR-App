import { useState } from "react";
import { Heart, X, MessageCircle, Star, MapPin, GraduationCap, Music, Coffee, Gamepad2, Book, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RoommateProfile {
  id: number;
  name: string;
  age: number;
  major: string;
  year: string;
  image: string;
  bio: string;
  location: string;
  compatibility: number;
  interests: string[];
  lifestyle: {
    cleanliness: number;
    socialLevel: number;
    studyHabits: number;
    sleepSchedule: string;
  };
  preferences: string[];
}

const profiles: RoommateProfile[] = [
  {
    id: 1,
    name: "Shashank Jagannatham",
    age: 21,
    major: "Computer Science",
    year: "Senior",
    image: "/shashank-profile.jpg",
    bio: "CS senior with a passion for full-stack development and outdoor adventures. Looking for a roommate who appreciates both focused coding sessions and weekend explorations!",
    location: "1.5 miles from campus",
    compatibility: 95,
    interests: ["Web Development", "Hiking", "Photography", "Coffee"],
    lifestyle: {
      cleanliness: 90,
      socialLevel: 75,
      studyHabits: 88,
      sleepSchedule: "Night Owl"
    },
    preferences: ["Non-smoker", "Tech-savvy", "Outdoor activities", "Clean workspace"]
  },
  {
    id: 2,
    name: "Marcus Chen",
    age: 19,
    major: "Business Administration",
    year: "Sophomore",
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Business student and music enthusiast. I produce beats in my free time and love hosting study groups. Clean, organized, and social!",
    location: "1.8 miles from campus",
    compatibility: 87,
    interests: ["Music Production", "Business", "Social Events", "Fitness"],
    lifestyle: {
      cleanliness: 80,
      socialLevel: 95,
      studyHabits: 75,
      sleepSchedule: "Early Bird"
    },
    preferences: ["Social atmosphere", "Music-friendly", "Study groups", "Gym buddy"]
  }
];

export function RoomiesTab() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  const currentProfile = profiles[currentProfileIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'right' && Math.random() > 0.7) {
        setShowMatchDialog(true);
      }
      
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setSwipeDirection(null);
    }, 300);
  };

  if (!currentProfile) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8 space-y-6 md:space-y-8">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-xl p-4 md:p-6 text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center space-x-2 text-purple-700">
          <Star className="w-5 h-5 fill-purple-200" />
          <span className="font-bold text-lg">Coming Soon!</span>
          <Star className="w-5 h-5 fill-purple-200" />
        </div>
        <p className="text-purple-800 font-medium">
          Roommate matching is currently in development. The interface below is a preview mockup.
        </p>
        <div className="text-sm text-purple-600">
          🚀 Real roommate matching powered by AI will be available soon!
        </div>
      </div>
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3 max-w-4xl mx-auto">
        <h1 className="heading-1 bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
          Find Your Perfect Roomie
        </h1>
        <p className="body-normal md:body-large text-gray-600">
          <span className="md:hidden">Swipe to discover compatible roommates</span>
          <span className="hidden md:inline">Discover compatible roommates based on lifestyle preferences and interests</span>
        </p>
        
        {/* Compatibility Notice */}
        <div className="bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-purple-800">
            ✨ Preview: Future matches will be based on your My Vibe AI assessment
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative max-w-2xl mx-auto">
        <Card className={`overflow-hidden border-0 shadow-xl transition-transform duration-300 card-hover ${
          swipeDirection === 'left' ? '-translate-x-full opacity-0' :
          swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''
        }`}>
          {/* Profile Image */}
          <div className="relative h-64 md:h-80 lg:h-96">
            <ImageWithFallback 
              src={currentProfile.image}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-1">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span className="text-sm font-medium">{currentProfile.compatibility}% Match</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 md:p-8 space-y-4 md:space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {currentProfile.year}
                </div>
              </div>
              <p className="text-purple-600 font-medium">{currentProfile.major}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {currentProfile.location}
              </div>
            </div>

            <p className="text-gray-700">{currentProfile.bio}</p>

            {/* Interests */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="bg-purple-100 text-purple-700">
                    {interest === "Web Development" && <Gamepad2 className="w-3 h-3 mr-1" />}
                    {interest === "Photography" && <Camera className="w-3 h-3 mr-1" />}
                    {interest === "Music Production" && <Music className="w-3 h-3 mr-1" />}
                    {interest === "Coffee" && <Coffee className="w-3 h-3 mr-1" />}
                    {interest === "Gaming" && <Gamepad2 className="w-3 h-3 mr-1" />}
                    {interest === "Business" && <Book className="w-3 h-3 mr-1" />}
                    {interest === "Hiking" && <Star className="w-3 h-3 mr-1" />}
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lifestyle Compatibility */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Lifestyle Match</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cleanliness</span>
                  <span>{currentProfile.lifestyle.cleanliness}%</span>
                </div>
                <Progress value={currentProfile.lifestyle.cleanliness} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Social Level</span>
                  <span>{currentProfile.lifestyle.socialLevel}%</span>
                </div>
                <Progress value={currentProfile.lifestyle.socialLevel} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Study Habits</span>
                  <span>{currentProfile.lifestyle.studyHabits}%</span>
                </div>
                <Progress value={currentProfile.lifestyle.studyHabits} className="h-2" />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Looking For</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.preferences.map((pref) => (
                  <Badge key={pref} variant="outline" className="border-emerald-200 text-emerald-700">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-8 md:space-x-12 max-w-2xl mx-auto">
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 group tap-feedback transition-all duration-200"
        >
          <X className="w-8 h-8 md:w-10 md:h-10 text-gray-400 group-hover:text-red-500" />
        </Button>
        
        <Button
          size="lg"
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 group tap-feedback transition-all duration-200"
        >
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </Button>
      </div>

      {/* Match Dialog */}
      {showMatchDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 text-center space-y-4 bg-gradient-to-br from-purple-50 to-emerald-50">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-purple-700">It&apos;s a Match!</h2>
            <p className="text-gray-600">You and {currentProfile.name} both liked each other!</p>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowMatchDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Keep Swiping
              </Button>
              <Button 
                onClick={() => setShowMatchDialog(false)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-emerald-500"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}