const setHTML = (el, html) => el.innerHTML = html;

class SiteHeader extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <header id="main-header" class="fixed top-0 left-0 w-full text-gray-100 py-6 px-4 md:px-8 z-50 transition-all duration-500 bg-transparent">
            <nav class="container mx-auto flex justify-between items-center relative">
                <a href="#" class="text-2xl md:text-3xl font-bold text-darkAccent hover:text-blue-400 transition">Steve.is-a.dev</a>
                <div id="construction-banner" class="hidden flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full animate-pulse mx-2 cursor-help">
                    <span class="material-icons text-sm">warning</span>
                    <span class="hidden md:block text-xs font-bold uppercase tracking-widest">Under Construction</span>
                </div>
                <ul class="hidden md:flex space-x-6 font-medium">
                    <li><a href="#about" class="hover:text-darkAccent transition">About</a></li>
                    <li><a href="#skills" class="hover:text-darkAccent transition">Skills</a></li>
                    <li><a href="#projects" class="hover:text-darkAccent transition">Projects</a></li>
                </ul>
                <button id="mobile-menu-button" class="md:hidden p-2"><span class="material-icons">menu</span></button>
            </nav>
            <div id="mobile-menu" class="hidden bg-gray-800 p-4 mt-4 rounded-xl shadow-2xl border border-gray-700 mx-4">
                <a href="#about" class="block py-2">About</a>
                <a href="#skills" class="block py-2">Skills</a>
                <a href="#projects" class="block py-2">Projects</a>
            </div>
        </header>`);
    }
}

class LandingSection extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <section id="home" class="min-h-screen flex items-center justify-center text-center py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-900 to-darkPrimary">
            <div class="max-w-4xl mx-auto">
                <img src="./assets/profile.webp" class="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-darkAccent shadow-2xl" onerror="this.src='https://ui-avatars.com/api/?name=Steve&background=63b3ed&color=fff&size=200'">
                <h1 class="text-6xl md:text-7xl font-black mb-4 text-white">Hi, I'm <span class="text-darkAccent">Steve</span></h1>
                <p class="text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">A web developer building modern, interactive experiences with a focus on clean code and performance.</p>
                <div class="flex justify-center gap-4">
                    <a href="#about" class="bg-darkAccent hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition transform hover:scale-105">About Me</a>
                </div>
            </div>
        </section>`);
    }
}

class SteamNow extends HTMLElement {
    async connectedCallback() {
        try {
            const res = await fetch('/api/now/steam');
            const data = await res.json();
            if (data.hidden || !data.player?.gameextrainfo) {
                this.style.display = 'none';
                return;
            }
            const p = data.player;
            const hasAchievements = data.achievements;
            const percent = hasAchievements ? Math.round((data.achievements.unlocked / data.achievements.total) * 100) : 0;
            setHTML(this, `
            <div class="py-12 px-4 bg-gray-900/50 border-y border-gray-800">
                <div class="container mx-auto max-w-3xl">
                    <div class="flex flex-col md:flex-row items-center gap-8 bg-darkPrimary/20 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <img src="https://cdn.akamai.steamstatic.com/steam/apps/${p.gameid}/header.jpg" class="w-full md:w-48 rounded-xl shadow-lg">
                        <div class="flex-1 text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-blue-500/10 text-darkAccent text-xs font-bold uppercase rounded-full mb-2">Live on Steam</span>
                            <h3 class="text-2xl font-bold text-white mb-2">${p.gameextrainfo}</h3>
                            ${hasAchievements ? `
                                <div class="w-full bg-gray-800 rounded-full h-2 mb-2">
                                    <div class="bg-darkAccent h-full rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                                </div>
                                <p class="text-sm text-gray-500 font-medium">${data.achievements.unlocked} of ${data.achievements.total} achievements unlocked (${percent}%)</p>
                            ` : `<p class="text-gray-500 italic">No achievement data available for this session.</p>`}
                        </div>
                    </div>
                </div>
            </div>`);
        } catch (e) {
            this.style.display = 'none';
        }
    }
}

