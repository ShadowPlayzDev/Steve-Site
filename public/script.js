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

import testimonials from './testimonials.js';
const testimonialsContainer = document.getElementById('testimonials-container');
if (testimonialsContainer) {
    testimonialsContainer.innerHTML = '';
    if (Array.isArray(testimonials)) {
        testimonials.forEach(testimonial => {
            const testimonialCard = `
                <div class="bg-darkPrimary p-6 rounded-lg shadow-md relative">
                    <svg class="absolute top-4 left-4 w-10 h-10 text-darkAccent opacity-20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 11v2.5a3.5 3.5 0 01-3.5 3.5c-1.61 0-2.5-1.09-2.5-1.92V11c0-.55-.45-1-1-1s-1 .45-1 1v4c0 2.21 1.79 4 4 4s4-1.79 4-4V11c0-.55-.45-1-1-1s-1 .45-1 1zm12 0v2.5a3.5 3.5 0 01-3.5 3.5c-1.61 0-2.5-1.09-2.5-1.92V11c0-.55-.45-1-1-1s-1 .45-1 1v4c0 2.21 1.79 4 4 4s4-1.79 4-4V11c0-.55-.45-1-1-1s-1 .45-1 1z"/>
                    </svg>
                    <p class="text-xl italic mb-4 relative z-10 pl-6 pr-4">"${testimonial.quote}"</p>
                    <p class="text-lg font-semibold text-darkAccent">- ${testimonial.author}</p>
                    ${testimonial.company ? `<p class="text-md text-gray-400">${testimonial.company}</p>` : ''}
                </div>
            `;
            testimonialsContainer.insertAdjacentHTML('beforeend', testimonialCard);
        });
    } else {
        console.error('Error: testimonials data is not an array.', testimonials);
        testimonialsContainer.innerHTML = '<p class="text-center text-red-400">Failed to load testimonials: Data format error.</p>';
    }
}
