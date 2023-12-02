/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'tlcn-upload.s3.ap-southeast-1.amazonaws.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    }
};

module.exports = nextConfig;
