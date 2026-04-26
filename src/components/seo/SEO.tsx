import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    googleVerification?: string;
}

const SEO = ({
    title,
    description = "Anberc - Segurança Eletrônica e Tecnologia. Alarmes, CFTV, Interfonia e mais.",
    keywords = "segurança eletrônica, monitoramento, alarmes, cftv, anberc, proteção residencial, proteção comercial",
    image = "/logo-anberc.png",
    url = "https://anberc.com.br",
    googleVerification
}: SEOProps) => {
    const baseTitle = "Anberc | Segurança Eletrônica";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Helper to update meta tags
        const updateMeta = (name: string, content: string, property: boolean = false) => {
            let element = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                if (property) {
                    element.setAttribute('property', name);
                } else {
                    element.setAttribute('name', name);
                }
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard Meta Tags
        updateMeta('description', description);
        updateMeta('keywords', keywords);

        // Open Graph / Facebook
        updateMeta('og:type', 'website', true);
        updateMeta('og:url', url, true);
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', description, true);
        updateMeta('og:image', image, true);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:url', url);
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', image);

        // Google Site Verification
        if (googleVerification && googleVerification.trim()) {
            const cleanCode = googleVerification.trim();
            updateMeta('google-site-verification', cleanCode);
        } else {
            // Remove the tag if it exists but the code is empty
            const existingTag = document.querySelector('meta[name="google-site-verification"]');
            if (existingTag) {
                existingTag.remove();
            }
        }

    }, [fullTitle, description, keywords, image, url, googleVerification]);

    return null;
};

export default SEO;
