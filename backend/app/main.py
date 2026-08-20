from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.routers import auth, users, products, offers, cart, orders, analytics, manager, staff, customer, ai

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for SmartCart API",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(manager.router, prefix="/api/manager", tags=["Manager"])
app.include_router(staff.router, prefix="/api/staff", tags=["Staff"])
app.include_router(customer.router, prefix="/api/customer", tags=["Customer"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"message": "Welcome to SmartCart API"}
