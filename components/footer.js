// Footer Component - Automatically loads footer HTML
(function() {
    const footerHTML = `
<footer class="w-full bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-white/10 py-12 px-4 md:px-6">
    <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
            <!-- Left: Copyright -->
            <div class="space-y-4">
                <p className="text-sm text-neutral-600 dark:text-white/60">
                    © Cyprien Bons. Tous droits réservés.
                </p>
            </div>

            <!-- Center: Contact Info -->
            <div class="space-y-3">
                <h3 class="text-sm font-semibold text-neutral-950 dark:text-white uppercase tracking-wider mb-4">
                    Contact
                </h3>
                <div class="space-y-2 text-sm">
                    <p class="text-neutral-600 dark:text-white/60">
                        <a
                            href="mailto:pro.bons.cyprien@gmail.com"
                            class="hover:text-neutral-950 dark:hover:text-white transition-colors"
                        >
                            pro.bons.cyprien@gmail.com
                        </a>
                    </p>
                    <p class="text-neutral-600 dark:text-white/60">
                        <a
                            href="tel:+33768512006"
                            class="hover:text-neutral-950 dark:hover:text-white transition-colors"
                        >
                            07 68 51 20 06
                        </a>
                    </p>
                </div>
            </div>

            <!-- Right: Social Links -->
            <div class="space-y-3">
                <h3 class="text-sm font-semibold text-neutral-950 dark:text-white uppercase tracking-wider mb-4">
                    Réseaux sociaux
                </h3>
                <div class="flex gap-4">
                    <a
                        href="https://www.linkedin.com/in/cyprien-bons/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <img
                            src="{{basePath}}img/linkedin.svg"
                            alt="LinkedIn"
                            width="20"
                            height="20"
                            class="dark:invert"
                        />
                    </a>
                    <a
                        href="https://github.com/M2M2005"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
                        aria-label="GitHub"
                    >
                        <img
                            src="{{basePath}}img/github.svg"
                            alt="GitHub"
                            width="20"
                            height="20"
                            class="dark:invert"
                        />
                    </a>
                </div>
            </div>
        </div>

        <!-- Bottom: Attribution -->
        <div class="pt-8 border-t border-neutral-200 dark:border-white/10">
            <p class="text-center text-xs text-neutral-500 dark:text-white/40">
                Développé avec Tailwind CSS
            </p>
        </div>
    </div>
</footer>
    `.trim();

    // Insert footer on page load
    document.addEventListener('DOMContentLoaded', function() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const basePath = footerPlaceholder.getAttribute('data-base-path') || '';
            const html = footerHTML.replace(/\{\{basePath\}\}/g, basePath);
            footerPlaceholder.outerHTML = html;
        }
    });
})();
