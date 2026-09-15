(function () {
    let lastScroll = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const nav = document.querySelector('.navbar');
        if (!nav) { ticking = false; return; }

        const current = window.scrollY;
        const delta = current - lastScroll;

        if (current <= 60) {
            nav.classList.remove('nav-hidden');
        } else if (delta > 4) {
            nav.classList.add('nav-hidden');
        } else if (delta < -4) {
            nav.classList.remove('nav-hidden');
        }

        lastScroll = current;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once in case the page loads already scrolled
    updateNavbar();

    // Re-apply anchor scroll after NiceGUI finishes rendering
    // (fixes #journey/#about/etc. not working on direct page load/refresh,
    // since NiceGUI renders content async after the initial HTML arrives)
    function scrollToHashWhenReady(attemptsLeft) {
        if (!window.location.hash) return;
        const el = document.querySelector(window.location.hash);
        if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else if (attemptsLeft > 0) {
            setTimeout(() => scrollToHashWhenReady(attemptsLeft - 1), 300);
        }
    }

    // Dynamically match hero's top padding to the navbar's real rendered height
    // (fixes overlap when the navbar wraps to multiple lines on narrower viewports,
    // or is simply taller/shorter than the fixed CSS estimate)
    function syncHeroPadding() {
        const nav = document.querySelector('.navbar');
        const hero = document.querySelector('.hero-wrap');
        if (!nav || !hero) return;
        const navHeight = nav.getBoundingClientRect().height;
        hero.style.paddingTop = (navHeight + 40) + 'px';
    }

    window.addEventListener('load', () => {
        scrollToHashWhenReady(6); // retries for ~1.8s total in case render is slow

        syncHeroPadding();
        setTimeout(syncHeroPadding, 300);
        setTimeout(syncHeroPadding, 1000);
    });

    window.addEventListener('resize', syncHeroPadding);
})();