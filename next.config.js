/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'tlcn-upload.s3.ap-southeast-1.amazonaws.com',
            'ute.tlcn-server.store'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.tlcn-server.store',
            },
            {
                protocol: 'https',
                hostname: 's3.amazonaws.com',
                port: '',
                pathname: '/tlcn-upload/**',
            },
        ],
    }
};

module.exports = nextConfig;
