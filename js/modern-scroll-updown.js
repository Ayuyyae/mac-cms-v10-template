document.addEventListener('DOMContentLoaded', function() {
        'use strict';
    
        // Create the buttons
        const scrollTopButton = document.createElement("button");
        scrollTopButton.id = "scrollTopButton";
        scrollTopButton.className = "scroll-updown-button";
        scrollTopButton.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m5 15 7-7 7 7"/>
    </svg>`;
        scrollTopButton.setAttribute("aria-label", "Scroll to top");
    
        const scrollBottomButton = document.createElement("button");
        scrollBottomButton.id = "scrollBottomButton";
        scrollBottomButton.className = "scroll-updown-button";
        scrollBottomButton.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19 9-7 7-7-7"/>
    </svg>`;
        scrollBottomButton.setAttribute("aria-label", "Scroll to bottom");
    
        document.body.appendChild(scrollTopButton);
        document.body.appendChild(scrollBottomButton);
    
        // Function to scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    
        // Function to scroll to bottom
        function scrollToBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    
        // Event listeners for click and keyboard
        scrollTopButton.addEventListener("click", scrollToTop);
        scrollBottomButton.addEventListener("click", scrollToBottom);
    
        document.addEventListener("keydown", function(e) {
            if (e.ctrlKey && e.key === "Home") {
                e.preventDefault();
                scrollToTop();
            } else if (e.ctrlKey && e.key === "End") {
                e.preventDefault();
                scrollToBottom();
            }
        });
    
        // Update button styles based on scroll position
        function updateButtons() {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollThreshold = 100;
            const bottomThreshold = 100;
    
            const isScrollable = documentHeight > windowHeight;
    
            if (isScrollable) {
                if (scrollPosition + windowHeight >= documentHeight - bottomThreshold) {
                    scrollBottomButton.classList.remove('active');
                } else {
                    scrollBottomButton.classList.add('active');
                }
    
                if (scrollPosition > scrollThreshold) {
                    scrollTopButton.classList.add('active');
                } else {
                    scrollTopButton.classList.remove('active');
                }
            } else {
                scrollTopButton.classList.remove('active');
                scrollBottomButton.classList.remove('active');
            }
        }
    
        // Initial update and event listeners
        updateButtons();
        window.addEventListener("scroll", updateButtons);
        window.addEventListener("resize", updateButtons);
    });