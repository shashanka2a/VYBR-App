import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from typing import List, Dict, Optional


class HousingDatabase:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        if not self.db_url:
            raise ValueError("DATABASE_URL environment variable is required")
    
    def get_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.db_url, cursor_factory=RealDictCursor)
    
    def init_tables(self):
        """Initialize database tables for housing data"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                # Create housing table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS housing (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        location VARCHAR(255),
                        price_range VARCHAR(100),
                        avg_price INTEGER,
                        housing_type VARCHAR(50) NOT NULL,
                        is_international_friendly BOOLEAN DEFAULT FALSE,
                        amenities TEXT[], -- PostgreSQL array type
                        source_url VARCHAR(500),
                        distance_to_campus VARCHAR(100),
                        bus_routes TEXT[],
                        description TEXT,
                        rating FLOAT DEFAULT 4.0,
                        member_count INTEGER DEFAULT 0,
                        image_url VARCHAR(500),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                
                # Create index for faster queries
                cur.execute("""
                    CREATE INDEX IF NOT EXISTS idx_housing_type ON housing(housing_type);
                    CREATE INDEX IF NOT EXISTS idx_housing_international ON housing(is_international_friendly);
                    CREATE INDEX IF NOT EXISTS idx_housing_price ON housing(avg_price);
                """)
                
                conn.commit()
                print("Database tables initialized successfully")
    
    def insert_housing(self, housing_data: Dict) -> int:
        """Insert a single housing record"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO housing (
                        name, location, price_range, avg_price, housing_type,
                        is_international_friendly, amenities, source_url,
                        distance_to_campus, bus_routes, description,
                        rating, member_count, image_url
                    ) VALUES (
                        %(name)s, %(location)s, %(price_range)s, %(avg_price)s,
                        %(housing_type)s, %(is_international_friendly)s,
                        %(amenities)s, %(source_url)s, %(distance_to_campus)s,
                        %(bus_routes)s, %(description)s, %(rating)s,
                        %(member_count)s, %(image_url)s
                    ) RETURNING id;
                """, {
                    **housing_data,
                    'rating': housing_data.get('rating', 4.0 + (hash(housing_data['name']) % 10) / 10),
                    'member_count': housing_data.get('member_count', 20 + (hash(housing_data['name']) % 40)),
                    'image_url': housing_data.get('image_url', self._get_default_image_url(housing_data['housing_type']))
                })
                
                result = cur.fetchone()
                if result:
                    housing_id = int(result['id'])
                    conn.commit()
                    return housing_id
                else:
                    raise ValueError("Failed to insert housing record")
    
    def bulk_insert_housing(self, housing_list: List[Dict]):
        """Insert multiple housing records"""
        for housing in housing_list:
            try:
                self.insert_housing(housing)
                print(f"Inserted: {housing['name']}")
            except Exception as e:
                print(f"Error inserting {housing.get('name', 'Unknown')}: {str(e)}")
    
    def get_all_housing(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get all housing with optional filters"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                base_query = """
                    SELECT * FROM housing 
                    WHERE 1=1
                """
                params = {}
                
                if filters:
                    # Filter by housing type
                    if filters.get('housing_type'):
                        base_query += " AND housing_type = %(housing_type)s"
                        params['housing_type'] = filters['housing_type']
                    
                    # Filter by international friendly
                    if 'international_friendly' in filters:
                        base_query += " AND is_international_friendly = %(international_friendly)s"
                        params['international_friendly'] = filters['international_friendly']
                    
                    # Filter by price range
                    if filters.get('max_price'):
                        base_query += " AND avg_price <= %(max_price)s"
                        params['max_price'] = filters['max_price']
                    
                    if filters.get('min_price'):
                        base_query += " AND avg_price >= %(min_price)s"
                        params['min_price'] = filters['min_price']
                    
                    # Filter by ID (for get_housing_by_id)
                    if filters.get('id'):
                        base_query += " AND id = %(id)s"
                        params['id'] = filters['id']
                    
                    # Search by name or location
                    if filters.get('search'):
                        base_query += " AND (name ILIKE %(search)s OR location ILIKE %(search)s OR description ILIKE %(search)s)"
                        params['search'] = f"%{filters['search']}%"
                    
                    # Filter by amenities
                    if filters.get('amenities'):
                        amenity_list = filters['amenities'] if isinstance(filters['amenities'], list) else [filters['amenities']]
                        base_query += " AND amenities && %(amenities)s"
                        params['amenities'] = amenity_list
                
                base_query += " ORDER BY rating DESC, avg_price ASC"
                
                cur.execute(base_query, params)
                results = cur.fetchall()
                
                # Convert to list of dicts
                return [dict(row) for row in results]
    
    def clear_housing_data(self):
        """Clear all housing data (for refreshing)"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM housing;")
                conn.commit()
                print("Cleared all housing data")
    
    def _get_default_image_url(self, housing_type: str) -> str:
        """Get default image URL based on housing type"""
        if housing_type == 'on_campus':
            return "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybXxlbnwwfHx8fDE3NTcyMzk4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
        else:
            return "https://images.unsplash.com/photo-1580063665747-ab495581c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzIzOTg1MXww&ixlib=rb-4.1.0&q=80&w=1080"


def initialize_database():
    """Initialize database and populate with scraped data"""
    db = HousingDatabase()
    
    # Initialize tables
    db.init_tables()
    
    # Import and run scraper
    from housing_scraper import GainesvilleHousingScraper
    
    scraper = GainesvilleHousingScraper()
    
    # Clear existing data
    db.clear_housing_data()
    
    # Scrape and insert new data
    print("Starting housing data scrape...")
    housing_data = scraper.scrape_all_housing()
    
    if housing_data:
        print(f"Inserting {len(housing_data)} housing records...")
        db.bulk_insert_housing(housing_data)
        print("Database populated successfully!")
    else:
        print("No housing data scraped")


if __name__ == "__main__":
    initialize_database()