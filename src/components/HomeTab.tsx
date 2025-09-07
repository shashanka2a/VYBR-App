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
      name: "Gator Commons",
      location: "Near UF Campus",
      price: "$650/month",
      rating: 4.8,
      members: 24,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Pool", "Study Room", "Shuttle"]
    },
    {
      id: 2,
      name: "Midtown Student Living",
      location: "Midtown Gainesville",
      price: "$575/month",
      rating: 4.6,
      members: 18,
      image: "https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTcyMzk3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Gym", "Game Room", "Pet-Friendly"]
    },
    {
      id: 3,
      name: "Swamp House Co-op",
      location: "Downtown Gainesville",
      price: "$525/month",
      rating: 4.9,
      members: 12,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Sustainable", "Community Garden", "Bike Storage"]
    },
    {
      id: 4,
      name: "Archer Road Apartments",
      location: "SW Gainesville",
      price: "$700/month",
      rating: 4.5,
      members: 16,
      image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Bus Route", "Parking", "Laundry"]
    },
    {
      id: 5,
      name: "University Heights",
      location: "Near Shands Hospital",
      price: "$625/month",
      rating: 4.7,
      members: 20,
      image: "https://images.unsplash.com/photo-1549630552-4cfaf858cb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwZXZlbnQlMjBwYXJ0eXxlbnwxfHx8fDE3NTcyMzk4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Medical Students", "Quiet", "WiFi"]
    },
    {
      id: 6,
      name: "Gator Village",
      location: "Student Ghetto",
      price: "$550/month",
      rating: 4.4,
      members: 22,
      image: "https://images.unsplash.com/photo-1744320911030-1ab998d994d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwZ3JvdXB8ZW58MXx8fHwxNzU3MjM5ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Party-Friendly", "Walking Distance", "Affordable"]
    }
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3 max-w-4xl mx-auto">
        <h1 className="heading-1 bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
          Find Your Community
        </h1>
        <p className="body-normal md:body-large text-gray-600">
          Discover amazing housing options in Gainesville, connect with compatible roommates, and find your perfect living space near UF.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search Gainesville housing..."
            className="pl-10 pr-12 h-12 md:h-14 bg-gray-50 border-0 rounded-xl text-base"
          />
          <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 tap-feedback">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto md:overflow-visible">
          <Badge variant="secondary" className="whitespace-nowrap bg-indigo-100 text-indigo-700 border-0 hover:bg-indigo-200 cursor-pointer transition-colors tap-feedback">
            <MapPin className="w-3 h-3 mr-1" />
            Near UF
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors tap-feedback">Under $600</Badge>
          <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors tap-feedback">Bus Route</Badge>
          <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors tap-feedback">Pet-friendly</Badge>
          <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors hidden md:inline-flex tap-feedback">Pool & Gym</Badge>
          <Badge variant="outline" className="whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors hidden lg:inline-flex tap-feedback">Parking</Badge>
        </div>
      </div>

      {/* Communities Feed */}
      <div className="max-w-6xl mx-auto">
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

                <Button className="w-full bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 tap-feedback">
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