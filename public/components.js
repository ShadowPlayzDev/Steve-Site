// Helper to inject HTML into a component
const setComponentHTML = (el, html) => el.innerHTML = html;

class SiteHeader extends HTMLElement {
    connectedCallback() {
        setComponentHTML(this, `
        <header id="main-header" class="fixed top-0 left-0 w-full text-gray-100 py-6 px-4 md:px-8 z-50 transition-all duration-500 ease-in-out bg-transparent shadow-none">
            <nav class="container mx-auto flex justify-between items-center relative">
                <a href="#" class="text-2xl md:text-3xl font-bold text-darkAccent hover:text-blue-400">Steve.is-a.dev</a>
                <div id="construction-banner" class="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full animate-pulse mx-2">
                    <span class="material-icons text-[18px] md:text-sm">warning</span>
                    <span class="hidden md:block text-xs font-bold uppercase tracking-widest">Under Construction</span>
                </div>
                <ul class="hidden md:flex space-x-6">
                    <li><a href="#about" class="hover:text-darkAccent transition">About</a></li>
                    <li><a href="#skills" class="hover:text-darkAccent transition">Skills</a></li>
                    <li><a href="#projects" class="hover:text-darkAccent transition">Projects</a></li>
                </ul>
            </nav>
        </header>`);
    }
}

class LandingSection extends HTMLElement {
    connectedCallback() {
        setComponentHTML(this, `
        <section id="home" class="min-h-screen flex items-center justify-center text-center py-16 px-4 bg-gradient-to-br from-gray-900 to-darkPrimary">
            <div class="max-w-4xl mx-auto">
                <img src="./assets/profile.webp" class="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-darkAccent shadow-xl" onerror="this.src='https://ui-avatars.com/api/?name=Steve&background=63b3ed&color=fff&size=200'">
                <h1 class="text-6xl font-extrabold mb-4 text-white">Hi, I'm <span class="text-darkAccent">Steve</span></h1>
                <p class="text-2xl text-gray-300 mb-8">A passionate web developer building modern applications.</p>
                <a href="#about" class="inline-block bg-darkAccent hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition transform hover:scale-105">Learn More</a>
            </div>
        </section>`);
    }
}

class AboutSection extends HTMLElement {
    connectedCallback() {
        setComponentHTML(this, `
        <section id="about" class="py-20 px-4 bg-gray-800 text-gray-200">
            <div class="container mx-auto max-w-5xl">
                <h2 class="text-5xl font-extrabold text-center mb-12 text-white">About Me</h2>
                <div class="text-lg leading-relaxed">
                    <p class="mb-6">Hello! My name is Steve, and I specialize in creating robust web experiences with <span class="font-bold text-darkAccent">Tailwind CSS</span> and JavaScript.</p>
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
            if (data.hidden || !data.player?.gameextrainfo) return;

            const game = data.player.gameextrainfo;
            const appid = data.player.gameid;
            const achievements = data.achievements ? `<p class="text-gray-400 text-sm">🏆 ${data.achievements.unlocked} / ${data.achievements.total} Achievements</p>` : '';

            setComponentHTML(this, `
            <div class="py-10 px-4 bg-gray-900 border-y border-gray-800">
                <div class="container mx-auto max-w-2xl flex items-center gap-6 bg-darkPrimary/30 p-6 rounded-2xl border border-gray-700 shadow-2xl">
                    <img src="https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg" class="w-32 rounded-lg hidden sm:block">
                    <div class="text-left">
                        <h3 class="text-xs uppercase tracking-tighter text-darkAccent font-bold mb-1">Live on Steam</h3>
                        <p class="text-xl font-bold text-white leading-tight">${game}</p>
                        ${achievements}
                    </div>
                </div>
            </div>`);
        } catch (e) { console.error("Steam Component Error", e); }
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        setComponentHTML(this, `
        <footer class="py-12 bg-gray-900 border-t border-gray-800 text-center">
            <p>&copy; ${new Date().getFullYear()} Steve. All rights reserved.</p>
            <p class="mt-2">Built with 💓 from Steve.</p>
        </footer>`);
    }
}

// Define the custom elements
customElements.define('site-header', SiteHeader);
customElements.define('landing-section', LandingSection);
customElements.define('about-section', AboutSection);
customElements.define('steam-now', SteamNow);
customElements.define('site-footer', SiteFooter);
