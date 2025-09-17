document.addEventListener('DOMContentLoaded', () => {
    // Function to show tooltip
    const showTooltip = (element, message) => {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '1000';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';

        document.body.appendChild(tooltip);

        // Position the tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

        // Show the tooltip
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        // Remove the tooltip after 1 second
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.addEventListener('transitionend', () => {
                document.body.removeChild(tooltip);
            });
        }, 1000);
    };

    // Add event listeners to disabled links
    const ewaveMsg = document.querySelectorAll('.no-page-msg');
    ewaveMsg.forEach(element => {
        element.addEventListener('click', (e) => {
            if (element.classList.contains('disabled')) {
                e.preventDefault();
                showTooltip(element, element.getAttribute('data-tip'));
            }
        });
    });
});