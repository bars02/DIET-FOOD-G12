// Global State
let currentLang = 'ar';
let cart = [];
let currentSelectedItem = null;

// UI Elements for Translation
const translations = {
    ar: {
        heroTitle: 'G12 للوجبات الصحية',
        heroSubtitle: 'طعام صحي صُنع خصيصاً لأبطالنا',
        callText: 'إتصل بنا',
        mapText: 'موقعنا',
        menuHeading: 'قائمة الطعام',
        instagramText: 'تابعنا على إنستغرام',
        footerText: '&copy; 2026 جميع الحقوق محفوظة - G12 للوجبات الصحية',
        currency: 'د.ع',
        addToCart: 'إضافة للسلة',
        cartTitle: 'سلة الطلبات',
        emptyCart: 'السلة فارغة',
        checkoutWhatsapp: 'تثبيت طلب عبر واتساب',
        waGreeting: 'مرحبا مطعم G12',
        waOrderDetails: 'تفاصيل الطلب:',
        waFinalPriceReq: 'الرجاء إعلامي بالسعر النهائي للطلب (مع التوصيل)',
        waLocationReq: 'دقائق وسوف اقوم بارسال موقعي'
    },
    en: {
        heroTitle: 'G12 Diet Food',
        heroSubtitle: 'Healthy food made specifically for our champions',
        callText: 'Call Us',
        mapText: 'Our Location',
        menuHeading: 'Our Menu',
        instagramText: 'Follow us on Instagram',
        footerText: '&copy; 2026 All Rights Reserved - G12 Diet Food',
        currency: 'IQD',
        addToCart: 'Add to Cart',
        cartTitle: 'Your Cart',
        emptyCart: 'Cart is empty',
        checkoutWhatsapp: 'Confirm order via WhatsApp',
        waGreeting: 'Hello G12 Restaurant',
        waOrderDetails: 'Order Details:',
        waFinalPriceReq: 'Please let me know the final price of the order (with delivery)',
        waLocationReq: 'I will send my location in a few minutes'
    }
};

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const langSwitch = document.getElementById('lang-switch');

// Modal Elements
const itemModal = document.getElementById('item-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Cart Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');

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
    updateCartUI();

    // Language Toggle Event
    langSwitch.addEventListener('change', (e) => {
        currentLang = e.target.checked ? 'en' : 'ar';
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
        
        updateStaticText();
        renderMenu();
        updateCartUI();
        if(itemModal.classList.contains('active')) {
            openModal(currentSelectedItem.id); // Refresh modal text
        }
        // Re-setup observer for newly rendered items
        setTimeout(setupIntersectionObserver, 100);
    });

    // Add to cart click
    addToCartBtn.addEventListener('click', () => {
        if(currentSelectedItem) {
            addToCart(currentSelectedItem);
            closeModal();
            toggleCart(); // Open cart to show user
        }
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
    
    document.getElementById('add-to-cart-btn').textContent = t.addToCart;
    document.getElementById('cart-title').textContent = t.cartTitle;
    document.getElementById('checkout-text').textContent = t.checkoutWhatsapp;
}

function renderMenu() {
    menuContainer.innerHTML = '';
    const t = translations[currentLang];
    
    menuData.forEach((item, index) => {
        const langData = item[currentLang];
        
        const card = document.createElement('div');
        card.className = 'menu-item';
        card.style.transitionDelay = `${index * 0.1}s`;
        card.onclick = () => openModal(item.id);
        
        card.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" alt="${langData.name}" class="item-image" loading="lazy">
                <div class="item-price-tag">${item.price} ${t.currency}</div>
            </div>
            <div class="item-details">
                <h3 class="item-name">${langData.name}</h3>
            </div>
        `;
        
        menuContainer.appendChild(card);
    });
}

// Modal Logic
function openModal(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;
    
    currentSelectedItem = item;
    const langData = item[currentLang];
    const t = translations[currentLang];
    
    modalImage.src = item.image;
    modalTitle.textContent = langData.name;
    modalDescription.textContent = langData.description;
    modalPrice.textContent = `${item.price} ${t.currency}`;
    
    itemModal.classList.add('active');
}

function closeModal() {
    itemModal.classList.remove('active');
    currentSelectedItem = null;
}

// Cart Logic
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const t = translations[currentLang];
    cartItemsContainer.innerHTML = '';
    
    let totalItems = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">${t.emptyCart}</div>`;
        checkoutBtn.disabled = true;
        cartBadge.textContent = '0';
        return;
    }
    
    checkoutBtn.disabled = false;
    
    cart.forEach(item => {
        totalItems += item.qty;
        const langData = item[currentLang];
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" class="cart-item-img" alt="${langData.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${langData.name}</div>
                <div class="cart-item-price">${item.qty} x ${item.price} ${t.currency}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    cartBadge.textContent = totalItems.toString();
}

function checkoutWhatsapp() {
    if (cart.length === 0) return;
    
    const t = translations[currentLang];
    
    let message = `${t.waGreeting}\n\n`;
    message += `${t.waOrderDetails}\n`;
    
    cart.forEach(item => {
        const langData = item[currentLang];
        // Format: 2x Name - 5000 IQD
        message += `▪ ${item.qty}x ${langData.name} - ${item.price} ${t.currency}\n`;
    });
    
    message += `\n${t.waFinalPriceReq}\n`;
    message += `${t.waLocationReq}`;
    
    const whatsappUrl = `https://wa.me/9647844121212?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
