// SEO Routes - Sitemap та Robots.txt
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Динамічний sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const posts = await BlogPost.find({ status: 'published' });

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:2804';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog.html</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/faq.html</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${baseUrl}/contact.html</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${baseUrl}/app</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;

        // Додати статті блогу
        posts.forEach(post => {
            const lastmod = post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString();
            xml += `
    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`;
        });

        xml += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:2804';

    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;
