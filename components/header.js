// Header Component - Automatically loads header HTML
(function() {
    const headerHTML = `
<header class="header-container">
    <a href="{{basePath}}index.html" class="header-logo">
        <img src="{{basePath}}img/Logo_Ceb.jpg" alt="Logo Ceb" class="w-20 h-20 rounded-lg object-cover">
    </a>
    <div class="header-nav">
        <a href="{{basePath}}index.html" class="{{menuClass}}">Menu</a>
    </div>
    <!-- Bouton burger -->
    <div class="burger-btn" id="burger-menu">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
    </div>
    <!-- Menu déroulant pour le burger -->
    <nav class="burger-menu" id="burger-nav">
        <a href="{{basePath}}index.html" class="burger-menu-link">Menu</a>
    </nav>
</header>
    `.trim();

    // Insert header on page load
    document.addEventListener('DOMContentLoaded', function() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const basePath = headerPlaceholder.getAttribute('data-base-path') || '';
            const subtitle = headerPlaceholder.getAttribute('data-subtitle') || 'Compétitions';
            const isHome = headerPlaceholder.getAttribute('data-home') === 'true';
            const menuClass = isHome ? 'header-nav-link-active' : 'header-nav-link';

            const html = headerHTML
                .replace(/\{\{basePath\}\}/g, basePath)
                .replace(/\{\{subtitle\}\}/g, subtitle)
                .replace(/\{\{menuClass\}\}/g, menuClass);

            headerPlaceholder.outerHTML = html;
        }
    });
})();
