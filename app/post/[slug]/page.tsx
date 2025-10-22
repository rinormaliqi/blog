import { client, urlFor } from '../../lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import SocialShareButtons from '../../components/SocialShareButtons';

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(`
    *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
  `)
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> | { slug: string } }) {
  const params = await props.params
  const slug = params?.slug

  if (!slug) {
    return {
      title: 'Artikulli nuk u gjet - PikeMbiPresje',
      description: 'Artikulli i kërkuar nuk ekziston.',
    }
  }

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      excerpt,
      publishedAt,
      "authorName": author->name,
      "category": category->title
    }`,
    { slug }
  )

  if (!post) {
    return {
      title: 'Artikulli nuk u gjet - PikeMbiPresje',
      description: 'Artikulli i kërkuar nuk ekziston.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.pikembipresje.com'
  const pageUrl = `${siteUrl}/post/${slug}`
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : `${siteUrl}/og-default.jpg`

  return {
    title: `${post.title} | PikeMbiPresje`,
    description: post.excerpt || `Lexoni artikullin e fundit nga kategoria ${post.category} në PikeMbiPresje.`,
    
    openGraph: {
      title: post.title,
      description: post.excerpt || `Lexoni artikullin e fundit nga kategoria ${post.category}.`,
      type: 'article',
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      section: post.category,
      siteName: 'PikeMbiPresje',
      locale: 'sq_AL',
    },

    twitter: {
      card: 'summary_large_image',
      site: '@pikembipresje',
      creator: '@pikembipresje',
      title: post.title,
      description: post.excerpt || `Lexoni artikullin e fundit nga kategoria ${post.category}.`,
      images: [imageUrl],
    },

    authors: [{ name: post.authorName }],
    category: post.category,
    keywords: [post.category, 'lajme', 'shqip', 'shqipëri'],

    alternates: {
      canonical: pageUrl,
    },
  }
}

interface PostPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

// Classic Newspaper Portable Text Components
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-12 mb-6 leading-tight border-b-2 border-gray-900 pb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-10 mb-4 leading-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl md:text-2xl font-serif font-semibold text-gray-900 mt-8 mb-3 leading-tight">{children}</h3>,
    normal: ({ children }: any) => <p className="text-gray-700 text-lg leading-relaxed mb-6 font-serif">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-900 pl-6 italic text-gray-700 text-xl my-8 bg-gray-50 py-4 font-serif leading-relaxed">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700 text-lg font-serif">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700 text-lg font-serif">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
    number: ({ children }: any) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} className="text-gray-900 underline hover:text-gray-700 transition-colors">
        {children}
      </a>
    ),
  },
}

function generateStructuredData(post: any, slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.pikembipresje.com'
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).url() : `${siteUrl}/og-default.jpg`

  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.title,
      "description": post.excerpt,
      "image": imageUrl,
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "PikeMbiPresje",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/post/${slug}`
      },
      "articleSection": post.category
    })
  }
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params
  const slug = params?.slug

  if (!slug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">Gabim</h1>
          <p className="text-gray-600 mb-6">Mungon parametri i nevojshëm për të shfaqur artikullin.</p>
          <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">Artikulli nuk u gjet</h1>
          <p className="text-gray-600 mb-6">
            Artikulli me emrin <b>{slug}</b> nuk ekziston.
          </p>
          <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium">
            Eksploroni Artikuj të Tjerë
          </Link>
        </div>
      </div>
    )
  }

  const structuredData = generateStructuredData(post, slug)

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
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={structuredData}
      />

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
              <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                <Link href="/" className="text-gray-700 hover:text-gray-900 uppercase tracking-wide border-b-2 border-transparent hover:border-gray-900 pb-1">
                  Kryefaqja
                </Link>
                <Link href={`/category/${post.categorySlug}`} className="text-gray-700 hover:text-gray-900 uppercase tracking-wide border-b-2 border-transparent hover:border-gray-900 pb-1">
                  {post.category}
                </Link>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 text-xs uppercase tracking-wide">
                  Duke Lexuar
                </span>
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

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Article Header */}
              <header className="mb-12 text-center bg-white">
                <div className="flex justify-center mb-6">
                  <span className="bg-gray-900 text-white text-xs px-4 py-2 uppercase tracking-wide font-medium">
                    {post.category}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed font-serif italic">
                    {post.excerpt}
                  </p>
                )}

                {/* Author & Meta Info */}
                <div className="flex items-center justify-center space-x-8 mb-8 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    {post.authorImage ? (
                      <Image
                        src={urlFor(post.authorImage).width(100).url()}
                        alt={post.authorName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                        {post.authorName?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{post.authorName}</p>
                      <p className="text-xs">Korrespondent</p>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-gray-300"></div>

                  <div className="text-center">
                    <p className="text-gray-900 font-semibold">
                      {new Date(post.publishedAt).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs">Data e Publikimit</p>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.mainImage && (
                <div className="relative w-full h-[400px] mb-12 border-2 border-gray-900 p-1 bg-white">
                  <Image
                    src={urlFor(post.mainImage).width(1200).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-sm text-gray-700">
                    Foto: {post.authorName || 'Arkivi'}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none font-serif">
                  {post.body && (
                    <PortableText
                      value={post.body}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              {post.gallery?.length > 0 && (
                <section className="mt-12 border-t border-gray-300 pt-8">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 uppercase tracking-wide">Galeria Fotografike</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {post.gallery.map((img: any, i: number) => (
                      <div key={i} className="group relative w-full h-64 border border-gray-300 p-1 bg-white">
                        <Image
                          src={urlFor(img).width(600).url()}
                          alt={`Gallery image ${i + 1} - ${post.title}`}
                          fill
                          className="object-cover transition-all duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-300">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 uppercase tracking-wide">Shpërndaje:</span>
                    <SocialShareButtons 
                      title={post.title}
                      excerpt={post.excerpt || ''}
                      slug={slug}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 uppercase tracking-wide text-xs">Kategoria: {post.category}</span>
                  </div>
                </div>
              </footer>
            </article>

            {/* Sidebar - Classic Newspaper Style */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Author Card */}
              <div className="bg-white border border-gray-300 p-6">
                <h3 className="font-serif font-bold text-gray-900 mb-4 text-lg uppercase tracking-wide border-b border-gray-300 pb-2">Rreth Autorit</h3>
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
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {post.authorName?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{post.authorName}</p>
                    <p className="text-sm text-gray-600">Gazetar</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ekspert në fushën e {post.category.toLowerCase()}. Kontribuon me analiza dhe reportazhe të thelluara.
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white border border-gray-300 p-6">
                  <h3 className="font-serif font-bold text-gray-900 mb-4 text-lg uppercase tracking-wide border-b border-gray-300 pb-2">Lajme të Ngjashme</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related: any) => (
                      <Link
                        key={related.slug.current}
                        href={`/post/${related.slug.current}`}
                        className="group block border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start space-x-3">
                          {related.mainImage && (
                            <div className="relative w-16 h-16 border border-gray-300 p-0.5 flex-shrink-0">
                              <Image
                                src={urlFor(related.mainImage).width(100).url()}
                                alt={related.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors text-sm leading-tight mb-1 line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {new Date(related.publishedAt).toLocaleDateString('sq-AL', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Classic Newsletter */}
              <div className="bg-gray-100 border border-gray-300 p-6">
                <h3 className="font-serif font-bold text-gray-900 mb-3 text-lg uppercase tracking-wide">Abonohu</h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Merrni lajmet e fundit direkt në email-in tuaj çdo mëngjes.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Emaili juaj"
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 text-sm"
                  />
                  <button className="w-full bg-gray-900 text-white font-medium py-2 hover:bg-gray-800 transition-colors text-sm uppercase tracking-wide">
                    Regjistrohu
                  </button>
                </div>
              </div>
            </aside>
          </div>
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
    </>
  )
}
