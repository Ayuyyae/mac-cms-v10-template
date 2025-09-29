/**
 * Centralized URL Obfuscation System
 * Protects episode and play links from browser hijacking detection
 */

const URLObfuscator = {
    // Enhanced encoding with multiple layers
    encode: function(url) {
        try {
            // Layer 1: URL encode
            const encoded = encodeURIComponent(url);
            // Layer 2: Base64
            const b64 = btoa(encoded);
            // Layer 3: Character shifting with salt
            const shifted = b64.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) + ((i % 5) + 2))
            ).join('');
            // Layer 4: Add random prefix/suffix to confuse pattern detection
            const salt = Math.random().toString(36).substring(2, 8);
            return salt + shifted + salt.split('').reverse().join('');
        } catch (e) {
            console.error('URL encode error:', e);
            return btoa(url); // Fallback to simple base64
        }
    },
    
    decode: function(encoded) {
        try {
            // Remove salt (first 6 chars and last 6 chars)
            const saltLength = 6;
            const withoutSalt = encoded.substring(saltLength, encoded.length - saltLength);
            
            // Reverse character shifting
            const shifted = withoutSalt.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) - ((i % 5) + 2))
            ).join('');
            
            // Decode base64
            const b64Decoded = atob(shifted);
            // URL decode
            return decodeURIComponent(b64Decoded);
        } catch (e) {
            console.error('URL decode error:', e);
            // Try fallback decoding
            try {
                return atob(encoded);
            } catch (e2) {
                return '#error';
            }
        }
    }
};

const LinkObfuscator = {
    // Selectors for different types of links to obfuscate
    selectors: [
        '.episode a',                    // Episode links
        '.detail-play-button',           // Main play button on detail page
        '.homeslider-play-button',       // Hero slider play button on index
        'a[href*="/vod/play/"]',         // Any vod play links
        'a[href*="mac_url_vod_play"]',   // Template function play links
        '.back-link',                    // Navigation links
        '.more-link[href]',              // More links with href
        '.detail-content-item > a',      // Video image play link on detail page
        '.content-item > a[href*="play"]' // Any content item play links
    ],
    
    // Initialize obfuscation
    init: function() {
        this.obfuscateLinks();
        this.observeNewLinks();
        
        // Re-obfuscate periodically to catch dynamic content
        setInterval(() => {
            this.obfuscateLinks();
        }, 3000);
    },
    
    // Obfuscate all matching links
    obfuscateLinks: function() {
        this.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                this.obfuscateLink(link);
            });
        });
    },
    
    // Obfuscate a single link
    obfuscateLink: function(link) {
        if (!link || link.hasAttribute('data-obfuscated')) {
            return; // Already processed
        }
        
        const originalHref = link.href || link.getAttribute('href');
        if (!originalHref || originalHref.startsWith('#') || originalHref.startsWith('javascript:')) {
            return; // Skip non-URL links
        }
        
        try {
            // Encode the URL
            const obfuscatedHref = URLObfuscator.encode(originalHref);
            
            // Replace href with obfuscated data
            link.removeAttribute('href');
            link.setAttribute('data-url', obfuscatedHref);
            link.setAttribute('data-obfuscated', 'true');
            link.style.cursor = 'pointer';
            
            // Add click handler
            link.addEventListener('click', this.handleObfuscatedClick, { once: false });
            
            // Prevent default link behavior
            link.addEventListener('contextmenu', this.preventContextMenu);
            
        } catch (e) {
            console.error('Failed to obfuscate link:', link, e);
        }
    },
    
    // Handle click on obfuscated link
    handleObfuscatedClick: function(e) {
        e.preventDefault();
        e.stopPropagation();

        const link = this;
        link.classList.add('clicked');

        const encodedUrl = link.getAttribute('data-url');
        if (!encodedUrl) {
            console.error('No encoded URL found');
            link.classList.remove('clicked');
            return;
        }

        try {
            const decodedUrl = URLObfuscator.decode(encodedUrl);
            if (decodedUrl && decodedUrl !== '#error') {
                // Add small delay to avoid detection
                setTimeout(() => {
                    window.location.href = decodedUrl;
                }, 50);
            } else {
                console.error('Failed to decode URL');
            }
        } catch (e) {
            console.error('Error handling obfuscated click:', e);
        }

        setTimeout(() => {
            link.classList.remove('clicked');
        }, 300);
    },
    
    // Prevent right-click context menu on obfuscated links
    preventContextMenu: function(e) {
        e.preventDefault();
        return false;
    },
    
    // Observe for new links added dynamically
    observeNewLinks: function() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the node itself matches our selectors
                        this.selectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.obfuscateLink(node);
                            }
                            // Check for child elements that match
                            node.querySelectorAll && node.querySelectorAll(selector).forEach(link => {
                                this.obfuscateLink(link);
                            });
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// Anti-hijacking protection integration
const AntiHijacking = {
    init: function() {
        // User agent detection
        const ua = navigator.userAgent.toLowerCase();
        const isQuark = ua.includes('quark') || ua.includes('夸克') || ua.includes('quarkmobile');
        
        if (isQuark) {
            console.warn('Detected potential hijacking browser');
            // Uncomment to redirect: window.location.href = '/html/public/browser-notice.html';
        }
        
        this.protectDOM();
        this.obfuscateVideoElements();
        this.disableDevTools();
    },
    
    protectDOM: function() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Remove suspicious browser-injected elements
                        const suspiciousClasses = ['browser-bar', 'browser-ui', 'video-overlay', 'player-overlay', 'quark-'];
                        if (node.className && typeof node.className === 'string') {
                            if (suspiciousClasses.some(cls => node.className.includes(cls))) {
                                console.warn('Removing suspicious element:', node);
                                node.remove();
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    obfuscateVideoElements: function() {
        // Disguise video-related elements
        document.querySelectorAll('iframe, embed, object, video').forEach(el => {
            if (el.src && (el.src.includes('player') || el.src.includes('video'))) {
                el.setAttribute('data-content', 'document');
                el.setAttribute('role', 'document');
                el.removeAttribute('allowfullscreen');
                
                // Wrap in non-video container
                if (!el.parentNode.classList.contains('document-viewer')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'document-viewer';
                    wrapper.setAttribute('data-type', 'document');
                    el.parentNode.insertBefore(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        });
    },
    
    disableDevTools: function() {
        // Only disable dev tools shortcuts, keep user interaction
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LinkObfuscator.init();
    AntiHijacking.init();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    LinkObfuscator.init();
    AntiHijacking.init();
}

// Export for manual usage if needed
window.URLObfuscator = URLObfuscator;
window.LinkObfuscator = LinkObfuscator;