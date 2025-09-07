import { Search, MapPin, Filter, Heart, Star, Users } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function HomeTab() {
  const communities = [
    {
      id: 1,
      name: "Modern Downtown Loft",
      location: "Downtown, SF",
      price: "$1,200/month",
      rating: 4.8,
      members: 12,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["WiFi", "Kitchen", "Gym"]
    },
    {
      id: 2,
      name: "Creative Co-living Space",
      location: "Mission Bay, SF",
      price: "$950/month",
      rating: 4.6,
      members: 8,
      image: "https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTcyMzk3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Coworking", "Rooftop", "Events"]
    },
    {
      id: 3,
      name: "Tech House Collective",
      location: "SOMA, SF",
      price: "$1,050/month",
      rating: 4.9,
      members: 15,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Tech", "Networking", "24/7"]
    }
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 md:p-6 lg:p-8 bg-white border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="heading-1 md:heading-1 mb-2 md:mb-3">Find Your Community</h1>
            <p className="body-normal text-gray-600 hidden md:block">
              Discover amazing communities, connect with like-minded people, and find your perfect living space.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4 md:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search locations, communities..."
              className="pl-10 pr-12 py-3 md:py-4 rounded-xl bg-gray-50 border-0 text-base"
            />
            <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 tap-feedback">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <Badge variant="secondary" className="whitespace-nowrap bg-indigo-100 text-indigo-700 border-0 hover:bg-indigo-200 cursor-pointer transition-colors">
              <MapPin className="w-3 h-3 mr-1" />
              Near me
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Under $1000</Badge>
            <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Tech-friendly</Badge>
            <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Pet-friendly</Badge>
            <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors hidden md:inline-flex">Student Housing</Badge>
            <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors hidden lg:inline-flex">Co-living</Badge>
          </div>
        </div>
      </div>

      {/* Communities Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mobile: Single column, Desktop: Multi-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="overflow-hidden border-0 shadow-sm card-hover transition-all duration-300 hover:shadow-lg">
              <div className="relative">
                <ImageWithFallback
                  src={community.image}
                  alt={community.name}
                  className="w-full h-48 md:h-56 object-cover"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white w-8 h-8 rounded-full p-0 tap-feedback"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <CardContent className="p-4 md:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="heading-4 mb-2">{community.name}</h3>
                    <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-2 space-y-1 md:space-y-0 md:space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="body-small">{community.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="body-small">{community.members} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 text-amber-400 mr-1" />
                      <span className="body-small font-medium">{community.rating}</span>
                    </div>
                    <div className="text-emerald-600 font-semibold">{community.price}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 tap-feedback">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}