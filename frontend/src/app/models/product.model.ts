export type Category = 'men' | 'women' | 'kids';
export type ProductType = 'clothing' | 'shoes';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: Category;
  type: ProductType;
  description: string;
  sizes: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Urban Slim Fit Jacket', brand: 'NOIR', price: 129.99, originalPrice: 179.99,
    category: 'men', type: 'clothing',
    description: 'Premium slim fit jacket crafted from recycled materials. Perfect for the modern urban explorer.',
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','Navy','Olive'],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'],
    rating: 4.7, reviewCount: 234, isSale: true, tags: ['jacket','urban','slim']
  },
  {
    id: 2, name: 'Classic Oxford Shirt', brand: 'BLANC', price: 79.99,
    category: 'men', type: 'clothing',
    description: 'Timeless oxford shirt with a modern cut. Versatile enough for office or casual wear.',
    sizes: ['S','M','L','XL','XXL'], colors: ['White','Light Blue','Pink'],
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80'],
    rating: 4.5, reviewCount: 189, isNew: true, tags: ['shirt','oxford','classic']
  },
  {
    id: 3, name: 'Tapered Chino Pants', brand: 'NOIR', price: 89.99,
    category: 'men', type: 'clothing',
    description: 'Modern tapered chinos with stretch fabric for all-day comfort.',
    sizes: ['28','30','32','34','36','38'], colors: ['Beige','Navy','Khaki','Black'],
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'],
    rating: 4.6, reviewCount: 312, tags: ['pants','chino','tapered']
  },
  {
    id: 4, name: 'Street Runner Pro', brand: 'VOLT', price: 159.99, originalPrice: 199.99,
    category: 'men', type: 'shoes',
    description: 'High-performance street runners with responsive cushioning and bold design.',
    sizes: ['40','41','42','43','44','45','46'], colors: ['White/Black','Black/Red','Grey/Blue'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
    rating: 4.8, reviewCount: 567, isSale: true, tags: ['sneakers','running','sport']
  },
  {
    id: 5, name: 'Premium Leather Derby', brand: 'ÉLITE', price: 219.99,
    category: 'men', type: 'shoes',
    description: 'Hand-stitched premium leather derby shoes. A timeless investment piece.',
    sizes: ['40','41','42','43','44','45'], colors: ['Dark Brown','Black','Tan'],
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80'],
    rating: 4.9, reviewCount: 145, isNew: true, tags: ['leather','derby','formal']
  },
  {
    id: 6, name: 'Silk Flow Blouse', brand: 'LUMIÈRE', price: 99.99,
    category: 'women', type: 'clothing',
    description: 'Luxurious silk-feel blouse with elegant draping. Effortlessly chic.',
    sizes: ['XS','S','M','L','XL'], colors: ['Ivory','Blush','Sage','Midnight'],
    images: ['https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80'],
    rating: 4.7, reviewCount: 423, isNew: true, tags: ['blouse','silk','elegant']
  },
  {
    id: 7, name: 'High-Waist Flare Jeans', brand: 'DENIM CO.', price: 109.99, originalPrice: 139.99,
    category: 'women', type: 'clothing',
    description: 'Retro-inspired high-waist flare jeans. Flattering silhouette with stretch comfort.',
    sizes: ['24','25','26','27','28','29','30'], colors: ['Classic Blue','Black','Light Wash'],
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'],
    rating: 4.6, reviewCount: 289, isSale: true, tags: ['jeans','flare','high-waist']
  },
  {
    id: 8, name: 'Wrap Midi Dress', brand: 'LUMIÈRE', price: 139.99,
    category: 'women', type: 'clothing',
    description: 'Versatile wrap midi dress perfect for any occasion. Adjustable fit.',
    sizes: ['XS','S','M','L','XL'], colors: ['Floral Print','Solid Black','Terracotta'],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'],
    rating: 4.8, reviewCount: 534, isNew: true, tags: ['dress','midi','wrap']
  },
  {
    id: 9, name: 'Block Heel Mule', brand: 'ÉLITE', price: 149.99, originalPrice: 189.99,
    category: 'women', type: 'shoes',
    description: 'Comfortable block heel mules with premium leather upper. Day to night.',
    sizes: ['35','36','37','38','39','40','41'], colors: ['Nude','Black','White','Cognac'],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'],
    rating: 4.5, reviewCount: 198, isSale: true, tags: ['heels','mule','block-heel']
  },
  {
    id: 10, name: 'Cloud Foam Sneaker', brand: 'VOLT', price: 129.99,
    category: 'women', type: 'shoes',
    description: 'Ultra-light foam sneakers with minimalist design. Walk on clouds.',
    sizes: ['35','36','37','38','39','40','41'], colors: ['White','Blush','Sage','Black'],
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80'],
    rating: 4.7, reviewCount: 612, isNew: true, tags: ['sneakers','foam','lightweight']
  },
  {
    id: 11, name: 'Mini Explorer Set', brand: 'PETITS', price: 49.99,
    category: 'kids', type: 'clothing',
    description: 'Durable and comfy adventure set for little explorers. Easy care fabric.',
    sizes: ['2Y','3Y','4Y','5Y','6Y','7Y','8Y'], colors: ['Forest Green','Sky Blue','Coral'],
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80'],
    rating: 4.8, reviewCount: 345, isNew: true, tags: ['kids','set','adventure']
  },
  {
    id: 12, name: 'Dino Print Hoodie', brand: 'PETITS', price: 39.99, originalPrice: 54.99,
    category: 'kids', type: 'clothing',
    description: 'Super soft hoodie with fun dino print. Kids love it!',
    sizes: ['2Y','3Y','4Y','5Y','6Y','7Y','8Y','10Y'], colors: ['Grey/Dino','Blue/Dino','Pink/Dino'],
    images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80'],
    rating: 4.9, reviewCount: 478, isSale: true, tags: ['hoodie','kids','dino']
  },
  {
    id: 13, name: 'Jump & Run Sneaker', brand: 'VOLT', price: 59.99,
    category: 'kids', type: 'shoes',
    description: 'Lightweight and durable sneakers built for active kids. Easy velcro closure.',
    sizes: ['28','29','30','31','32','33','34','35'], colors: ['Blue/Orange','Pink/White','Black/Green'],
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80'],
    rating: 4.7, reviewCount: 267, isNew: true, tags: ['kids','sneakers','velcro']
  },
  {
    id: 14, name: 'Rainbow Boot', brand: 'PETITS', price: 54.99, originalPrice: 69.99,
    category: 'kids', type: 'shoes',
    description: 'Waterproof rain boots with rainbow design. Splashing puddles never looked so good.',
    sizes: ['24','25','26','27','28','29','30'], colors: ['Rainbow','All Black','Pink Stars'],
    images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80'],
    rating: 4.8, reviewCount: 389, isSale: true, tags: ['kids','boots','rain']
  },
  {
    id: 15, name: 'Oversized Wool Coat', brand: 'NOIR', price: 299.99, originalPrice: 399.99,
    category: 'women', type: 'clothing',
    description: 'Luxurious oversized wool blend coat. The ultimate winter statement piece.',
    sizes: ['XS','S','M','L','XL'], colors: ['Camel','Black','Cream'],
    images: ['https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80'],
    rating: 4.9, reviewCount: 156, isSale: true, tags: ['coat','wool','oversized','winter']
  },
  {
    id: 16, name: 'Cargo Utility Pants', brand: 'VOLT', price: 94.99,
    category: 'men', type: 'clothing',
    description: 'Technical cargo pants with multiple pockets. Built for the streets.',
    sizes: ['28','30','32','34','36'], colors: ['Olive','Black','Stone'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
    rating: 4.6, reviewCount: 203, isNew: true, tags: ['cargo','pants','utility']
  }
];
