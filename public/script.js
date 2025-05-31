const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

const mainHeader = document.getElementById('main-header');
const heroSection = document.getElementById('home');

if (mainHeader && heroSection) {
    const heroSectionHeight = heroSection.offsetHeight;

    function toggleHeaderVisibility() {
        if (window.scrollY > heroSectionHeight - mainHeader.offsetHeight) {
            mainHeader.classList.remove('header-hidden');
            mainHeader.classList.add('header-visible');
        } else {
            mainHeader.classList.remove('header-visible');
            mainHeader.classList.add('header-hidden');
        }
    }

    toggleHeaderVisibility();

    window.addEventListener('scroll', toggleHeaderVisibility);
}
