document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-row dd').forEach((slider) => {
        let isDown = false;
        let startX, scrollLeft, moved = false, velocity = 0, lastX, lastTime, overscrollAmount = 0;
        let itemWidth = (slider.querySelector('.filter-item') ? slider.querySelector('.filter-item').offsetWidth : 0) + 15;
        let maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);

        const easeOutQuad = t => t * (2 - t);

        const applyOverscroll = amount => {
            if (slider.classList.contains('scrollable')) {
                const sliderContent = slider.querySelector('.slider-content');
                if (sliderContent) {
                    sliderContent.style.transform = `translateX(${amount}px)`;
                }
            }
        };

        const resetOverscroll = () => {
            if (slider.classList.contains('scrollable')) {
                const sliderContent = slider.querySelector('.slider-content');
                if (sliderContent) {
                    sliderContent.style.transform = '';
                }
            }
        };

        const snapToClosestItem = () => {
            const scrollLeft = slider.scrollLeft;
            const closestItem = Math.round(scrollLeft / itemWidth);
            const targetScrollLeft = Math.max(0, Math.min(closestItem * itemWidth, maxScroll));

            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const time = Math.min(1, progress / 300);
                const easing = easeOutQuad(time);
                slider.scrollLeft = scrollLeft + (targetScrollLeft - scrollLeft) * easing;

                if (overscrollAmount !== 0) {
                    applyOverscroll(overscrollAmount * (1 - easing));
                }

                if (time < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resetOverscroll();
                }
            };
            requestAnimationFrame(animate);
        };

        const momentum = (velocity, overscrollAmount) => {
            const animate = () => {
                if (Math.abs(velocity) > 0.1) {
                    let newScrollLeft = slider.scrollLeft + velocity;
                    if (newScrollLeft < 0) {
                        overscrollAmount = -newScrollLeft * 0.3;
                        newScrollLeft = 0;
                        velocity *= 0.8;
                    } else if (newScrollLeft > maxScroll) {
                        overscrollAmount = (newScrollLeft - maxScroll) * 0.3;
                        newScrollLeft = maxScroll;
                        velocity *= 0.8;
                    } else {
                        overscrollAmount = 0;
                    }

                    slider.scrollLeft = newScrollLeft;
                    applyOverscroll(velocity < 0 ? -overscrollAmount : overscrollAmount);
                    velocity *= 0.95;
                    requestAnimationFrame(animate);
                } else {
                    snapToClosestItem();
                }
            };
            animate();
        };

        const recalc = () => {
            const first = slider.querySelector('.filter-item');
            itemWidth = (first ? first.offsetWidth : 0) + 15;
            maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
        };
        const clampScroll = () => {
            // Force reflow to ensure dimensions are up-to-date before clamping
            // eslint-disable-next-line no-unused-expressions
            slider.offsetWidth;
            if (slider.scrollLeft > maxScroll) {
                slider.scrollLeft = maxScroll;
            } else if (slider.scrollLeft < 0) {
                slider.scrollLeft = 0;
            }
        };
        const updateScrollState = () => {
            recalc();
            clampScroll();
            const isOverflowing = slider.scrollWidth > slider.clientWidth;
            slider.classList.toggle('scrollable', isOverflowing);
        };

        const moveHandler = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            const x = clientX - slider.getBoundingClientRect().left;
            const walk = (x - startX) * 1.5;
            let newScrollLeft = scrollLeft - walk;

            if (newScrollLeft < 0) {
                overscrollAmount = -newScrollLeft * 0.3;
                newScrollLeft = 0;
            } else if (newScrollLeft > maxScroll) {
                overscrollAmount = (newScrollLeft - maxScroll) * 0.3;
                newScrollLeft = maxScroll;
            } else {
                overscrollAmount = 0;
            }

            slider.scrollLeft = newScrollLeft;
            applyOverscroll(walk < 0 ? -overscrollAmount : overscrollAmount);

            const now = Date.now();
            velocity = (lastX - x) / (now - lastTime);
            lastX = x;
            lastTime = now;
            moved = Math.abs(x - startX) > 5;
        };

        const endDragHandler = () => {
            isDown = false;
            slider.classList.remove('active');
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endDragHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endDragHandler);

            if (Math.abs(velocity) > 0.1 || overscrollAmount !== 0) {
                momentum(velocity, overscrollAmount);
            } else {
                snapToClosestItem();
            }
        };

        const startDragHandler = (e) => {
            if (!slider.classList.contains('scrollable')) return;
            isDown = true;
            slider.classList.add('active');
            startX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - slider.getBoundingClientRect().left;
            scrollLeft = slider.scrollLeft;
            lastX = startX;
            lastTime = Date.now();
            moved = false;
            velocity = 0;
            overscrollAmount = 0;
            resetOverscroll();

            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', moveHandler, { passive: false });
                document.addEventListener('touchend', endDragHandler);
            } else {
                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', endDragHandler);
            }
        };

        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        updateScrollState();
        // Recalculate on resize (window), font load, and DOM size changes
        window.addEventListener('resize', debounce(() => {
            const prevItemWidth = itemWidth;
            const prevMax = maxScroll;
            // Force reflow before recalculation
            // eslint-disable-next-line no-unused-expressions
            slider.offsetWidth;
            updateScrollState();
            if (Math.abs(itemWidth - prevItemWidth) > 1 || Math.abs(maxScroll - prevMax) > 1) {
                clampScroll();
                snapToClosestItem();
            } else {
                clampScroll();
            }
        }, 150));
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => updateScrollState());
        }
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(debounce(() => {
                const prev = maxScroll;
                // Force reflow before recalculation
                // eslint-disable-next-line no-unused-expressions
                slider.offsetWidth;
                updateScrollState();
                if (prev !== maxScroll) {
                    clampScroll();
                    snapToClosestItem();
                } else {
                    clampScroll();
                }
            }, 100));
            ro.observe(slider);
        }

        slider.addEventListener('mousedown', startDragHandler);
        slider.addEventListener('touchstart', startDragHandler, { passive: false });

        slider.querySelectorAll('.filter-item').forEach((item) => {
            // Prevent native drag of link/text/image
            item.addEventListener('dragstart', (e) => e.preventDefault());
            item.addEventListener('mousedown', (e) => {
                // Prevent text selection start on desktop when we intend to drag
                if (e.button === 0) {
                    e.preventDefault();
                }
            }, { passive: false });
            item.addEventListener('click', (e) => {
                // If a drag occurred, suppress the click navigation
                if (moved) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { capture: true });
        });
    });
});