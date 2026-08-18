import { Link } from 'react-router-dom';

const posts = [
  { id: 1, title: 'Latest Fashion Trends 2026', excerpt: 'Discover the hottest fashion trends dominating the industry this year. From minimalist aesthetics to bold statement pieces.', image: '/images/download (3).jpg', date: 'Aug 10, 2026', tag: 'Fashion' },
  { id: 2, title: 'Why Online Shopping is Better', excerpt: 'Explore the numerous advantages of shopping online, from convenience to better prices and wider selections.', image: '/images/download (4).jpg', date: 'Aug 5, 2026', tag: 'Shopping' },
  { id: 3, title: 'How to Choose Quality Products', excerpt: 'Learn the secrets to selecting high-quality products that will last. Tips from our fashion experts.', image: '/images/slider1.png', date: 'Jul 28, 2026', tag: 'Tips' },
];

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Blog</h1>
        <p className="text-gray-500">Fashion tips, trends, and shopping guides</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition group">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full">{post.tag}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h2 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-accent transition">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
              <span className="text-sm text-accent hover:text-accent-light font-medium cursor-pointer transition">Read More →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
