/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'tlcn-uploads.s3.ap-southeast-1.amazonaws.com',
          //  'ute.tlcn-server.store',
            'ui-avatars.com'
        ],
        // remotePatterns: [
        //     {
        //         protocol: 'https',
        //         hostname: '**.tlcn-server.store',
        //     },
        //     {
        //         protocol: 'https',
        //         hostname: 's3.amazonaws.com',
        //         port: '',
        //         pathname: '/tlcn-upload/**',
        //     },
        // ],
    }
};

module.exports = nextConfig;
