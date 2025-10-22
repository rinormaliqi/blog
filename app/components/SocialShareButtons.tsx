'use client'

import { useState } from 'react'

interface SocialShareButtonsProps {
  title: string
  excerpt: string
  slug: string
}

export default function SocialShareButtons({ title, excerpt, slug }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  const siteUrl = 'https://blog.pikembipresje.com'
  const pageUrl = `${siteUrl}/post/${slug}`
  const shareText = `${title} - ${excerpt}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: pageUrl,
        })
      } catch (error) {
        console.log('Sharing cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(pageUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = pageUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200 relative"
        title="Shpërndaj"
      >
        <span className="text-lg">📤</span>
        {copied && (
          <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            U kopjua!
          </span>
        )}
      </button>

      {/* Facebook */}
      <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
        title="Shpërndaj në Facebook"
      >
        <span className="text-lg">📘</span>
      </a>

      {/* Twitter */}
      <a
        href={socialLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
        title="Shpërndaj në Twitter"
      >
        <span className="text-lg">🐦</span>
      </a>

      {/* LinkedIn */}
      <a
        href={socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
        title="Shpërndaj në LinkedIn"
      >
        <span className="text-lg">💼</span>
      </a>
    </div>
  )
}