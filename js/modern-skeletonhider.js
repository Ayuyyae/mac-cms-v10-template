document.addEventListener('DOMContentLoaded', function() {
    // Function to handle successful lazy loading
    function handleLazyLoad(img) {
        var container = img.closest('.lazyload-image-container');
        if (container) {
            var skeleton = container.querySelector('.lazyload-image-skeleton');
            if (skeleton) {
                skeleton.style.opacity = '0';
                setTimeout(function() {
                    skeleton.style.display = 'none';
                }, 300); // Match this with your CSS transition time
            }
        }
    }

    // Function to handle lazy loading errors
    function handleLazyError(img) {
        var container = img.closest('.lazyload-image-container');
        if (container) {
            var skeleton = container.querySelector('.lazyload-image-skeleton');
            var errorMsg = container.querySelector('.lazyload-error');
            if (skeleton) {
                skeleton.style.display = 'none';
            }
            if (!errorMsg && img.style.display !== 'none') {
                img.style.display = 'none';
                errorMsg = document.createElement('div');
                errorMsg.className = 'lazyload-error';
                errorMsg.textContent = 'Image failed to load';
                container.appendChild(errorMsg);
            }
        }
    }

    // Listen for successful lazy loading
    document.addEventListener('lazyloaded', function(e) {
        if (e.target.classList.contains('lazyload')) {
            handleLazyLoad(e.target);
        }
    });

    // Listen for lazy loading errors
    document.addEventListener('lazyerror', function(e) {
        if (e.target.classList.contains('lazyload')) {
            handleLazyError(e.target);
        }
    });
});