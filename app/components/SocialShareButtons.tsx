'use client'

import { useState } from 'react'
import { 
  RiShareForwardLine, 
  RiFacebookFill, 
  RiTwitterXFill, 
  RiLinkedinFill,
  RiLinksLine,
  RiCheckLine
} from 'react-icons/ri'

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
    <div className="flex items-center space-x-2">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 relative group"
        title="Shpërndaj"
      >
        {copied ? (
          <RiCheckLine className="text-green-600 text-lg" />
        ) : (
          <RiShareForwardLine className="text-gray-700 text-lg group-hover:text-gray-900" />
        )}
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            U kopjua!
          </span>
        )}
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleShare}
        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 group"
        title="Kopjo linkun"
      >
        <RiLinksLine className="text-gray-700 text-lg group-hover:text-gray-900" />
      </button>

      {/* Facebook */}
      <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-blue-50 rounded-full flex items-center justify-center transition-all duration-200 group"
        title="Shpërndaj në Facebook"
      >
        <RiFacebookFill className="text-gray-700 text-lg group-hover:text-blue-600" />
      </a>

      {/* Twitter/X */}
      <a
        href={socialLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-gray-50 rounded-full flex items-center justify-center transition-all duration-200 group"
        title="Shpërndaj në Twitter"
      >
        <RiTwitterXFill className="text-gray-700 text-lg group-hover:text-gray-900" />
      </a>

      {/* LinkedIn */}
      <a
        href={socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-blue-50 rounded-full flex items-center justify-center transition-all duration-200 group"
        title="Shpërndaj në LinkedIn"
      >
        <RiLinkedinFill className="text-gray-700 text-lg group-hover:text-blue-700" />
      </a>
    </div>
  )
}