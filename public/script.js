document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const homeSection = document.getElementById('home');

    if (mainHeader && homeSection) {
        function updateHeaderStyle() {
            const scrollThreshold = 100;

            if (window.scrollY > scrollThreshold) {
                mainHeader.classList.remove('bg-transparent', 'shadow-none');
                mainHeader.classList.add('bg-gray-800', 'shadow-lg');
            } else {
                mainHeader.classList.remove('bg-gray-800', 'shadow-lg');
                mainHeader.classList.add('bg-transparent', 'shadow-none');
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
});

import projects from './projects.js';
const projectsContainer = document.getElementById('projects-container');
if (projectsContainer) {
    projectsContainer.innerHTML = '';
    if (Array.isArray(projects)) {
        projects.forEach(project => {
            const projectCard = `
                <div class="bg-darkPrimary p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
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
    } else {
        console.error('Error: projects data is not an array.', projects);
        projectsContainer.innerHTML = '<p class="text-center text-red-400">Failed to load projects: Data format error.</p>';
    }
}
