document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.stui-header__menu');
    const navbarOverlay = document.querySelector('.navbar-overlay');

    const closeMenu = () => {
        navbarToggle.setAttribute('aria-expanded', 'false');
        navbarMenu.classList.remove('active');
        navbarOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    const closeAllMenus = () => {
        document.querySelectorAll('.navbar-item').forEach(item => {
            const link = item.querySelector('.navbar-link');
            const dropdown = item.querySelector('.navbar-dropdown');
            if (link && dropdown) {
                item.classList.remove('active');
                link.classList.remove('active');
                dropdown.style.maxHeight = null;
            }
        });
    };

    const toggleMenu = () => {
        const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
        navbarToggle.setAttribute('aria-expanded', !isExpanded);
        navbarMenu.classList.toggle('active');
        navbarOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        if (navbarMenu.classList.contains('active')) {
            // Instead of closing all menus, we'll open the active one
            openActiveMenu();
        }
    };

    const openActiveMenu = () => {
        const activeItem = document.querySelector('.navbar-item.active');
        if (activeItem) {
            const dropdown = activeItem.querySelector('.navbar-dropdown');
            if (dropdown) {
                dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
            }
        }
    };

    navbarToggle.addEventListener('click', toggleMenu);
    navbarOverlay.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navbarMenu.contains(event.target);
        const isClickOnToggle = navbarToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && navbarMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    document.querySelectorAll('.navbar-item').forEach(item => {
        const link = item.querySelector('.navbar-link');
        const dropdown = item.querySelector('.navbar-dropdown');

        if (dropdown) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const wasActive = item.classList.contains('active');

                    // Close all menus first
                    closeAllMenus();

                    // If this item wasn't active before, open it
                    if (!wasActive) {
                        item.classList.add('active');
                        link.classList.add('active');
                        dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
                    }
                }
            });

            dropdown.querySelectorAll('a').forEach(secondaryLink => {
                secondaryLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        dropdown.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                        secondaryLink.classList.add('active');
                        setTimeout(closeMenu, 300);
                    }
                });
            });
        } else if (link) {
            // For top-level items without dropdowns
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    closeAllMenus(); // Close any open menus
                    setTimeout(closeMenu, 300);
                }
            });
        }

        // Desktop hover functionality
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', () => {
                if (dropdown) dropdown.style.display = 'block';
            });
            item.addEventListener('mouseleave', () => {
                if (dropdown) dropdown.style.display = 'none';
            });
        }
    });

    const highlightCurrentPage = () => {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.navbar-item a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                const parentItem = link.closest('.navbar-item');
                if (parentItem) {
                    parentItem.classList.add('active');
                }
            }
        });
        // After highlighting, open the active menu
        openActiveMenu();
    };

    highlightCurrentPage();

    // Ensure the highlighted menu stays open when toggling the menu
    navbarToggle.addEventListener('click', () => {
        if (navbarMenu.classList.contains('active')) {
            setTimeout(openActiveMenu, 0);
        }
    });
});