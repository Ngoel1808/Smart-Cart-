export const mockUsers = [
  { id: 'u1', name: 'Naman', email: 'customer@smartcart.com', password: 'customer123', role: 'CUSTOMER', status: 'Active' },
  { id: 'u2', name: 'Rahul Staff', email: 'staff@smartcart.com', password: 'staff123', role: 'STAFF', status: 'Active' },
  { id: 'u3', name: 'Aman Manager', email: 'manager@smartcart.com', password: 'manager123', role: 'MANAGER', status: 'Active' }
];

export const mockProducts = [
  { id: 'p1', name: 'Lays Magic Masala', category: 'Snacks', brand: 'Lays', mrp: 30, sellingPrice: 20, stock: 120, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'lays_magic_masala' },
  { id: 'p2', name: 'Oreo Original', category: 'Snacks', brand: 'Cadbury', mrp: 50, sellingPrice: 40, stock: 85, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'oreo' },
  { id: 'p3', name: 'Coca-Cola', category: 'Beverages', brand: 'Coca-Cola', mrp: 45, sellingPrice: 40, stock: 200, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'coca_cola' },
  { id: 'p4', name: 'Pepsi', category: 'Beverages', brand: 'PepsiCo', mrp: 45, sellingPrice: 40, stock: 180, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'pepsi' },
  { id: 'p5', name: 'Maggi 2-Minute Noodles', category: 'Grocery', brand: 'Nestle', mrp: 14, sellingPrice: 12, stock: 350, image: 'https://images.unsplash.com/photo-1606851094655-b25cb566f14b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'maggi' },
  { id: 'p6', name: 'Kurkure Masala Munch', category: 'Snacks', brand: 'PepsiCo', mrp: 20, sellingPrice: 18, stock: 150, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd08c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'kurkure' },
  { id: 'p7', name: 'Dairy Milk Silk', category: 'Snacks', brand: 'Cadbury', mrp: 80, sellingPrice: 75, stock: 60, image: 'https://images.unsplash.com/photo-1623366302587-bcaaaeb68e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'dairy_milk' },
  { id: 'p8', name: 'Sprite', category: 'Beverages', brand: 'Coca-Cola', mrp: 40, sellingPrice: 38, stock: 120, image: 'https://images.unsplash.com/photo-1625772299848-391b6a51820e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'sprite' },
  { id: 'p9', name: 'Fanta', category: 'Beverages', brand: 'Coca-Cola', mrp: 40, sellingPrice: 38, stock: 110, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'fanta' },
  { id: 'p10', name: 'Parle-G', category: 'Snacks', brand: 'Parle', mrp: 10, sellingPrice: 10, stock: 500, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'parle_g' },
  { id: 'p11', name: 'Amul Taaza Milk (1L)', category: 'Grocery', brand: 'Amul', mrp: 68, sellingPrice: 65, stock: 45, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'amul_milk' },
  { id: 'p12', name: 'Nescafe Classic', category: 'Beverages', brand: 'Nestle', mrp: 150, sellingPrice: 135, stock: 30, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'nescafe' },
  { id: 'p13', name: 'Bingo Mad Angles', category: 'Snacks', brand: 'ITC', mrp: 20, sellingPrice: 18, stock: 140, image: 'https://images.unsplash.com/photo-1600490710606-444cb360b001?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'bingo' },
  { id: 'p14', name: 'KitKat', category: 'Snacks', brand: 'Nestle', mrp: 30, sellingPrice: 28, stock: 90, image: 'https://images.unsplash.com/photo-1542844280-928ccafb32cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'kitkat' },
  { id: 'p15', name: 'Tata Salt', category: 'Grocery', brand: 'Tata', mrp: 28, sellingPrice: 25, stock: 250, image: 'https://images.unsplash.com/photo-1626081518712-42171d18228d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', aiClass: 'tata_salt' }
];

export const mockOffers = [
  { id: 'o1', productId: 'p1', type: 'BOGO', discountValue: 0, buyQuantity: 1, freeQuantity: 1, label: 'BUY 1 GET 1 FREE' },
  { id: 'o2', productId: 'p2', type: 'PERCENTAGE', discountValue: 20, buyQuantity: 0, freeQuantity: 0, label: '20% OFF' },
  { id: 'o3', productId: 'p3', type: 'BOGO', discountValue: 0, buyQuantity: 2, freeQuantity: 1, label: 'BUY 2 GET 1 FREE' },
  { id: 'o4', productId: 'p5', type: 'FLAT', discountValue: 5, buyQuantity: 0, freeQuantity: 0, label: '₹5 OFF' }
];

export const mockOrders = [
  { id: 'SC10234', customerId: 'u1', items: [{ productId: 'p1', quantity: 3 }, { productId: 'p2', quantity: 1 }], subtotal: 100, discount: 20, total: 80, date: '2026-08-08T10:00:00Z', status: 'Completed' },
  { id: 'SC10192', customerId: 'u1', items: [{ productId: 'p11', quantity: 2 }, { productId: 'p15', quantity: 1 }], subtotal: 155, discount: 0, total: 155, date: '2026-08-05T14:30:00Z', status: 'Completed' }
];

export const mockActivityLogs = [
  { id: 'a1', staffName: 'Rahul Staff', action: 'Added product "Oreo Original"', timestamp: '2026-08-09T10:32:00Z' },
  { id: 'a2', staffName: 'Aman Manager', action: 'Updated Lays stock', timestamp: '2026-08-09T11:15:00Z' },
  { id: 'a3', staffName: 'Rahul Staff', action: 'Created BOGO offer for Coke', timestamp: '2026-08-09T14:35:00Z' }
];
