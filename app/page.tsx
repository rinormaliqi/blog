import { client, urlFor } from './lib/sanity'
import Link from 'next/link'

export const revalidate = 60

interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage?: any
  publishedAt: string
  excerpt?: string
  authorName?: string
  category?: string
}

function getCategories(posts: Post[]) {
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))] as string[]
  return ['Të Gjitha', ...categories]
}

export default async function Home() {
  const posts: Post[] = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, mainImage, publishedAt, excerpt,
      "authorName": author->name,
      "category": category->title
    }
  `)

  const categories = getCategories(posts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100/30">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-xl">📰</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  PikeMbiPresje
                </span>
                <span className="text-xs text-gray-500 -mt-1">Lajmet e fundit</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  href={category === 'Të Gjitha' ? '#' : `#${category.toLowerCase()}`}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
                >
                  {category}
                  {category === 'Të Gjitha' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600">
                <span>🔍</span>
                <span className="text-sm">Kërko</span>
              </button>
              <button className="md:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <div className="w-6 h-0.5 bg-gray-600 mb-1.5 transition-transform"></div>
                <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
             Lajmet e  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">fundit</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Zbuloni lajmet më të fundit, analizat dhe tregimet ekskluzive nga e gjithë Bota
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  category === 'Të Gjitha' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 shadow-sm hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Post */}
        {posts.length > 0 && (
          <section className="mb-16">
            <Link 
              href={`/post/${posts[0].slug.current}`}
              className="group block bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="lg:grid lg:grid-cols-2 lg:gap-0">
                {posts[0].mainImage && (
                  <div className="overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <img
                      src={urlFor(posts[0].mainImage).width(1200).url()}
                      alt={posts[0].title}
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-8 lg:p-12 flex flex-col justify-center relative z-20">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                      {posts[0].category || 'Kryesore'}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      📍 Featured
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-6 leading-tight">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3 leading-relaxed">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        📅 {new Date(posts[0].publishedAt).toLocaleDateString('sq-AL', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        👤 Nga {posts[0].authorName || 'Autor i Panjohur'}
                      </span>
                    </div>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Lexo më shumë →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Artikujt e Fundit
              </h2>
              <p className="text-gray-600">
                Eksploroni tregimet më të reja dhe më të lexuara
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                {posts.length} artikuj në total
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        {/* Load More Section */}
        <section className="text-center mt-16">
          <button className="bg-white border-2 border-gray-300 text-gray-700 px-12 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-1">
            Shiko më shumë artikuj
          </button>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white mt-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">📰</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">PikeMbiPresje</span>
                  <p className="text-blue-200 text-sm">Lajmet e fundit 24/7</p>
                </div>
              </Link>
              <p className="text-gray-300 max-w-md text-lg leading-relaxed">
                Platforma kryesore për lajmet më të fundit nga Shqipëria dhe mbarë bota. 
                Ofrojmë informacion të shpejtë, të saktë dhe të thellë.
              </p>
              <div className="flex space-x-4 mt-6">
                {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                  <button key={index} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6">Lidhje të Shpejta</h3>
              <ul className="space-y-3">
                {['Lajmet e Fundit', 'Politikë', 'Ekonomi', 'Sport', 'Kulturë', 'Teknologji'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
                      <span>→</span>
                      <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6">Kontakt</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300">
                  <span>📧</span>
                  <span>info@pikembipresje.al</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <span>📞</span>
                  <span>+355 4X XXX XXXX</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <span>🏢</span>
                  <span>Tirana, Shqipëri</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} PikeMbiPresje. Të gjitha të drejtat e rezervuara.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privatësia</a>
              <a href="#" className="hover:text-white transition-colors">Kushtet</a>
              <a href="#" className="hover:text-white transition-colors">Rreth nesh</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Enhanced Article Card Component
function ArticleCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug.current}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2"
    >
      {post.mainImage && (
        <div className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
          <img
            src={urlFor(post.mainImage).width(600).url()}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {post.category || 'Lajme'}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {new Date(post.publishedAt).toLocaleDateString('sq-AL', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-3 text-lg leading-tight">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              👤 {post.authorName || 'Autor i Panjohur'}
            </span>
          </div>
          <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
            Lexo më shumë →
          </span>
        </div>
      </div>
    </Link>
  )
}