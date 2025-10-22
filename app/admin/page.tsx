import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('https://pikembipresje-blog.sanity.studio/')
}

// Optional: If you want this to be a permanent redirect
// export const dynamic = 'force-static'