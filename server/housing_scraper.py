# Housing scraper for Gainesville student housing data
# Using web scraper integration from this blueprint

import trafilatura
import requests
import re
import json
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import time
import random


def get_website_text_content(url: str) -> str:
    """
    This function takes a url and returns the main text content of the website.
    The text content is extracted using trafilatura and easier to understand.
    The results is not directly readable, better to be summarized by LLM before consume
    by the user.
    """
    # Send a request to the website
    downloaded = trafilatura.fetch_url(url)
    text = trafilatura.extract(downloaded)
    return text or ""


class GainesvilleHousingScraper:
    def __init__(self):
        self.housing_sources = {
            'off_campus': [
                'https://alight-gainesville.com/',
                'https://larkgainesville.com/',
                'https://thestandardgainesville.landmark-properties.com/',
                'https://huboncampus.com/gainesville-university/',
                'https://redpoint-gainesville.com/',
                'https://www.retreatgainesville.com/'
            ],
            'university_official': [
                'https://housing.offcampus.ufl.edu/housing',
                'https://housing.ufl.edu/'
            ]
        }
        
        # Headers to appear more like a real browser
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def extract_housing_info(self, url: str, housing_type: str) -> List[Dict]:
        """Extract housing information from a given URL"""
        try:
            print(f"Scraping {url}...")
            
            # Get website content
            content = get_website_text_content(url)
            if not content:
                print(f"No content found for {url}")
                return []
            
            # Parse content to extract housing information
            housing_data = self._parse_housing_content(content, url, housing_type)
            
            # Add small delay to be respectful
            time.sleep(random.uniform(1, 3))
            
            return housing_data
            
        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")
            return []

    def _parse_housing_content(self, content: str, source_url: str, housing_type: str) -> List[Dict]:
        """Parse extracted content to find housing information"""
        housing_listings = []
        
        # Extract basic information from content
        # This is a simplified parser - in reality, you'd need more sophisticated parsing
        
        # Look for common patterns in housing websites
        price_patterns = [
            r'\$(\d+)(?:,\d+)?(?:\.\d+)?(?:/month|/mo|per month)',
            r'\$(\d+)(?:,\d+)?(?:\.\d+)?'
        ]
        
        # Extract prices
        prices = []
        for pattern in price_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            prices.extend([int(match.replace(',', '')) for match in matches if match.isdigit()])
        
        # Determine housing characteristics based on URL and content
        name = self._extract_property_name(source_url, content)
        location = self._extract_location(content)
        amenities = self._extract_amenities(content)
        
        # Determine if international student friendly
        is_international_friendly = self._is_international_friendly(content)
        
        # Create housing listing
        if name and prices:
            avg_price = sum(prices[:3]) // len(prices[:3]) if prices else 750  # Use average of first few prices found
            
            housing_info = {
                'name': name,
                'location': location or 'Gainesville, FL',
                'price_range': f"${min(prices)}-${max(prices)}" if len(prices) > 1 else f"${avg_price}",
                'avg_price': avg_price,
                'housing_type': housing_type,
                'is_international_friendly': is_international_friendly,
                'amenities': amenities,
                'source_url': source_url,
                'distance_to_campus': self._estimate_distance(location or ''),
                'bus_routes': self._extract_bus_routes(content),
                'description': self._extract_description(content)
            }
            
            housing_listings.append(housing_info)
        
        return housing_listings

    def _extract_property_name(self, url: str, content: str) -> str:
        """Extract property name from URL or content"""
        # Try to get name from URL first
        domain = urlparse(url).netloc
        if 'alight' in domain:
            return 'Alight Gainesville'
        elif 'lark' in domain:
            return 'Lark Gainesville' 
        elif 'standard' in domain:
            return 'The Standard at Gainesville'
        elif 'huboncampus' in domain:
            return 'Hub On Campus Gainesville'
        elif 'redpoint' in domain:
            return 'Redpoint Gainesville'
        elif 'retreat' in domain:
            return 'The Retreat at Gainesville'
        
        # Try to extract from content
        name_patterns = [
            r'(?:Welcome to|About) ([A-Z][A-Za-z\s&]+(?:Gainesville|Apartments|Village|Commons))',
            r'([A-Z][A-Za-z\s&]+(?:Gainesville|Apartments|Village|Commons))'
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()
        
        return "Student Housing"

    def _extract_location(self, content: str) -> Optional[str]:
        """Extract location information"""
        location_patterns = [
            r'(\d+\s+(?:SW|NW|SE|NE|North|South|East|West)\s+[A-Za-z\s]+(?:Street|Ave|Avenue|Place|Road|Dr|Drive))',
            r'((?:SW|NW|SE|NE)\s+\d+\w*\s+(?:Street|Ave|Avenue|Place|Road))'
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None

    def _extract_amenities(self, content: str) -> List[str]:
        """Extract amenities from content"""
        amenity_keywords = [
            'pool', 'gym', 'fitness', 'parking', 'furnished', 'laundry',
            'wifi', 'internet', 'study', 'lounge', 'tennis', 'basketball',
            'volleyball', 'pet-friendly', 'shuttle', 'bus'
        ]
        
        found_amenities = []
        content_lower = content.lower()
        
        for amenity in amenity_keywords:
            if amenity in content_lower:
                found_amenities.append(amenity.title())
        
        return found_amenities[:8]  # Limit to 8 amenities

    def _is_international_friendly(self, content: str) -> bool:
        """Determine if housing is international student friendly"""
        international_keywords = [
            'international', 'global', 'furnished', 'short-term',
            'all-inclusive', 'utilities included', 'no guarantor',
            'visa', 'f-1', 'student visa'
        ]
        
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in international_keywords)

    def _estimate_distance(self, location: str) -> str:
        """Estimate distance to campus based on location"""
        if not location:
            return "2.5 miles from campus"
        
        # Simple heuristic based on street names
        if any(area in location.lower() for area in ['13th', 'university', 'campus']):
            return "0.5-1.5 miles from campus"
        elif any(area in location.lower() for area in ['20th', '34th', '35th']):
            return "1.5-3 miles from campus"
        else:
            return "2-4 miles from campus"

    def _extract_bus_routes(self, content: str) -> List[str]:
        """Extract bus route information"""
        # Look for RTS route information
        route_patterns = [
            r'route\s+(\d+)',
            r'rts\s+(\d+)',
            r'bus\s+(\d+)'
        ]
        
        routes = []
        for pattern in route_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            routes.extend(matches)
        
        return list(set(routes))  # Remove duplicates

    def _extract_description(self, content: str) -> str:
        """Extract or generate description"""
        # Try to find description-like content
        sentences = content.split('.')[:5]  # First 5 sentences
        description = '. '.join(sentences).strip()
        
        # Limit length
        if len(description) > 200:
            description = description[:197] + "..."
        
        return description or "Student housing in Gainesville near University of Florida."

    def scrape_all_housing(self) -> List[Dict]:
        """Scrape all housing sources and return combined data"""
        all_housing = []
        
        print("Starting to scrape Gainesville housing data...")
        
        # Scrape off-campus housing
        for url in self.housing_sources['off_campus']:
            housing_data = self.extract_housing_info(url, 'off_campus')
            all_housing.extend(housing_data)
        
        # Add some known on-campus options
        all_housing.extend(self._get_on_campus_housing())
        
        print(f"Scraped {len(all_housing)} housing listings")
        return all_housing

    def _get_on_campus_housing(self) -> List[Dict]:
        """Add known on-campus housing options"""
        on_campus_options = [
            {
                'name': 'Broward Hall',
                'location': 'Museum Road, UF Campus',
                'price_range': '$600-$800',
                'avg_price': 700,
                'housing_type': 'on_campus',
                'is_international_friendly': True,
                'amenities': ['Dining Hall', 'Study Lounges', 'Laundry', 'WiFi'],
                'source_url': 'https://housing.ufl.edu/',
                'distance_to_campus': 'On campus',
                'bus_routes': [],
                'description': 'Traditional residence hall on UF campus with dining facilities and study spaces.'
            },
            {
                'name': 'Lakeside Complex',
                'location': 'UF Campus',
                'price_range': '$650-$900',
                'avg_price': 775,
                'housing_type': 'on_campus',
                'is_international_friendly': True,
                'amenities': ['Apartment Style', 'Kitchen', 'Study Rooms', 'Recreation'],
                'source_url': 'https://housing.ufl.edu/',
                'distance_to_campus': 'On campus',
                'bus_routes': [],
                'description': 'Apartment-style residence halls with full kitchens and living areas.'
            },
            {
                'name': 'Springs Complex',
                'location': 'UF Campus', 
                'price_range': '$700-$950',
                'avg_price': 825,
                'housing_type': 'on_campus',
                'is_international_friendly': True,
                'amenities': ['Modern', 'Suite Style', 'Dining', 'Fitness Center'],
                'source_url': 'https://housing.ufl.edu/',
                'distance_to_campus': 'On campus',
                'bus_routes': [],
                'description': 'Newest residence halls with suite-style living and modern amenities.'
            }
        ]
        
        return on_campus_options


def test_scraper():
    """Test the scraper with a single URL"""
    scraper = GainesvilleHousingScraper()
    
    # Test with one URL
    test_url = 'https://alight-gainesville.com/'
    housing_data = scraper.extract_housing_info(test_url, 'off_campus')
    
    print(f"Test scrape results for {test_url}:")
    for housing in housing_data:
        print(json.dumps(housing, indent=2))


if __name__ == "__main__":
    test_scraper()