// Global Language State
let currentLang = 'ar';

// UI Elements for Translation
const translations = {
    ar: {
        heroTitle: 'G12 للوجبات الصحية',
        heroSubtitle: 'طعام صحي صُنع خصيصاً لأبطالنا',
        callText: 'إتصل بنا للطلب',
        mapText: 'موقعنا',
        menuHeading: 'قائمة الطعام',
        instagramText: 'تابعنا على إنستغرام',
        footerText: '&copy; 2026 جميع الحقوق محفوظة - G12 للوجبات الصحية'
    },
    en: {
        heroTitle: 'G12 Diet Food',
        heroSubtitle: 'Healthy food made specifically for our champions',
        callText: 'Call to Order',
        mapText: 'Our Location',
        menuHeading: 'Our Menu',
        instagramText: 'Follow us on Instagram',
        footerText: '&copy; 2026 All Rights Reserved - G12 Diet Food'
    }
};

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const langSwitch = document.getElementById('lang-switch');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Hide Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 800);

    // Initial render
    renderMenu();
    setupIntersectionObserver();

    // Language Toggle Event
    langSwitch.addEventListener('change', (e) => {
        currentLang = e.target.checked ? 'en' : 'ar';
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
        
        updateStaticText();
        renderMenu();
        // Re-setup observer for newly rendered items
        setTimeout(setupIntersectionObserver, 100);
    });
});

function updateStaticText() {
    const t = translations[currentLang];
    document.getElementById('hero-title').textContent = t.heroTitle;
    document.getElementById('hero-subtitle').textContent = t.heroSubtitle;
    document.getElementById('call-text').textContent = t.callText;
    document.getElementById('map-text').textContent = t.mapText;
    document.getElementById('menu-heading').textContent = t.menuHeading;
    document.getElementById('instagram-text').textContent = t.instagramText;
    document.getElementById('footer-text').innerHTML = t.footerText;
}

function renderMenu() {
    menuContainer.innerHTML = '';
    
    menuData.forEach((item, index) => {
        const langData = item[currentLang];
        
        const card = document.createElement('div');
        card.className = 'menu-item';
        // Stagger animation delay based on index
        card.style.transitionDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" alt="${langData.name}" class="item-image" loading="lazy">
                <div class="item-price-tag">${item.price}</div>
            </div>
            <div class="item-details">
                <h3 class="item-name">${langData.name}</h3>
                <p class="item-description">${langData.description}</p>
            </div>
        `;
        
        menuContainer.appendChild(card);
    });
}

function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        observer.observe(item);
    });
}
