const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Classic Men Shirt',
    description: 'Premium cotton formal shirt for men. Perfect for office wear and casual outings.',
    price: 8200,
    originalPrice: 12000,
    category: 'Men',
    image: '/images/men_clothing_2.png',
    stock: 45,
    rating: 4.5,
    numReviews: 12,
    featured: true,
    onSale: true,
    tags: ['shirt', 'formal', 'cotton']
  },
  {
    name: 'Men Hoodie',
    description: 'Comfortable fleece hoodie for winter. Soft interior with adjustable hood.',
    price: 3500,
    originalPrice: 5000,
    category: 'Men',
    image: '/images/men_clothing_4.png',
    stock: 30,
    rating: 4.3,
    numReviews: 8,
    featured: false,
    onSale: true,
    tags: ['hoodie', 'winter', 'casual']
  },
  {
    name: 'Men Coat',
    description: 'Elegant wool-blend coat. Ideal for winter fashion.',
    price: 9500,
    originalPrice: 14000,
    category: 'Men',
    image: '/images/men_clothing_1.png',
    stock: 20,
    rating: 4.7,
    numReviews: 15,
    featured: true,
    onSale: true,
    tags: ['coat', 'winter', 'premium']
  },
  {
    name: 'Casual Denim Jacket',
    description: 'Stylish denim jacket with classic cut. A wardrobe essential.',
    price: 5500,
    originalPrice: 7500,
    category: 'Men',
    image: '/images/product1.png',
    stock: 35,
    rating: 4.4,
    numReviews: 10,
    featured: false,
    onSale: false,
    tags: ['jacket', 'denim', 'casual']
  },
  {
    name: 'Travel Duffel Bag',
    description: 'Spacious travel bag with multiple compartments. Water-resistant material.',
    price: 4200,
    originalPrice: 6000,
    category: 'Accessories',
    image: '/images/product2.png',
    stock: 25,
    rating: 4.6,
    numReviews: 9,
    featured: false,
    onSale: true,
    tags: ['bag', 'travel', 'duffel']
  },
  {
    name: 'Ladies Purse',
    description: 'Elegant leather purse for women. Multiple card slots and compartments.',
    price: 3200,
    originalPrice: 4500,
    category: 'Women',
    image: '/images/hot_1.png',
    stock: 40,
    rating: 4.5,
    numReviews: 18,
    featured: true,
    onSale: false,
    tags: ['purse', 'leather', 'women']
  },
  {
    name: 'Ladies Dress - Floral',
    description: 'Beautiful floral print dress for casual and semi-formal occasions.',
    price: 5800,
    originalPrice: 8000,
    category: 'Women',
    image: '/images/hot_2.png',
    stock: 22,
    rating: 4.8,
    numReviews: 20,
    featured: true,
    onSale: true,
    tags: ['dress', 'floral', 'women']
  },
  {
    name: 'Designer Hand Bag',
    description: 'Premium quality handbag with elegant design. Perfect for everyday use.',
    price: 4500,
    originalPrice: 6500,
    category: 'Women',
    image: '/images/hot_3.png',
    stock: 30,
    rating: 4.3,
    numReviews: 7,
    featured: false,
    onSale: false,
    tags: ['handbag', 'designer', 'women']
  },
  {
    name: 'Women Heels',
    description: 'Stylish heels for women. Comfortable for all-day wear.',
    price: 3800,
    originalPrice: 5500,
    category: 'Shoes',
    image: '/images/hot_4.png',
    stock: 18,
    rating: 4.2,
    numReviews: 6,
    featured: false,
    onSale: true,
    tags: ['heels', 'women', 'formal']
  },
  {
    name: 'Elegant Dress',
    description: 'Premium evening dress for special occasions.',
    price: 6200,
    originalPrice: 8500,
    category: 'Women',
    image: '/images/product3.png',
    stock: 15,
    rating: 4.7,
    numReviews: 14,
    featured: false,
    onSale: false,
    tags: ['dress', 'evening', 'premium']
  },
  {
    name: 'Ladies Casual Dress',
    description: 'Comfortable casual dress for daily wear. Soft breathable fabric.',
    price: 4800,
    originalPrice: 6000,
    category: 'Women',
    image: '/images/product4.png',
    stock: 28,
    rating: 4.4,
    numReviews: 11,
    featured: false,
    onSale: false,
    tags: ['dress', 'casual', 'women']
  },
  {
    name: 'Classic Sandal',
    description: 'Comfortable leather sandal for men. Durable rubber sole.',
    price: 2200,
    originalPrice: 3500,
    category: 'Shoes',
    image: '/images/product5.png',
    stock: 50,
    rating: 4.1,
    numReviews: 22,
    featured: true,
    onSale: true,
    tags: ['sandal', 'men', 'leather']
  },
  {
    name: 'Hand Bag Premium',
    description: 'Premium quality handbag with golden accents.',
    price: 3800,
    originalPrice: 5000,
    category: 'Accessories',
    image: '/images/product6.png',
    stock: 20,
    rating: 4.5,
    numReviews: 8,
    featured: false,
    onSale: false,
    tags: ['handbag', 'premium', 'accessories']
  },
  {
    name: 'Luxury Watch',
    description: 'Premium analog watch with leather strap. Water resistant.',
    price: 8500,
    originalPrice: 12000,
    category: 'Accessories',
    image: '/images/product7.png',
    stock: 12,
    rating: 4.9,
    numReviews: 25,
    featured: true,
    onSale: false,
    tags: ['watch', 'luxury', 'premium']
  },
  {
    name: 'Men Casual Shirt',
    description: 'Relaxed fit casual shirt. Perfect for weekend outings.',
    price: 3500,
    originalPrice: 5000,
    category: 'Men',
    image: '/images/product8.png',
    stock: 40,
    rating: 4.3,
    numReviews: 13,
    featured: false,
    onSale: true,
    tags: ['shirt', 'casual', 'men']
  },
  {
    name: 'Premium Loafer',
    description: 'Classic loafers for men. High-quality leather construction.',
    price: 5500,
    originalPrice: 7500,
    category: 'Shoes',
    image: '/images/product9.png',
    stock: 22,
    rating: 4.6,
    numReviews: 9,
    featured: false,
    onSale: false,
    tags: ['loafer', 'leather', 'men']
  },
  {
    name: 'Designer Shirt',
    description: 'Premium designer shirt with modern fit.',
    price: 6800,
    originalPrice: 9500,
    category: 'Men',
    image: '/images/product10.png',
    stock: 18,
    rating: 4.7,
    numReviews: 16,
    featured: false,
    onSale: true,
    tags: ['shirt', 'designer', 'premium']
  },
  {
    name: 'Winter Sweater',
    description: 'Warm knitted sweater for cold weather. 100% wool blend.',
    price: 4200,
    originalPrice: 6000,
    category: 'Men',
    image: '/images/product11.png',
    stock: 25,
    rating: 4.4,
    numReviews: 7,
    featured: false,
    onSale: false,
    tags: ['sweater', 'winter', 'wool']
  },
  {
    name: 'Printed Shirt',
    description: 'Trendy printed shirt for modern men.',
    price: 3800,
    originalPrice: 5200,
    category: 'Men',
    image: '/images/product12.jpg',
    stock: 32,
    rating: 4.2,
    numReviews: 5,
    featured: false,
    onSale: false,
    tags: ['shirt', 'printed', 'trendy']
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking and notifications.',
    price: 12500,
    originalPrice: 18000,
    category: 'Accessories',
    image: '/images/product13.jpg',
    stock: 10,
    rating: 4.8,
    numReviews: 30,
    featured: true,
    onSale: true,
    tags: ['watch', 'smart', 'tech']
  },
  {
    name: 'Red Designer Shirt',
    description: 'Bold red shirt for making a statement.',
    price: 4200,
    originalPrice: 5800,
    category: 'Men',
    image: '/images/product14.jpg',
    stock: 20,
    rating: 4.3,
    numReviews: 8,
    featured: false,
    onSale: false,
    tags: ['shirt', 'red', 'bold']
  },
  {
    name: 'Sport Watch',
    description: 'Durable sports watch with multiple features. Shock resistant.',
    price: 6500,
    originalPrice: 9000,
    category: 'Accessories',
    image: '/images/product15.jpg',
    stock: 15,
    rating: 4.5,
    numReviews: 11,
    featured: false,
    onSale: true,
    tags: ['watch', 'sport', 'durable']
  },
  {
    name: 'Wireless Air Buds',
    description: 'Premium wireless earbuds with noise cancellation and 24hr battery.',
    price: 5800,
    originalPrice: 8500,
    category: 'Accessories',
    image: '/images/product16.jpg',
    stock: 30,
    rating: 4.7,
    numReviews: 35,
    featured: true,
    onSale: false,
    tags: ['earbuds', 'wireless', 'tech']
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with RFID protection. Slim design.',
    price: 3200,
    originalPrice: 4500,
    category: 'Accessories',
    image: '/images/product17.jpg',
    stock: 45,
    rating: 4.6,
    numReviews: 20,
    featured: false,
    onSale: false,
    tags: ['wallet', 'leather', 'rfid']
  }
];

const categories = [
  { name: 'Men', description: 'Men\'s clothing and fashion', image: '/images/333.jpg' },
  { name: 'Women', description: 'Women\'s clothing and fashion', image: '/images/download-2.jpg' },
  { name: 'Accessories', description: 'Watches, bags, wallets and more', image: '/images/download (1).jpg' },
  { name: 'Shoes', description: 'Footwear for everyone', image: '/images/shoes.png' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    await Category.insertMany(categories);
    console.log('Categories seeded');

    await Product.insertMany(products);
    console.log('Products seeded');

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@ecomshop.pk',
        password: 'admin123',
        phone: '+92 300 1234567',
        role: 'admin'
      });
      console.log('Admin user created: admin@ecomshop.pk / admin123');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
