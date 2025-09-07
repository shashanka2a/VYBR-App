import { useState, useMemo } from 'react'
import { Search, MapPin, Filter, Heart, Star, Users, Bus } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Community {
  id: number
  name: string
  location: string
  price: string
  priceValue: number
  rating: number
  members: number
  image: string
  tags: string[]
  busRoute: string
  area: string
}

export function HomeTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const allCommunities: Community[] = [
    {
      id: 1,
      name: "Stoneridge Apartments",
      location: "SW 34th Street",
      price: "$750/month",
      priceValue: 750,
      rating: 4.7,
      members: 45,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Pool", "Gym", "Route 37", "Indian Community"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 2,
      name: "The Quarters",
      location: "SW 20th Avenue",
      price: "$680/month",
      priceValue: 680,
      rating: 4.5,
      members: 38,
      image: "https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTcyMzk3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Furnished", "Study Rooms", "International Students", "Route 37"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 3,
      name: "Centric Apartments",
      location: "SW 35th Place",
      price: "$720/month",
      priceValue: 720,
      rating: 4.6,
      members: 52,
      image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Modern", "Parking", "Route 37", "Grad Students"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 4,
      name: "Lexington Crossing",
      location: "SW 35th Place",
      price: "$695/month",
      priceValue: 695,
      rating: 4.4,
      members: 41,
      image: "https://images.unsplash.com/photo-1549630552-4cfaf858cb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwZXZlbnQlMjBwYXJ0eXxlbnwxfHx8fDE3NTcyMzk4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Pool", "Fitness Center", "Pet-Friendly", "Route 37"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 5,
      name: "Gainesville Place",
      location: "SW 34th Street",
      price: "$650/month",
      priceValue: 650,
      rating: 4.3,
      members: 35,
      image: "https://images.unsplash.com/photo-1744320911030-1ab998d994d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwZ3JvdXB8ZW58MXx8fHwxNzU3MjM5ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Affordable", "Laundry", "Near Publix", "Route 37"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 6,
      name: "Campus Lodge",
      location: "SW 13th Street",
      price: "$780/month",
      priceValue: 780,
      rating: 4.8,
      members: 29,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Luxury", "Close to Campus", "Study Lounges", "Premium"],
      busRoute: "12",
      area: "Near Campus"
    },
    {
      id: 7,
      name: "Cabana Beach",
      location: "SW 75th Street",
      price: "$620/month",
      priceValue: 620,
      rating: 4.2,
      members: 33,
      image: "https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTcyMzk3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Beach Volleyball", "Pool", "Budget-Friendly", "Route 37"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 8,
      name: "University Commons",
      location: "SW 20th Avenue",
      price: "$710/month",
      priceValue: 710,
      rating: 4.5,
      members: 47,
      image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Furnished", "Utilities Included", "International Hub", "Route 37"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 9,
      name: "Polos East",
      location: "SW 34th Street",
      price: "$640/month",
      priceValue: 640,
      rating: 4.1,
      members: 28,
      image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NzE1OTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Route 37", "Affordable", "Indian Community", "Near Walmart"],
      busRoute: "37",
      area: "SW Gainesville"
    },
    {
      id: 10,
      name: "Woodlands of Gainesville",
      location: "SW 35th Place",
      price: "$675/month",
      priceValue: 675,
      rating: 4.3,
      members: 31,
      image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Route 37", "Pool", "Furnished", "International Students"],
      busRoute: "37",
      area: "SW Gainesville"
    }
  ]

  // Filter communities based on search query and active filters
  const filteredCommunities = useMemo(() => {
    let filtered = allCommunities

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(query) ||
        community.location.toLowerCase().includes(query) ||
        community.tags.some(tag => tag.toLowerCase().includes(query)) ||
        community.area.toLowerCase().includes(query)
      )
    }

    // Filter by active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(community => {
        return activeFilters.every(filter => {
          switch (filter) {
            case 'SW Gainesville':
              return community.area === 'SW Gainesville'
            case 'International Students':
              return community.tags.some(tag => 
                tag.includes('International') || tag.includes('Grad Students')
              )
            case 'RTS Bus Route':
              return community.busRoute === '37'
            case 'Under $700':
              return community.priceValue < 700
            case 'Furnished':
              return community.tags.includes('Furnished')
            case 'Indian Community':
              return community.tags.includes('Indian Community')
            default:
              return true
          }
        })
      })
    }

    return filtered
  }, [searchQuery, activeFilters])

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filterOptions = [
    'SW Gainesville',
    'International Students', 
    'RTS Bus Route',
    'Under $700',
    'Furnished',
    'Indian Community'
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-12 md:h-14 bg-gray-50 border-0 rounded-xl text-base"
          />
          <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 tap-feedback">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto md:overflow-visible">
          {filterOptions.map((filter, index) => {
            const isActive = activeFilters.includes(filter)
            const isHidden = (index >= 4 && 'hidden md:inline-flex') || (index >= 5 && 'hidden lg:inline-flex') || ''
            
            return (
              <Badge
                key={filter}
                variant={isActive ? "secondary" : "outline"}
                onClick={() => toggleFilter(filter)}
                className={`whitespace-nowrap cursor-pointer transition-colors tap-feedback ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 border-0 hover:bg-indigo-200' 
                    : 'hover:bg-gray-50'
                } ${isHidden}`}
              >
                {filter === 'SW Gainesville' && <MapPin className="w-3 h-3 mr-1" />}
                {filter === 'RTS Bus Route' && <Bus className="w-3 h-3 mr-1" />}
                {filter}
              </Badge>
            )
          })}
        </div>

        {/* Active Filters Summary */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            <div className="flex gap-1 flex-wrap">
              {activeFilters.map(filter => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 border-0 cursor-pointer hover:bg-emerald-200"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter} ×
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilters([])}
              className="text-gray-500 hover:text-gray-700 p-1 h-auto"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredCommunities.length} of {allCommunities.length} communities
          {activeFilters.includes('RTS Bus Route') && (
            <span className="ml-2 text-emerald-600 font-medium">
              • All results are on Route 37 (GNVRTS)
            </span>
          )}
        </div>
      </div>

      {/* Communities Feed */}
      <div className="max-w-6xl mx-auto">
        {filteredCommunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="heading-4 text-gray-600 mb-2">No communities found</h3>
            <p className="body-normal text-gray-500 mb-4">
              Try adjusting your search or filters to find more options.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setActiveFilters([])
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCommunities.map((community) => (
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
                      {tag === 'Route 37' && <Bus className="w-3 h-3 mr-1" />}
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
        )}
      </div>
    </div>
  )
}