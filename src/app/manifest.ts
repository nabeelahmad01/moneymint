import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MoneyMint',
        short_name: 'MoneyMint',
        description: 'Earn Daily Rewards - Smart Investment Platform',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0a0a0f',
        theme_color: '#00d4ff',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable' as any
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable' as any
            },
        ],
        categories: ['finance', 'productivity']
    }
}
