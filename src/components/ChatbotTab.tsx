import { useState } from "react";
import { Send, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface UserProfile {
  major: string;
  sleepSchedule: 'early' | 'night';
  cleanliness: 'neat' | 'relaxed';
  diet: string;
  roommateVibe: 'quiet' | 'social';
  eventInterests: string[];
}

interface AssessmentQuestion {
  id: number;
  question: string;
  emoji: string;
  options: { value: string; label: string; emoji: string }[];
  field: keyof UserProfile;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What's your major?",
    emoji: "📚",
    options: [
      { value: "Computer Science", label: "Computer Science", emoji: "💻" },
      { value: "Business", label: "Business", emoji: "💼" },
      { value: "Engineering", label: "Engineering", emoji: "⚙️" },
      { value: "Liberal Arts", label: "Liberal Arts", emoji: "🎨" },
      { value: "Other", label: "Other", emoji: "🎓" }
    ],
    field: "major"
  },
  {
    id: 2,
    question: "Are you more of an early bird or a night owl?",
    emoji: "🌅",
    options: [
      { value: "early", label: "Early bird", emoji: "🌅" },
      { value: "night", label: "Night owl", emoji: "🌙" }
    ],
    field: "sleepSchedule"
  },
  {
    id: 3,
    question: "How do you usually keep your room?",
    emoji: "🧹",
    options: [
      { value: "neat", label: "Neat & tidy", emoji: "🧹" },
      { value: "relaxed", label: "A little relaxed", emoji: "😅" }
    ],
    field: "cleanliness"
  },
  {
    id: 4,
    question: "Any dietary preferences?",
    emoji: "🥗",
    options: [
      { value: "Vegetarian", label: "Vegetarian", emoji: "🥗" },
      { value: "Vegan", label: "Vegan", emoji: "🌱" },
      { value: "Halal", label: "Halal", emoji: "🕌" },
      { value: "None", label: "None", emoji: "🍽️" }
    ],
    field: "diet"
  },
  {
    id: 5,
    question: "What's your ideal roommate vibe?",
    emoji: "🤓",
    options: [
      { value: "quiet", label: "Quiet & focused", emoji: "🤓" },
      { value: "social", label: "Social & outgoing", emoji: "🎉" }
    ],
    field: "roommateVibe"
  },
  {
    id: 6,
    question: "What kinds of events would you never want to miss?",
    emoji: "🎉",
    options: [
      { value: "parties", label: "Parties", emoji: "🎉" },
      { value: "study-groups", label: "Study groups", emoji: "📚" },
      { value: "cultural", label: "Cultural events", emoji: "🎭" },
      { value: "sports", label: "Sports", emoji: "⚽" },
      { value: "all", label: "All of the above", emoji: "✨" }
    ],
    field: "eventInterests"
  }
];

type FlowState = 'intro' | 'assessment' | 'summary';

export function ChatbotTab() {
  const [flowState, setFlowState] = useState<FlowState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [isTyping, setIsTyping] = useState(false);

  const startAssessment = () => {
    setFlowState('assessment');
  };

  const handleAnswer = (value: string) => {
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    const field = currentQuestion.field;
    
    if (field === 'eventInterests') {
      if (value === 'all') {
        setUserProfile(prev => ({ ...prev, [field]: ['parties', 'study-groups', 'cultural', 'sports'] }));
      } else {
        setUserProfile(prev => ({ ...prev, [field]: [value] }));
      }
    } else {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    }

    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setFlowState('summary');
      }
    }, 1000);
  };

  const resetAssessment = () => {
    setFlowState('intro');
    setCurrentQuestionIndex(0);
    setUserProfile({});
    setIsTyping(false);
  };

  const getProgressPercentage = () => {
    if (flowState === 'intro') return 0;
    if (flowState === 'summary') return 100;
    return Math.round(((currentQuestionIndex + 1) / assessmentQuestions.length) * 100);
  };

  // Intro Screen
  if (flowState === 'intro') {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto md:my-6 md:rounded-xl md:shadow-lg md:border md:border-gray-200 md:overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome to My Vibe AI! ✨
            </h1>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              I&apos;ll learn about your lifestyle and preferences so I can recommend the best roommates and events for you.
            </p>
          </div>

          <Button 
            onClick={startAssessment}
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-3 text-lg"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Assessment Flow
  if (flowState === 'assessment') {
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto md:my-6 md:rounded-xl md:shadow-lg md:border md:border-gray-200 md:overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">My Vibe AI</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetAssessment}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentQuestionIndex + 1} of {assessmentQuestions.length} answered</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">{currentQuestion.emoji}</div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              {currentQuestion.question}
            </h3>
          </div>

          {isTyping ? (
            <div className="flex justify-center">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 h-auto text-left justify-start hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="text-base">{option.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Summary Screen
  if (flowState === 'summary') {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto md:my-6 md:rounded-xl md:shadow-lg md:border md:border-gray-200 md:overflow-hidden">
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Awesome! Your vibe is set! ✨
            </h2>
          </div>

          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="font-semibold text-gray-800 mb-4">Your Profile Summary:</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                📚 <strong>{userProfile.major}</strong> major who&apos;s a <strong>{userProfile.sleepSchedule === 'early' ? 'morning person 🌅' : 'night owl 🌙'}</strong>
              </p>
              <p>
                🏠 Keeps things <strong>{userProfile.cleanliness === 'neat' ? 'neat & tidy 🧹' : 'relaxed & comfortable 😅'}</strong>
              </p>
              <p>
                🍽️ Dietary preference: <strong>{userProfile.diet}</strong>
              </p>
              <p>
                👥 Looking for <strong>{userProfile.roommateVibe === 'quiet' ? 'quiet & focused 🤓' : 'social & outgoing 🎉'}</strong> roommates
              </p>
              <p>
                🎉 Interested in: <strong>{userProfile.eventInterests?.join(', ')}</strong> events
              </p>
            </div>
          </Card>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-emerald-800 text-center">
              I&apos;ll recommend roommates who match your habits and notify you about relevant events!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => {/* Navigate to Roomies tab */}}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              See My Matches
            </Button>
            <Button 
              onClick={() => {/* Navigate to Events tab */}}
              variant="outline"
              className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              View Event Picks
            </Button>
          </div>

          <Button 
            onClick={resetAssessment}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    );
  }

  return null;
}