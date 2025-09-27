/**
 * 🚀 Modern Category Filter - Industry Standard Solution 
 * Professional "跟手" scrolling experience optimized for Mac CMS v10
 * Based on Netflix, YouTube, Amazon Prime implementations
 */

document.addEventListener('DOMContentLoaded', function() {
    new ModernCategoryFilter();
});

class ModernCategoryFilter {
    constructor() {
        this.initToggle();
        this.initActiveItemScroll();
        this.initDragScroll();
        this.preventDragAndContext();
        this.initResponsiveEffects();
    }

    initToggle() {
        const toggle = document.querySelector('.filter-toggle-modern');
        const collapsible = document.querySelector('.collapsible-filters, .collapsible-filters-modern');
        
        if (!toggle || !collapsible) return;

        // Get saved state or default to collapsed (closed)
        const isCollapsed = localStorage.getItem('filterCollapsed') !== 'false';
        this.updateToggleState(toggle, collapsible, isCollapsed);

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !collapsible.classList.contains('collapsed');
            this.updateToggleState(toggle, collapsible, newState);
            localStorage.setItem('filterCollapsed', newState);
        });
    }

    updateToggleState(toggle, collapsible, collapsed) {
        toggle.classList.toggle('collapsed', collapsed);
        collapsible.classList.toggle('collapsed', collapsed);
        
        if (collapsed) {
            // Closing: Set explicit height first, then animate to 0
            const height = collapsible.scrollHeight;
            collapsible.style.maxHeight = height + 'px';
            
            // Force reflow to ensure height is applied
            collapsible.offsetHeight;
            
            // Then animate to closed
            requestAnimationFrame(() => {
                collapsible.style.maxHeight = '0px';
            });
        } else {
            // Opening: Remove any explicit height and let CSS handle it
            collapsible.style.maxHeight = '';
            
            // Calculate the natural height for smooth animation
            const height = collapsible.scrollHeight;
            collapsible.style.maxHeight = '0px';
            
            // Force reflow
            collapsible.offsetHeight;
            
            // Animate to full height
            requestAnimationFrame(() => {
                collapsible.style.maxHeight = height + 'px';
            });
            
            // Clean up after animation completes
            setTimeout(() => {
                if (!collapsible.classList.contains('collapsed')) {
                    collapsible.style.maxHeight = '';
                }
            }, 320); // Slightly longer than CSS transition for safety
        }
    }

    initActiveItemScroll() {
        // Scroll selected items into view on load with delay for better UX
        setTimeout(() => {
            document.querySelectorAll('.filter-options-modern').forEach(container => {
                const selected = container.querySelector('.selected');
                if (selected) {
                    // Use native scrollIntoView for better performance
                    selected.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'center' 
                    });
                }
            });
        }, 200);
    }

    initDragScroll() {
        const containers = document.querySelectorAll('.filter-options-modern');
        
        containers.forEach(container => {
            let isDragging = false;
            let startX = 0;
            let scrollLeft = 0;
            let velocity = 0;
            let lastMoveTime = 0;
            let lastMoveX = 0;
            let clickStarted = false;
            let hasScrolled = false;

            // Desktop mouse events - Professional 跟手 implementation
            container.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                clickStarted = true;
                hasScrolled = false;
                startX = e.clientX;
                scrollLeft = container.scrollLeft;
                lastMoveTime = Date.now();
                lastMoveX = e.clientX;
                velocity = 0;
                
                container.style.cursor = 'grabbing';
                container.style.scrollBehavior = 'unset';
                
                // Prevent text selection during drag
                document.body.style.userSelect = 'none';
            });

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                const currentTime = Date.now();
                const deltaTime = currentTime - lastMoveTime;
                const deltaX = e.clientX - startX;
                const moveDelta = e.clientX - lastMoveX;
                
                // Calculate velocity for momentum
                if (deltaTime > 0) {
                    velocity = moveDelta / deltaTime;
                }
                
                // Direct 1:1 mapping for true "跟手" feel
                container.scrollLeft = scrollLeft - deltaX;
                
                // Track significant movement
                if (Math.abs(deltaX) > 5) {
                    clickStarted = false;
                    hasScrolled = true;
                }
                
                lastMoveTime = currentTime;
                lastMoveX = e.clientX;
            };

            const handleMouseUp = (e) => {
                if (!isDragging) return;
                
                isDragging = false;
                container.style.cursor = '';
                container.style.scrollBehavior = 'smooth';
                document.body.style.userSelect = '';
                
                // Handle click vs drag
                if (clickStarted && !hasScrolled) {
                    const target = e.target.closest('.filter-pill-modern');
                    if (target && target.href) {
                        setTimeout(() => {
                            window.location.href = target.href;
                        }, 50);
                    }
                }
                
                // Reset flags
                clickStarted = false;
                hasScrolled = false;
            };

            // Add event listeners
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            container.addEventListener('mouseleave', () => {
                if (isDragging) {
                    handleMouseUp({});
                }
            });

            // Touch events for mobile - Smart directional scrolling
            let touchStartX = 0;
            let touchStartY = 0;
            let touchScrollLeft = 0;
            let isTouchDragging = false;
            let touchStartTime = 0;
            let scrollDirection = null; // 'horizontal', 'vertical', or null
            let touchMoved = false;

            container.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                touchScrollLeft = container.scrollLeft;
                touchStartTime = Date.now();
                isTouchDragging = false;
                touchMoved = false;
                scrollDirection = null;
                container.style.scrollBehavior = 'unset';
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                const deltaX = touchStartX - touch.clientX;
                const deltaY = touchStartY - touch.clientY;
                
                // Determine scroll direction on first significant movement
                if (!touchMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                    touchMoved = true;
                    
                    // Determine primary scroll direction
                    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
                        // Horizontal scroll intended
                        scrollDirection = 'horizontal';
                    } else if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
                        // Vertical scroll intended - let browser handle it
                        scrollDirection = 'vertical';
                    }
                }
                
                // Only handle horizontal scrolling if user intended horizontal movement
                if (scrollDirection === 'horizontal') {
                    // Professional touch scrolling - direct mapping
                    container.scrollLeft = touchScrollLeft + deltaX;
                    
                    if (Math.abs(deltaX) > 10) {
                        isTouchDragging = true;
                    }
                }
                // For vertical or ambiguous movements, let the browser handle page scrolling
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                container.style.scrollBehavior = 'smooth';
                
                // Handle tap vs drag (only if not vertical scrolling)
                if (!isTouchDragging && scrollDirection !== 'vertical' && e.changedTouches && Date.now() - touchStartTime < 300) {
                    const touch = e.changedTouches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    const pill = target.closest('.filter-pill-modern');
                    
                    if (pill && pill.href) {
                        setTimeout(() => {
                            window.location.href = pill.href;
                        }, 50);
                    }
                }
                
                // Reset state
                isTouchDragging = false;
                touchMoved = false;
                scrollDirection = null;
            }, { passive: true });

            // Prevent context menu during scroll
            container.addEventListener('contextmenu', (e) => {
                if (hasScrolled) {
                    e.preventDefault();
                }
            });
        });
    }

    initResponsiveEffects() {
        // Add enhanced responsive visual feedback for all filter pills
        document.querySelectorAll('.filter-pill-modern').forEach(pill => {
            let isPressed = false;
            
            // Enhanced touch feedback
            pill.addEventListener('touchstart', (e) => {
                if (!isPressed) {
                    isPressed = true;
                    pill.style.transform = 'scale(0.95)';
                    pill.style.transition = 'transform 0.1s ease';
                    pill.style.background = 'rgba(255, 128, 50, 0.2)';
                    pill.style.borderColor = '#ff8032';
                    pill.style.boxShadow = '0 0 0 2px rgba(255, 128, 50, 0.3)';
                }
            }, { passive: true });

            pill.addEventListener('touchend', (e) => {
                if (isPressed) {
                    isPressed = false;
                    this.resetPillStyle(pill);
                }
            }, { passive: true });

            pill.addEventListener('touchcancel', (e) => {
                if (isPressed) {
                    isPressed = false;
                    this.resetPillStyle(pill);
                }
            }, { passive: true });

            // Mouse effects for desktop
            pill.addEventListener('mousedown', (e) => {
                if (!isPressed) {
                    isPressed = true;
                    pill.style.transform = 'scale(0.95)';
                    pill.style.transition = 'transform 0.1s ease';
                    pill.style.background = 'rgba(255, 128, 50, 0.2)';
                    pill.style.borderColor = '#ff8032';
                    pill.style.boxShadow = '0 0 0 2px rgba(255, 128, 50, 0.3)';
                }
            });

            pill.addEventListener('mouseup', (e) => {
                if (isPressed) {
                    isPressed = false;
                    this.resetPillStyle(pill);
                }
            });

            pill.addEventListener('mouseleave', (e) => {
                if (isPressed) {
                    isPressed = false;
                    this.resetPillStyle(pill);
                }
            });
        });
    }

    resetPillStyle(pill) {
        // Reset to default styles
        pill.style.transform = '';
        pill.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Check if it's selected to maintain selected styles
        if (pill.classList.contains('selected')) {
            pill.style.background = '#ff8032';
            pill.style.borderColor = '#ff8032';
            pill.style.boxShadow = '';
        } else {
            // Reset to theme-appropriate defaults
            pill.style.background = '';
            pill.style.borderColor = '';
            pill.style.boxShadow = '';
        }
    }

    preventDragAndContext() {
        // Prevent dragging of all filter pills and images
        document.querySelectorAll('.filter-pill-modern').forEach(pill => {
            pill.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
            
            pill.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Set drag properties
            pill.draggable = false;
            pill.style.webkitUserDrag = 'none';
            pill.style.userDrag = 'none';
        });
    }
}