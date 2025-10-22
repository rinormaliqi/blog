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
    <div className="min-h-screen bg-white">
      {/* Classic Newspaper Header */}
      <header className="bg-white border-b-2 border-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col py-4">
            {/* Newspaper Name */}
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
              <Link href="/" className="inline-block">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight uppercase">
                  PikeMbiPresje
                </h1>
                <p className="text-sm text-gray-600 mt-1 tracking-wider uppercase">
                  Lajmet e fundit 24 orë • Prishtina, Kosove
                </p>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  href={category === 'Të Gjitha' ? '#' : `#${category.toLowerCase()}`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide transition-colors duration-200 border-b-2 border-transparent hover:border-gray-900 pb-1"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Date and Edition */}
        <div className="text-center border-y border-gray-300 py-2 mb-8">
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            {new Date().toLocaleDateString('sq-AL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • Edicioni Ditor
          </p>
        </div>

        {/* Featured Post - Newspaper Style */}
        {posts.length > 0 && (
          <section className="mb-12 border-b-2 border-gray-900 pb-12">
            <Link 
              href={`/post/${posts[0].slug.current}`}
              className="group block"
            >
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <span className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1 mb-4 uppercase tracking-wide">
                    {posts[0].category || 'Lajm Kryesor'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4 font-serif">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Nga {posts[0].authorName || 'Stafi'}</span>
                    <span>•</span>
                    <span>
                      {new Date(posts[0].publishedAt).toLocaleDateString('sq-AL', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Image */}
                {posts[0].mainImage && (
                  <div className="lg:col-span-1">
                    <div className="border-2 border-gray-900 p-1 bg-white">
                      <img
                        src={urlFor(posts[0].mainImage).width(800).url()}
                        alt={posts[0].title}
                        className="w-full h-64 object-cover group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </section>
        )}

        {/* Category Filter - Minimal */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center border-y border-gray-300 py-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 border ${
                  category === 'Të Gjitha' 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid - Newspaper Columns */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-wide">
              Lajmet e Fundit
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1">
              {posts.length} artikuj
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {posts.slice(1).map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        {/* Classic Load More */}
        <section className="text-center border-t border-gray-300 pt-8">
          <button className="bg-white border border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-all duration-200 font-medium text-sm uppercase tracking-wide">
            Shiko më shumë lajme
          </button>
        </section>
      </main>

      {/* Classic Newspaper Footer */}
      <footer className="bg-gray-900 text-white mt-16 border-t-4 border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-serif text-2xl font-bold mb-4">PikeMbiPresje</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Gazetë e pavarur e themeluar në vitin 2024. 
                Ofrojmë lajme të përditshme, të sakta dhe të paanshme për lexuesit shqiptarë.
              </p>
            </div>

            {/* Sections */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-700 pb-2">
                Seksione
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {['Politikë', 'Ekonomi', 'Sport', 'Kulturë', 'Teknologji', 'Shëndetësi'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors text-gray-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-700 pb-2">
                Kontakt
              </h4>
           <ul className="space-y-2 text-sm text-gray-300">
                  <li>pikembipresje@gmail.com</li>
                  <li>+383 44 879 290</li>
                  <li>Prishtina, Kosove</li>
                </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PikeMbiPresje. Të gjitha të drejtat e rezervuara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Classic Newspaper Article Card
function ArticleCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug.current}`}
      className="group block border-b border-gray-300 pb-6 hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex flex-col h-full">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
            {post.category || 'Lajme'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString('sq-AL', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-3 leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-700 text-sm leading-relaxed flex-grow mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author and Read More */}
        <div className="flex justify-between items-center text-xs text-gray-600 mt-auto">
          <span>Nga {post.authorName || 'Stafi'}</span>
          <span className="font-medium group-hover:underline">Lexo më tej →</span>
        </div>

        {/* Optional Image */}
        {post.mainImage && (
          <div className="mt-4 border border-gray-300 p-1 bg-white">
            <img
              src={urlFor(post.mainImage).width(400).url()}
              alt={post.title}
              className="w-full h-32 object-cover group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}
      </div>
    </Link>
  )
}