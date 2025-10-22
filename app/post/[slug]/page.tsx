import { client, urlFor } from '../../lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(`
    *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
  `)
  return slugs.map((item) => ({ slug: item.slug }))
}

interface PostPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

// Portable Text Components
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-gray-700 text-lg leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-600 text-xl my-8 bg-blue-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-lg">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700 text-lg">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
    number: ({ children }: any) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} className="text-blue-600 hover:text-blue-800 underline transition-colors">
        {children}
      </a>
    ),
  },
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params
  const slug = params?.slug

  if (!slug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-mint/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gabim</h1>
          <p className="text-gray-600">Mungon parametri i nevojshëm për të shfaqur artikullin.</p>
          <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Kthehu në Faqen Kryesore
          </Link>
        </div>
      </div>
    )
  }

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      gallery,
      body,
      publishedAt,
      excerpt,
      "authorName": author->name,
      "authorImage": author->image,
      "category": category->title,
      "categorySlug": category->slug.current
    }`,
    { slug }
  )

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-mint/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artikulli nuk u gjet</h1>
          <p className="text-gray-600 mb-4">
            Artikulli me emrin <b>{slug}</b> nuk ekziston.
          </p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Eksploroni Artikuj të Tjerë
          </Link>
        </div>
      </div>
    )
  }

  // Fetch related posts
  const relatedPosts = await client.fetch(
    `*[_type == "post" && slug.current != $slug && category->title == $category][0..2]{
      title,
      slug,
      mainImage,
      publishedAt,
      "category": category->title,
      "authorName": author->name
    }`,
    { slug, category: post.category }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-100/20">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
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

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                🏠 Kryefaqja
              </Link>
              <Link href={`/category/${post.categorySlug}`} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                📂 {post.category}
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                📖 Duke lexuar
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Kryefaqja</Link>
          <span>→</span>
          <Link href={`/category/${post.categorySlug}`} className="hover:text-blue-600 transition-colors">{post.category}</Link>
          <span>→</span>
          <span className="text-gray-700 font-medium">Artikulli</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Article Header */}
            <header className="mb-8 text-center bg-white">
              <div className="flex justify-center mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Meta Info */}
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="flex items-center space-x-3">
                  {post.authorImage ? (
                    <Image
                      src={urlFor(post.authorImage).width(100).url()}
                      alt={post.authorName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.authorName?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{post.authorName}</p>
                    <p className="text-sm text-gray-500">Autor</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-300"></div>

                <div className="text-center">
                  <p className="text-gray-900 font-semibold">
                    {new Date(post.publishedAt).toLocaleDateString('sq-AL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">Data e Publikimit</p>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.mainImage && (
              <div className="relative w-full h-[500px] mb-12 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(post.mainImage).width(1600).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {post.body && (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              )}
            </div>

            {/* Image Gallery */}
            {post.gallery?.length > 0 && (
              <section className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeria e Fotove</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {post.gallery.map((img: any, i: number) => (
                    <div key={i} className="group relative w-full h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={urlFor(img).width(600).url()}
                        alt={`Gallery image ${i + 1} - ${post.title}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Shpërndaje:</span>
                  <div className="flex space-x-3">
                    {['📱', '💬', '📤', '🔗'].map((icon, index) => (
                      <button key={index} className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200">
                        <span className="text-lg">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>🏷️</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Author Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Rreth Autorit</h3>
              <div className="flex items-center space-x-3 mb-4">
                {post.authorImage ? (
                  <Image
                    src={urlFor(post.authorImage).width(100).url()}
                    alt={post.authorName}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {post.authorName?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.authorName}</p>
                  <p className="text-sm text-gray-500">Shkrimtar & Gazetar</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Ekspert në fushën e {post.category.toLowerCase()}. Kontribuon me analiza dhe opinionet e tij në platformën tonë.
              </p>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Artikuj të Ngjashëm</h3>
                <div className="space-y-4">
                  {relatedPosts.map((related: any) => (
                    <Link
                      key={related.slug.current}
                      href={`/post/${related.slug.current}`}
                      className="group block"
                    >
                      <div className="flex items-center space-x-3">
                        {related.mainImage && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={urlFor(related.mainImage).width(100).url()}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(related.publishedAt).toLocaleDateString('sq-AL')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3 text-lg">📧 Regjistrohu për Lajme</h3>
              <p className="text-blue-100 text-sm mb-4">
                Merrni lajmet më të fundit direkt në email-in tuaj.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Emaili juaj"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-blue-200 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    Regjistrohu
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📰</span>
                </div>
                <span className="text-2xl font-bold text-white">PikeMbiPresje</span>
              </Link>
              <p className="text-gray-300 max-w-md text-sm leading-relaxed">
                Platforma kryesore për lajmet më të fundit nga Shqipëria dhe mbarë bota. 
                Informim i shpejtë, i saktë dhe i thellë.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Lidhje të Shpejta</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Kryefaqja</Link></li>
                <li><Link href={`/category/${post.categorySlug}`} className="text-gray-300 hover:text-white transition-colors">{post.category}</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rreth Nesh</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Na Ndiqni</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} PikeMbiPresje. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}