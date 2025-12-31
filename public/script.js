const underConstruction = false;

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const constructionBanner = document.getElementById('construction-banner');

    if (underConstruction && constructionBanner) {
        constructionBanner.classList.remove('hidden');
    }

    if (mainHeader) {
        const updateHeaderStyle = () => {
            const scrollThreshold = 100;
            if (window.scrollY > scrollThreshold) {
                mainHeader.classList.remove('bg-transparent', 'shadow-none', 'py-6');
                mainHeader.classList.add('bg-gray-800/90', 'backdrop-blur-md', 'shadow-lg', 'py-4');
            } else {
                mainHeader.classList.remove('bg-gray-800/90', 'backdrop-blur-md', 'shadow-lg', 'py-4');
                mainHeader.classList.add('bg-transparent', 'shadow-none', 'py-6');
            }
        };
        updateHeaderStyle();
        window.addEventListener('scroll', updateHeaderStyle);
    }

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    loadSpotify();
    setInterval(loadSpotify, 30000); 
    loadProjects();
});

function renderSpotifyCard(data) {
    const container = document.getElementById('spotify-container');
    if (!container) return;

    if (!data.isPlaying) {
        container.innerHTML = `<p class="text-xl font-semibold text-gray-400">Not playing anything right now</p>`;
        if (window.spotifyInterval) clearInterval(window.spotifyInterval);
        return;
    }

async function loadSpotify() {
    const container = document.getElementById('spotify-container');
    if (!container) return;

    try {
        const response = await fetch('/api/SpotifyMusic', { method: 'POST' });
        if (!response.ok) throw new Error('Offline');
        
        const data = await response.json();
        renderSpotifyCard(data); 
    } catch (error) {
        console.error("Spotify Load Error:", error);
        container.innerHTML = `<p class="text-gray-400">Not playing anything right now.</p>`;
    }
}

    const progressPercent = (data.progressMs / data.durationMs) * 100;

    container.innerHTML = `
        <div class="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-8 p-2 text-left">
            <div class="relative shrink-0">
                <img src="${data.cover}" alt="Album Art" class="w-32 h-32 md:w-40 md:h-40 rounded-lg shadow-2xl border border-gray-700 object-cover">
                <div class="absolute -top-2 -right-2 bg-[#1DB954] p-1.5 rounded-full shadow-lg border-2 border-gray-900 text-white">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                </div>
            </div>
            
            <div class="flex-1 w-full overflow-hidden text-center md:text-left">
                <div class="mb-4">
                    <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="text-2xl font-bold text-white hover:text-[#1DB954] transition-colors truncate block">
                        ${data.title}
                    </a>
                    <p class="text-darkAccent font-medium text-lg truncate">${data.artist}</p>
                </div>

                <div class="space-y-2">
                    <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div id="spotify-progress-bar" class="bg-[#1DB954] h-full transition-all duration-1000 ease-linear" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="flex justify-between text-xs font-mono text-gray-500">
                        <span id="spotify-current-time">${data.position}</span>
                        <span>${data.endPos}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.spotifyInterval) clearInterval(window.spotifyInterval);
    
    let currentMs = data.progressMs;
    window.spotifyInterval = setInterval(() => {
        if (currentMs >= data.durationMs) {
            clearInterval(window.spotifyInterval);
            return;
        }
        currentMs += 1000;
        const newPercent = Math.min((currentMs / data.durationMs) * 100, 100);
        const bar = document.getElementById('spotify-progress-bar');
        const timeLabel = document.getElementById('spotify-current-time');
        
        if (bar) bar.style.width = newPercent + '%';
        if (timeLabel) {
            const mins = Math.floor(currentMs / 60000);
            const secs = Math.floor((currentMs % 60000) / 1000);
            timeLabel.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    }, 1000);
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
                        </div>
                        <div class="flex flex-wrap gap-4 mt-6">
                            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="bg-darkAccent hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full shadow-md transition duration-300">Live Demo</a>` : ''}
                        </div>
                    </div>`;
                projectsContainer.insertAdjacentHTML('beforeend', projectCard);
            });
        }
    } catch (e) {
        projectsContainer.innerHTML = '<p class="text-center text-red-400">Failed to load projects.</p>';
    }
}
