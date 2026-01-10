let isReversed = false;

const toggleOrderAndFlip = () => {
    const episodeList = document.getElementById('episodeList');
    
    // Preserve scroll position before DOM manipulation (industry-standard pattern)
    const savedScrollTop = episodeList.scrollTop;
    
    const episodes = Array.from(episodeList.children);
    const icon = document.getElementById('orderIcon');

    // Toggle the order
    isReversed = !isReversed;

    // Flip the icon using class instead of inline style
    icon.classList.toggle('flipped');

    // Sort episodes using natural sort
    episodes.sort((a, b) => {
        const aEp = a.querySelector('a').textContent;
        const bEp = b.querySelector('a').textContent;
        return isReversed ? naturalCompare(bEp, aEp) : naturalCompare(aEp, bEp);
    });

    // Clear and refill the episode list
    episodeList.innerHTML = '';
    episodes.forEach(episode => episodeList.appendChild(episode));
    
    // Restore scroll position after DOM update using requestAnimationFrame
    // This ensures the browser has completed the DOM rendering
    requestAnimationFrame(() => {
        episodeList.scrollTop = savedScrollTop;
    });
};

// Natural sort comparison function
const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
};

// Initialize the order on page load
document.addEventListener('DOMContentLoaded', () => {
    const episodeList = document.getElementById('episodeList');
    if (!episodeList.getAttribute('data-order')) {
        episodeList.setAttribute('data-order', 'asc');
    }
});