document.addEventListener('DOMContentLoaded', () => {
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

         // Enhanced smooth scrolling variables
         let isScrolling = false;
         const scrollDuration = 600; // milliseconds for faster scrolling

         // Enhanced smooth scroll function using requestAnimationFrame
         const smoothScrollTo = (target, duration = scrollDuration) => {
             if (isScrolling) return; // Prevent multiple simultaneous scrolls

             isScrolling = true;
             const start = window.pageYOffset;
             const distance = target - start;
             let startTime = null;

             const animateScroll = (currentTime) => {
                 if (startTime === null) startTime = currentTime;
                 const timeElapsed = currentTime - startTime;
                 const progress = Math.min(timeElapsed / duration, 1);

                 // Easing function for smoother animation
                 const ease = easeInOutCubic(progress);

                 window.scrollTo(0, start + (distance * ease));

                 if (timeElapsed < duration) {
                     requestAnimationFrame(animateScroll);
                 } else {
                     isScrolling = false;
                     // Ensure we reach exact position
                     window.scrollTo(0, target);
                 }
             };

             requestAnimationFrame(animateScroll);
         };

         // Easing function for smooth animation
         const easeInOutCubic = (t) => {
             return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
         };

         // Function to scroll to top with enhanced smooth scrolling
         const scrollToTop = () => {
             smoothScrollTo(0);
         };

         // Function to scroll to bottom with enhanced smooth scrolling
         const scrollToBottom = () => {
             smoothScrollTo(document.documentElement.scrollHeight);
         };
    
        // Event listeners for click and keyboard with prevention
        scrollTopButton.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToTop();
        });

        scrollBottomButton.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToBottom();
        });

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "Home") {
                e.preventDefault();
                scrollToTop();
            } else if (e.ctrlKey && e.key === "End") {
                e.preventDefault();
                scrollToBottom();
            }
        });

        // Fallback for browsers that don't support smooth scrolling
        if (!CSS.supports('scroll-behavior', 'smooth')) {
            // Polyfill for older browsers
            const originalScrollTo = window.scrollTo;
            window.scrollTo = function(left, top) {
                if (typeof top === 'object' && top.behavior === 'smooth') {
                    smoothScrollTo(top.top || 0);
                } else {
                    originalScrollTo.call(this, left, top);
                }
            };
        }
    
        // Update button styles based on scroll position
        const updateButtons = () => {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollThreshold = 100;
            const bottomThreshold = 100;

            const isScrollable = documentHeight > windowHeight;

            if (isScrollable) {
                // Show bottom button if not near bottom
                if (scrollPosition + windowHeight >= documentHeight - bottomThreshold) {
                    scrollBottomButton.classList.remove('active');
                } else {
                    scrollBottomButton.classList.add('active');
                }

                // Show top button if scrolled down
                if (scrollPosition > scrollThreshold) {
                    scrollTopButton.classList.add('active');
                } else {
                    scrollTopButton.classList.remove('active');
                }
            } else {
                scrollTopButton.classList.remove('active');
                scrollBottomButton.classList.remove('active');
            }
        };

        // Enhanced scroll event handling with throttling
        let scrollTimeout;
        const throttledUpdateButtons = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateButtons, 10);
        };
    
        // Initial update and event listeners
        updateButtons();
        window.addEventListener("scroll", throttledUpdateButtons, { passive: true });
        window.addEventListener("resize", updateButtons);

        // Add scroll completion detection for better UX
        let lastScrollTop = 0;
        window.addEventListener("scroll", () => {
            const currentScrollTop = window.pageYOffset;
            if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
                // Scroll has essentially stopped, ensure isScrolling is false
                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }
            lastScrollTop = currentScrollTop;
        }, { passive: true });
    });