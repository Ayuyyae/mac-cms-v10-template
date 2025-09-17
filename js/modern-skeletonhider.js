document.addEventListener('DOMContentLoaded', () => {
    // Function to handle successful lazy loading
    const handleLazyLoad = (img) => {
        const container = img.closest('.lazyload-image-container');
        if (container) {
            const skeleton = container.querySelector('.lazyload-image-skeleton');
            if (skeleton) {
                skeleton.style.opacity = '0';
                setTimeout(() => {
                    skeleton.style.display = 'none';
                }, 300); // Match this with your CSS transition time
            }
        }
    };

    // Function to handle lazy loading errors
    const handleLazyError = (img) => {
        const container = img.closest('.lazyload-image-container');
        if (container) {
            const skeleton = container.querySelector('.lazyload-image-skeleton');
            const errorMsg = container.querySelector('.lazyload-error');
            if (skeleton) {
                skeleton.style.display = 'none';
            }
            if (!errorMsg && img.style.display !== 'none') {
                img.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.className = 'lazyload-error';
                errorMsg.textContent = 'Image failed to load';
                container.appendChild(errorMsg);
            }
        }
    };

    // Listen for successful lazy loading
    document.addEventListener('lazyloaded', (e) => {
        if (e.target.classList.contains('lazyload')) {
            handleLazyLoad(e.target);
        }
    });

    // Listen for lazy loading errors
    document.addEventListener('lazyerror', (e) => {
        if (e.target.classList.contains('lazyload')) {
            handleLazyError(e.target);
        }
    });
});