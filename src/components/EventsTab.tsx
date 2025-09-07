import { useState } from "react";
import { Calendar, MapPin, Users, Clock, Grid, List, Filter, Search, Heart, Share, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  category: string;
  price: string;
  isRSVPed: boolean;
  tags: string[];
}

const events: Event[] = [
  {
    id: 1,
    title: "Campus Movie Night: Dune",
    description: "Join us for an epic movie night featuring Dune! Popcorn and drinks included. Great way to unwind after midterms!",
    date: "2025-01-15",
    time: "7:00 PM",
    location: "Student Union Theater",
    organizer: "Student Activities Board",
    attendees: 89,
    maxAttendees: 150,
    image: "https://images.unsplash.com/photo-1549630552-4cfaf858cb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwZXZlbnQlMjBwYXJ0eXxlbnwxfHx8fDE3NTcyMzk4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Entertainment",
    price: "Free",
    isRSVPed: false,
    tags: ["Movie", "Free Food", "Indoor"]
  },
  {
    id: 2,
    title: "Spring Housing Fair",
    description: "Explore housing options for next semester! Meet with local apartments, dorms, and housing cooperatives. Housing applications available.",
    date: "2025-01-18",
    time: "11:00 AM",
    location: "Campus Recreation Center",
    organizer: "Housing Services",
    attendees: 234,
    maxAttendees: 500,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Housing",
    price: "Free",
    isRSVPed: true,
    tags: ["Housing", "Information", "Applications"]
  },
  {
    id: 3,
    title: "Roommate Speed Matching",
    description: "Fast-paced roommate matching event! Meet potential roommates in a fun, structured environment. Fill out compatibility surveys beforehand.",
    date: "2025-01-20",
    time: "6:00 PM",
    location: "West Campus Lounge",
    organizer: "VYBR Community Team",
    attendees: 45,
    maxAttendees: 80,
    image: "https://images.unsplash.com/photo-1744320911030-1ab998d994d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwZ3JvdXB8ZW58MXx8fHwxNzU3MjM5ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Social",
    price: "$5",
    isRSVPed: false,
    tags: ["Roommates", "Speed Dating", "Matching"]
  },
  {
    id: 4,
    title: "Study Group Formation Mixer",
    description: "Connect with classmates and form study groups for the upcoming semester. Organized by major and class level.",
    date: "2025-01-22",
    time: "4:00 PM",
    location: "Library Study Commons",
    organizer: "Academic Success Center",
    attendees: 67,
    maxAttendees: 120,
    image: "https://images.unsplash.com/photo-1549630552-4cfaf858cb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwZXZlbnQlMjBwYXJ0eXxlbnwxfHx8fDE3NTcyMzk4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Academic",
    price: "Free",
    isRSVPed: false,
    tags: ["Study Groups", "Academic", "Networking"]
  }
];

export function EventsTab() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState(events);

  const categories = ["All", "Entertainment", "Housing", "Social", "Academic"];

  const handleRSVP = (eventId: number) => {
    setFilteredEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRSVPed: !event.isRSVPed, attendees: event.isRSVPed ? event.attendees - 1 : event.attendees + 1 }
        : event
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
          Campus Events
        </h1>
        <p className="text-gray-600">Discover and RSVP to amazing events</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-0 rounded-xl"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`whitespace-nowrap px-3 py-1 cursor-pointer ${
                  selectedCategory === category 
                    ? "bg-emerald-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-emerald-50 border-emerald-200' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-emerald-50 border-emerald-200' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Events List/Grid */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}`}>
        {filteredEvents.map((event) => (
          <Card key={event.id} className={`overflow-hidden border-0 shadow-md ${
            viewMode === 'grid' ? 'h-full' : ''
          }`}>
            {viewMode === 'list' ? (
              /* List View */
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 ${event.category === 'Housing' ? 'bg-indigo-100 text-indigo-700' : 
                        event.category === 'Social' ? 'bg-purple-100 text-purple-700' :
                        event.category === 'Academic' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'}`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleRSVP(event.id)}
                      className={`h-8 ${event.isRSVPed 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600'
                      }`}
                    >
                      {event.isRSVPed ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          RSVP&apos;d
                        </>
                      ) : (
                        'RSVP'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="space-y-4">
                <div className="relative h-48">
                  <ImageWithFallback 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="secondary" 
                      className={`${event.category === 'Housing' ? 'bg-indigo-600 text-white' : 
                        event.category === 'Social' ? 'bg-purple-600 text-white' :
                        event.category === 'Academic' ? 'bg-emerald-600 text-white' :
                        'bg-gray-600 text-white'} backdrop-blur-sm bg-opacity-90`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Heart className="w-4 h-4 text-white" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Share className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                      <span className="font-medium text-emerald-600">{event.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleRSVP(event.id)}
                    className={`w-full ${event.isRSVPed 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600'
                    }`}
                  >
                    {event.isRSVPed ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        RSVP&apos;d
                      </>
                    ) : (
                      'RSVP Now'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}