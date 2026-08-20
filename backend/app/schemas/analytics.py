from pydantic import BaseModel
from typing import List, Dict, Any

class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    total_customers: int
    low_stock_products: int

class TopProduct(BaseModel):
    product_name: str
    quantity_sold: int
    revenue: float
