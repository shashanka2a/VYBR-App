from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import os
from database import HousingDatabase

app = FastAPI(title="Gainesville Housing API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = HousingDatabase()

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        db.init_tables()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Gainesville Housing API", "version": "1.0.0"}

@app.get("/api/housing")
async def get_housing(
    housing_type: Optional[str] = Query(None, description="Filter by housing type: off_campus, on_campus"),
    international_friendly: Optional[bool] = Query(None, description="Filter by international student friendly"),
    max_price: Optional[int] = Query(None, description="Maximum price filter"),
    min_price: Optional[int] = Query(None, description="Minimum price filter"),
    search: Optional[str] = Query(None, description="Search in name, location, or description"),
    amenities: Optional[str] = Query(None, description="Filter by amenities (comma-separated)"),
    id: Optional[int] = Query(None, description="Filter by specific housing ID")
):
    """
    Get housing listings with optional filters
    """
    try:
        filters = {}
        
        if housing_type:
            filters['housing_type'] = housing_type
        
        if international_friendly is not None:
            filters['international_friendly'] = international_friendly
        
        if max_price:
            filters['max_price'] = max_price
        
        if min_price:
            filters['min_price'] = min_price
        
        if search:
            filters['search'] = search
        
        if amenities:
            filters['amenities'] = [a.strip() for a in amenities.split(',')]
        
        if id:
            filters['id'] = id
        
        housing_data = db.get_all_housing(filters)
        
        # Transform data for frontend compatibility
        transformed_data = []
        for housing in housing_data:
            transformed_housing = {
                'id': housing['id'],
                'name': housing['name'],
                'location': housing['location'],
                'price': housing['price_range'],
                'priceValue': housing['avg_price'],
                'rating': float(housing['rating']),
                'members': housing['member_count'],
                'image': housing['image_url'],
                'tags': housing['amenities'] or [],
                'busRoute': housing['bus_routes'][0] if housing['bus_routes'] else '',
                'area': housing['distance_to_campus'],
                'housingType': housing['housing_type'],
                'internationalFriendly': housing['is_international_friendly'],
                'description': housing['description']
            }
            transformed_data.append(transformed_housing)
        
        return {
            'housing': transformed_data,
            'total': len(transformed_data),
            'filters_applied': filters
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching housing data: {str(e)}")

@app.post("/api/housing/refresh")
async def refresh_housing():
    """
    Refresh housing data by re-scraping sources
    """
    try:
        from database import initialize_database
        
        # Re-initialize and populate database
        initialize_database()
        
        return {"message": "Housing data refreshed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing housing data: {str(e)}")

@app.get("/api/housing/stats")
async def get_housing_stats():
    """
    Get housing statistics
    """
    try:
        all_housing = db.get_all_housing()
        
        stats = {
            'total_listings': len(all_housing),
            'on_campus_count': len([h for h in all_housing if h['housing_type'] == 'on_campus']),
            'off_campus_count': len([h for h in all_housing if h['housing_type'] == 'off_campus']),
            'international_friendly_count': len([h for h in all_housing if h['is_international_friendly']]),
            'price_range': {
                'min': min([h['avg_price'] for h in all_housing]) if all_housing else 0,
                'max': max([h['avg_price'] for h in all_housing]) if all_housing else 0,
                'avg': sum([h['avg_price'] for h in all_housing]) // len(all_housing) if all_housing else 0
            }
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching housing stats: {str(e)}")

@app.get("/api/housing/{housing_id}")
async def get_housing_by_id(housing_id: int):
    """
    Get specific housing by ID
    """
    try:
        housing_data = db.get_all_housing({'id': housing_id})
        
        if not housing_data:
            raise HTTPException(status_code=404, detail="Housing not found")
        
        housing = housing_data[0]
        
        # Transform for frontend
        transformed_housing = {
            'id': housing['id'],
            'name': housing['name'],
            'location': housing['location'],
            'price': housing['price_range'],
            'priceValue': housing['avg_price'],
            'rating': float(housing['rating']),
            'members': housing['member_count'],
            'image': housing['image_url'],
            'tags': housing['amenities'] or [],
            'busRoute': housing['bus_routes'][0] if housing['bus_routes'] else '',
            'area': housing['distance_to_campus'],
            'housingType': housing['housing_type'],
            'internationalFriendly': housing['is_international_friendly'],
            'description': housing['description']
        }
        
        return transformed_housing
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching housing: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)