class SpotifyNow extends HTMLElement {
    constructor() {
        super();
        this.raf = null;
    }
    async connectedCallback() {
        await this.update();
        this.timer = setInterval(() => this.update(), 30000);
    }
    disconnectedCallback() {
        clearInterval(this.timer);
        cancelAnimationFrame(this.raf);
    }
    async update() {
        try {
            const res = await fetch('/api/now/spotify');
            const data = await res.json();
            this.render(data);
        } catch (e) {
            this.style.display = 'none';
        }
    }
    render(data) {
        if (!data.isPlaying) {
            setHTML(this, `<div class="py-10 text-center text-gray-600 italic">Spotify is currently resting...</div>`);
            return;
        }
        setHTML(this, `
        <section class="py-20 px-4 bg-gray-800">
            <div class="container mx-auto max-w-4xl text-center">
                <h2 class="text-4xl font-black mb-10 text-white tracking-tight">Vibing To</h2>
                <div class="bg-gray-900 p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col md:flex-row items-center gap-10">
                    <img src="${data.cover}" class="w-40 h-40 md:w-56 md:h-56 rounded-2xl shadow-2xl object-cover animate-pulse-slow">
                    <div class="flex-1 w-full text-center md:text-left">
                        <a href="${data.url}" target="_blank" class="text-3xl md:text-4xl font-black text-white hover:text-spotifyGreen transition-colors line-clamp-1">${data.title}</a>
                        <p class="text-darkAccent font-bold text-xl mb-8">${data.artist}</p>
                        <div class="space-y-3">
                            <div class="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                <div id="spotify-bar" class="bg-spotifyGreen h-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(29,185,84,0.5)]"></div>
                            </div>
                            <div class="flex justify-between text-xs font-mono text-gray-500 font-bold">
                                <span id="spotify-current">0:00</span>
                                <span>${this.format(data.durationMs)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`);
        this.animateProgress(data);
    }
    animateProgress(data) {
        cancelAnimationFrame(this.raf);
        const bar = this.querySelector('#spotify-bar');
        const text = this.querySelector('#spotify-current');
        const tick = () => {
            const current = Math.min(data.progressMs + (Date.now() - data.timestamp), data.durationMs);
            if (bar) bar.style.width = (current / data.durationMs) * 100 + '%';
            if (text) text.textContent = this.format(current);
            if (data.isPlaying && current < data.durationMs) this.raf = requestAnimationFrame(tick);
        };
        tick();
    }
    format(ms) {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
}

class ProjectsList extends HTMLElement {
    async connectedCallback() {
        setHTML(this, `
        <section id="projects" class="py-24 px-4 bg-gray-900">
            <div class="container mx-auto max-w-6xl">
                <h2 class="text-5xl font-black text-center mb-16 text-white tracking-tighter uppercase">My Work</h2>
                <div id="project-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"></div>
            </div>
        </section>`);
        try {
            const { default: projects } = await import('./projects.js');
            const grid = this.querySelector('#project-grid');
            projects.forEach(p => {
                grid.innerHTML += `
                <div class="group bg-darkPrimary/40 p-1 rounded-[2rem] border border-white/5 hover:border-darkAccent/50 transition-all duration-500 shadow-xl">
                    <div class="bg-gray-900 p-6 rounded-[1.8rem] h-full flex flex-col">
                        ${p.image ? `<img src="${p.image}" class="w-full h-48 object-cover rounded-2xl mb-6 grayscale group-hover:grayscale-0 transition duration-500">` : ''}
                        <h3 class="text-2xl font-bold text-white mb-3">${p.title}</h3>
                        <p class="text-gray-400 leading-relaxed mb-8 flex-1">${p.description}</p>
                        ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="w-full text-center bg-darkPrimary hover:bg-darkAccent text-white font-bold py-3 rounded-xl transition">View Live</a>` : ''}
                    </div>
                </div>`;
            });
        } catch (e) {}
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <footer class="py-16 bg-gray-900 border-t border-white/5 text-center">
            <div class="container mx-auto px-4">
                <p class="text-gray-400 font-medium">&copy; ${new Date().getFullYear()} Steve. Built with 💓 and a lot of caffeine.</p>
                <p class="mt-4 text-xs text-gray-600 uppercase tracking-widest">Powered by Vercel & is-a.dev</p>
            </div>
        </footer>`);
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('landing-section', LandingSection);
customElements.define('steam-now', SteamNow);
customElements.define('spotify-now', SpotifyNow);
customElements.define('projects-list', ProjectsList);
customElements.define('site-footer', SiteFooter);
