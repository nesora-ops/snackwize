/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Supabase Storage (uploaded product photos)
      { protocol: 'https', hostname: '**.supabase.co' },
      // Placeholder images for products awaiting a real photo
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
}

export default nextConfig
