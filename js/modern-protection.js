/**
 * Professional Silent Protection System
 * Protects template logic without intrusive alerts or keyboard blocking.
 */
(function () {
    'use strict';

    // Anti-debugging trap using a self-invoking function and debugger
    const trap = function () {
        try {
            (function () {
                (function a() {
                    try {
                        (function b(i) {
                            // Subtle logic to trigger debugger without being obvious in search
                            if (('' + (i / i)).length !== 1 || i % 20 === 0) {
                                (function () { }).constructor('debugger')();
                            } else {
                                debugger;
                            }
                            b(++i);
                        }(0));
                    } catch (e) {
                        // Re-trigger after a delay if user tries to stop it
                        setTimeout(a, 5000);
                    }
                }());
            }());
        } catch (e) { }
    };

    // Performance-based detection
    // Measures if execution is paused or slowed by DevTools
    const checkDevTools = function () {
        const start = Date.now();
        debugger;
        const end = Date.now();

        if (end - start > 100) {
            // DevTools is likely open or browser is being inspected/debugged
            // Silent actions can be taken here if needed
            return true;
        }
        return false;
    };

    // Initialize silent protection
    const init = function () {
        // Run initial trap
        trap();

        // Low-frequency check to ensure protection remains active
        // Only run when browser is idle to minimize performance impact
        if (window.requestIdleCallback) {
            setInterval(() => {
                window.requestIdleCallback(() => {
                    checkDevTools();
                });
            }, 4000);
        } else {
            setInterval(checkDevTools, 4000);
        }
    };

    // Auto-execute
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
