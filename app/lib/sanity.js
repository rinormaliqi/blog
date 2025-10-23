// lib/sanity.js
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'yw6b68x6',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false, // ⚠️ turn off CDN for fresh content
})
export const revalidate = 0 // or 'force-dynamic' in Next 14+


const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
