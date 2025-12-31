const underConstruction = true;

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const homeSection = document.getElementById('home');
    const constructionBanner = document.getElementById('construction-banner');

    if (underConstruction && constructionBanner) {
        constructionBanner.classList.remove('hidden');
    }

    if (mainHeader && homeSection) {
        function updateHeaderStyle() {
            const scrollThreshold = 100;
            if (window.scrollY > scrollThreshold) {
                mainHeader.classList.remove('bg-transparent', 'shadow-none', 'py-6');
                mainHeader.classList.add('bg-gray-800/90', 'backdrop-blur-md', 'shadow-lg', 'py-4');
            } else {
                mainHeader.classList.remove('bg-gray-800/90', 'backdrop-blur-md', 'shadow-lg', 'py-4');
                mainHeader.classList.add('bg-transparent', 'shadow-none', 'py-6');
            }
        }
        updateHeaderStyle();
        window.addEventListener('scroll', updateHeaderStyle);
    }

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    setupLazyLoading();
});

function setupLazyLoading() {
    const options = {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'music') {
                    loadSpotify();
                } else if (entry.target.id === 'projects') {
                    loadProjects();
                }
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.section-fade-in').forEach(section => {
        observer.observe(section);
    });
}

async function loadSpotify() {
    const container = document.getElementById('spotify-container');
    const fallbackUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM3M?utm_source=generator&theme=0";
    
    try {
        const response = await fetch('/api/SpotifyMusic');
        if (!response.ok) throw new Error('Network response error');
        
        const data = await response.json();
        const playlistUrl = data.url || fallbackUrl;
        
        container.innerHTML = `
            <iframe style="border-radius:12px" src="${playlistUrl}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
    } catch (error) {
        container.innerHTML = `
            <iframe style="border-radius:12px" src="${fallbackUrl}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
    }
}

async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        const { default: projects } = await import('./projects.js');
        projectsContainer.innerHTML = '';
        
        if (Array.isArray(projects)) {
            projects.forEach(project => {
                const projectCard = `
                    <div class="bg-darkPrimary p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between border border-gray-700">
                        <div>
                            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-md mb-6 border border-gray-700">` : ''}
                            <h3 class="text-3xl font-bold text-darkAccent mb-3">${project.title}</h3>
                            <p class="text-lg text-gray-300 mb-4">${project.description}</p>
                            ${project.technologies && project.technologies.length > 0 ? `
                                <div class="mb-4">
                                    <span class="font-semibold text-gray-400">Technologies:</span>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        ${project.technologies.map(tech => `<span class="bg-gray-700 text-gray-200 text-sm px-3 py-1 rounded-full">${tech}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex flex-wrap gap-4 mt-6">
                            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="inline-block bg-darkAccent hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full text-md shadow-md transition duration-300">Live Demo</a>` : ''}
                            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-full text-md shadow-md transition duration-300">GitHub</a>` : ''}
                        </div>
                    </div>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', projectCard);
            });
        }
    } catch (e) {
        projectsContainer.innerHTML = '<p class="text-center text-red-400">Failed to load projects.</p>';
    }
}
