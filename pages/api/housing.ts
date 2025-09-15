import { NextApiRequest, NextApiResponse } from 'next'

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
  housingType?: string
  internationalFriendly?: boolean
  description?: string
}

const getHousingData = (): Community[] => [
  // Off-Campus Housing
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
  },
  {
    id: 4,
    name: "Lexington Crossing",
    location: "SW 35th Place",
    price: "$695/month",
    priceValue: 695,
    rating: 4.4,
    members: 41,
    image: "https://images.unsplash.com/photo-1549630552-4cfaf858cb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwZXZlbnQlMjBwYXJ0eXxlbnwxfHx8fDE7NTcyMzk4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Pool", "Fitness Center", "Pet-Friendly", "Route 37"],
    busRoute: "37",
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: false
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: false
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
    area: "Near Campus",
    housingType: "off_campus",
    internationalFriendly: false
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: false
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
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
    area: "SW Gainesville",
    housingType: "off_campus",
    internationalFriendly: true
  },

  // On-Campus Housing
  {
    id: 11,
    name: "Beaty Towers",
    location: "On Campus - East",
    price: "$580/month",
    priceValue: 580,
    rating: 4.2,
    members: 67,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Traditional Dorm", "Dining Hall", "Study Rooms", "Campus Center"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: true
  },
  {
    id: 12,
    name: "Jennings Hall",
    location: "On Campus - Central",
    price: "$620/month",
    priceValue: 620,
    rating: 4.4,
    members: 52,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Suite Style", "AC", "International Students", "Honor Students"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: true
  },
  {
    id: 13,
    name: "Windsor Hall",
    location: "On Campus - North",
    price: "$640/month",
    priceValue: 640,
    rating: 4.5,
    members: 43,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Modern", "Suite Style", "Furnished", "Gym Access"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: true
  },
  {
    id: 14,
    name: "Lakeside Residential Complex",
    location: "On Campus - South",
    price: "$720/month",
    priceValue: 720,
    rating: 4.6,
    members: 38,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Apartment Style", "Lake View", "Kitchen", "Grad Students"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: true
  },
  {
    id: 15,
    name: "Keys Residential Complex",
    location: "On Campus - West",
    price: "$690/month",
    priceValue: 690,
    rating: 4.3,
    members: 45,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Apartment Style", "Furnished", "Study Lounges", "Parking"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: false
  },
  {
    id: 16,
    name: "Hume Hall",
    location: "On Campus - Central",
    price: "$650/month",
    priceValue: 650,
    rating: 4.4,
    members: 39,
    image: "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Honor Students", "Study Rooms", "Quiet Hours", "Academic Focus"],
    busRoute: "On-Campus",
    area: "UF Campus",
    housingType: "on_campus",
    internationalFriendly: false
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const housingData = getHousingData()
      res.status(200).json({ housing: housingData })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Housing API error:', error)
    res.status(500).json({ error: 'Failed to fetch housing data' })
  }
}