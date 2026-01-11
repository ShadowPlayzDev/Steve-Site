const setHTML = (el, html) => el.innerHTML = html;

class SiteHeader extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <header id="main-header" class="fixed top-0 left-0 w-full text-gray-100 py-6 px-4 md:px-8 z-50 transition-all duration-500 bg-transparent">
            <nav class="container mx-auto flex justify-between items-center relative">
                <a href="#" class="text-2xl md:text-3xl font-bold text-darkAccent hover:text-blue-400 transition">Steve.is-a.dev</a>
                <div id="construction-banner" class="hidden flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full animate-pulse mx-2 cursor-help">
                    <span class="material-icons text-sm">warning</span>
                    <span class="hidden md:block text-[10px] font-black uppercase tracking-widest">Under Construction</span>
                </div>
                <ul class="hidden md:flex space-x-8 font-medium">
                    <li><a href="#about" class="hover:text-darkAccent transition">About</a></li>
                    <li><a href="#projects" class="hover:text-darkAccent transition">Projects</a></li>
                </ul>
                <button id="mobile-menu-button" class="md:hidden p-2"><span class="material-icons">menu</span></button>
            </nav>
            <div id="mobile-menu" class="hidden bg-gray-900/95 backdrop-blur-xl p-4 mt-4 rounded-2xl border border-white/10 mx-4">
                <a href="#about" class="block py-3 px-4 hover:bg-white/5 rounded-lg transition">About</a>
                <a href="#projects" class="block py-3 px-4 hover:bg-white/5 rounded-lg transition">Projects</a>
            </div>
        </header>`);
    }
}

class LandingSection extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <section id="home" class="min-h-screen flex items-center justify-center text-center py-16 px-4 bg-[#0b0e14]">
            <div class="max-w-4xl mx-auto">
                <img src="./assets/profile.webp" class="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-darkAccent shadow-2xl" onerror="this.src='https://ui-avatars.com/api/?name=Steve&background=63b3ed&color=fff&size=200'">
                <h1 class="text-6xl md:text-7xl font-black mb-4 text-white tracking-tight">Hi, I'm <span class="text-darkAccent">Steve</span></h1>
                <p class="text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">A web developer building modern, interactive experiences.</p>
                <div class="flex justify-center gap-4">
                    <a href="#about" class="bg-darkAccent hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition transform hover:scale-105">About Me</a>
                </div>
            </div>
        </section>`);
    }
}

class AboutSection extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <section id="about" class="py-24 px-4 bg-[#0b0e14] border-t border-white/5">
            <div class="container mx-auto max-w-4xl text-center">
                <h2 class="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">About Me</h2>
                <div class="bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm text-lg text-gray-400 leading-relaxed shadow-xl">
                    <p class="mb-6">I'm a passionate developer focused on creating clean, efficient, and user-friendly web applications. I love diving into new technologies and constantly improving my craft.</p>
                    <p>Whether it's front-end design or back-end logic, I strive for excellence in every line of code I write.</p>
                </div>
            </div>
        </section>`);
    }
}

class SpotifyNow extends HTMLElement {
    constructor() { super(); this.raf = null; }
    async connectedCallback() { await this.update(); this.timer = setInterval(() => this.update(), 30000); }
    disconnectedCallback() { clearInterval(this.timer); cancelAnimationFrame(this.raf); }
    
    async update() {
        try {
            const res = await fetch('/api/SpotifyMusic', { method: 'POST' });
            const data = await res.json();
            this.render(data);
        } catch (e) { this.style.display = 'none'; }
    }

    render(data) {
        // Hides the element entirely if not playing or if the API returns a hidden state
        if (!data || !data.isPlaying || data.hidden) {
            this.innerHTML = ''; 
            this.style.display = 'none';
            return;
        }

        this.style.display = 'block';
        setHTML(this, `
        <section class="py-12 px-4 bg-[#0b0e14] border-t border-white/5">
            <div class="container mx-auto max-w-3xl">
                <div class="bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <img src="${data.cover}" class="w-32 h-32 md:w-44 md:h-44 rounded-2xl shadow-2xl object-cover">
                    <div class="flex-1 w-full text-center md:text-left">
                        <span class="inline-block px-3 py-1 bg-spotifyGreen/10 text-spotifyGreen text-[10px] font-black uppercase tracking-widest rounded-full mb-3">Vibing To</span>
                        <a href="${data.url}" target="_blank" class="text-2xl md:text-3xl font-black text-white hover:text-spotifyGreen transition-colors block truncate">${data.title}</a>
                        <p class="text-gray-400 font-bold text-lg mb-6">${data.artist}</p>
                        <div class="space-y-3">
                            <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                <div id="spotify-bar" class="bg-spotifyGreen h-full shadow-[0_0_10px_#1DB954]"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-mono text-gray-500 font-bold uppercase">
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
        <section id="projects" class="py-24 px-4 bg-[#0b0e14] border-t border-white/5">
            <div class="container mx-auto max-w-6xl">
                <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-white tracking-tighter uppercase">My Work</h2>
                <div id="project-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
            </div>
        </section>`);
        try {
            const { default: projects } = await import('./projects.js');
            const grid = this.querySelector('#project-grid');
            projects.forEach(p => {
                grid.innerHTML += `
                <div class="bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 hover:border-darkAccent/50 transition-all duration-500 shadow-xl flex flex-col group">
                    ${p.image ? `<img src="${p.image}" class="w-full h-48 object-cover rounded-2xl mb-6 grayscale group-hover:grayscale-0 transition duration-500">` : ''}
                    <h3 class="text-2xl font-bold text-white mb-2">${p.title}</h3>
                    <p class="text-gray-400 mb-8 flex-1 leading-relaxed text-sm">${p.description}</p>
                    ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="w-full text-center bg-white/5 hover:bg-darkAccent text-white font-bold py-3 rounded-xl transition">View Live</a>` : ''}
                </div>`;
            });
        } catch (e) {}
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        setHTML(this, `
        <footer class="py-16 bg-[#0b0e14] border-t border-white/5 text-center">
            <div class="container mx-auto px-4">
                <p class="text-gray-500 font-medium text-sm">&copy; ${new Date().getFullYear()} Steve.</p>
                <p class="mt-4 text-[10px] text-gray-700 uppercase tracking-widest font-black font-mono">STEVE.IS-A.DEV</p>
            </div>
        </footer>`);
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('landing-section', LandingSection);
customElements.define('about-section', AboutSection);
customElements.define('spotify-now', SpotifyNow);
customElements.define('projects-list', ProjectsList);
customElements.define('site-footer', SiteFooter);
