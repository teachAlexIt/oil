// Price Calculator Logic
class PriceCalculator {
    constructor() {
        this.oilTypeSelect = document.getElementById('oil-type-select');
        this.volumeSelect = document.getElementById('volume-select');
        this.oilOptions = document.getElementById('oil-options');
        this.volumeOptions = document.getElementById('volume-options');
        this.bottleCheckbox = document.getElementById('bottle');
        this.totalPriceElement = document.getElementById('total-price');
        this.warningElement = document.getElementById('warning');

        this.selectedOil = null;
        this.selectedVolume = null;

        this.init();
    }

    init() {
        // Заполняем опции из базы данных
        this.populateOilOptions();
        this.populateVolumeOptions();

        // Add event listeners
        this.setupCustomSelects();
        this.bottleCheckbox.addEventListener('change', () => this.calculatePrice());

        // Initialize calculation
        this.calculatePrice();
    }

    // Настройка кастомных выпадающих списков
    setupCustomSelects() {
        // Обработчик для выбора масла
        this.oilTypeSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSelect(this.oilTypeSelect, this.oilOptions);
        });

        // Обработчик для выбора объема
        this.volumeSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSelect(this.volumeSelect, this.volumeOptions);
        });

        // Закрытие при клике вне селектов
        document.addEventListener('click', () => {
            this.closeAllSelects();
        });
    }

        // Переключение состояния селекта
    toggleSelect(selectElement, optionsElement) {
        const isActive = selectElement.classList.contains('active');
        this.closeAllSelects();
        
        if (!isActive) {
            selectElement.classList.add('active');
            optionsElement.classList.add('active');
            
            // Динамически рассчитываем высоту для опций
            this.calculateOptionsHeight(optionsElement);
        }
    }
    
    // Расчет высоты для опций
    calculateOptionsHeight(optionsElement) {
        // Временно показываем опции для измерения
        optionsElement.style.maxHeight = 'none';
        optionsElement.style.visibility = 'hidden';
        optionsElement.style.position = 'absolute';
        
        // Получаем реальную высоту
        const optionsHeight = optionsElement.scrollHeight;
        
        // Возвращаем обратно
        optionsElement.style.visibility = 'visible';
        optionsElement.style.position = 'relative';
        
        // Устанавливаем максимальную высоту
        optionsElement.style.maxHeight = optionsHeight + 'px';
    }

    // Закрытие всех селектов
    closeAllSelects() {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.classList.remove('active');
        });
        document.querySelectorAll('.select-options').forEach(options => {
            options.classList.remove('active');
            // Сбрасываем max-height при закрытии
            options.style.maxHeight = '0px';
        });
    }

    // Заполняем опции масел из базы данных
    populateOilOptions() {
        const oils = getAllOils();
        this.oilOptions.innerHTML = '';

        oils.forEach(oil => {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.dataset.value = oil.id;
            option.dataset.price = oil.pricePer100ml;
            option.textContent = oil.name;

            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOil(oil.id, oil.name);
            });

            this.oilOptions.appendChild(option);
        });
    }

    // Заполняем опции объемов из базы данных
    populateVolumeOptions() {
        const oils = getAllOils();
        if (oils.length > 0) {
            const volumes = oils[0].volumeDiscounts;
            this.volumeOptions.innerHTML = '';

            volumes.forEach(volume => {
                const option = document.createElement('div');
                option.className = 'select-option';
                option.dataset.value = volume.volume;
                option.dataset.multiplier = volume.multiplier;
                option.dataset.discount = volume.discount;
                option.dataset.time = volume.timeMinutes;
                option.textContent = `${volume.volume} мл`;

                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectVolume(volume.volume, `${volume.volume} мл`, volume.timeMinutes);
                });

                this.volumeOptions.appendChild(option);
            });
        }
    }

    // Выбор масла
    selectOil(oilId, oilName) {
        this.selectedOil = oilId;

        // Обновляем отображение
        const placeholder = this.oilTypeSelect.querySelector('.select-placeholder');
        placeholder.textContent = oilName;
        placeholder.style.color = 'var(--text-color)';

        // Обновляем опции объемов для выбранного масла
        this.updateVolumeOptions(oilId);

        // Сбрасываем выбор объема
        this.selectedVolume = null;
        const volumePlaceholder = this.volumeSelect.querySelector('.select-placeholder');
        volumePlaceholder.textContent = 'Выберите объём';
        volumePlaceholder.style.color = '#999';

        // Закрываем селекты
        this.closeAllSelects();
        this.calculatePrice();
    }

    // Выбор объема
    selectVolume(volume, volumeText, timeMinutes) {
        this.selectedVolume = volume;

        // Обновляем отображение
        const placeholder = this.volumeSelect.querySelector('.select-placeholder');
        placeholder.textContent = volumeText;
        placeholder.style.color = 'var(--text-color)';

        // Закрываем селекты
        this.closeAllSelects();
        this.calculatePrice();
    }

    // Обновление опций объемов для выбранного масла
    updateVolumeOptions(oilId) {
        const oil = getOilById(oilId);
        if (!oil) return;

        this.volumeOptions.innerHTML = '';

        oil.volumeDiscounts.forEach(volume => {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.dataset.value = volume.volume;
            option.dataset.multiplier = volume.multiplier;
            option.dataset.discount = volume.discount;
            option.dataset.time = volume.timeMinutes;
            option.textContent = `${volume.volume} мл`;

            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectVolume(volume.volume, `${volume.volume} мл`, volume.timeMinutes);
            });

            this.volumeOptions.appendChild(option);
        });
    }

    calculatePrice() {
        const needBottle = this.bottleCheckbox.checked;

        let totalPrice = 0;
        let savings = 0;
        let timeInfo = '';

        if (this.selectedOil && this.selectedVolume) {
            const oil = getOilById(this.selectedOil);
            const discount = getVolumeDiscount(this.selectedOil, parseInt(this.selectedVolume));

            if (oil && discount) {
                // Рассчитываем стоимость без скидки
                const priceWithoutDiscount = oil.pricePer100ml * (this.selectedVolume / 100);

                // Рассчитываем стоимость со скидкой
                totalPrice = calculateOilPrice(this.selectedOil, parseInt(this.selectedVolume));

                // Рассчитываем выгоду в рублях
                savings = priceWithoutDiscount - totalPrice;

                // Время получения
                if (discount.timeMinutes) {
                    timeInfo = `Время ожидания: ${discount.timeMinutes} мин`;
                }
            }

            if (needBottle) {
                totalPrice += additionalSettings.bottlePrice;
            }
        }

                // Формируем результат
        let resultText = `Стоимость: ${Math.round(totalPrice)} ${additionalSettings.currency}`;
        
        // if (savings > 0) {
        //     resultText += `Выгода: ${Math.round(savings)} ${additionalSettings.currency}`;
        // }
        
        // resultText += timeInfo;

        const resultFullText = `
        <span class="result-text">${resultText}</span>
        <span class="result-savings">${savings > 0 ? `Выгода: ${Math.round(savings)} ${additionalSettings.currency}` : ''}</span>
        <span class="result-time">${timeInfo}</span>
        `

        // Update display
        this.totalPriceElement.innerHTML = resultFullText;

        // Show/hide warning
        if (this.selectedOil && this.selectedVolume && !needBottle) {
            this.warningElement.style.display = 'flex';
        } else {
            this.warningElement.style.display = 'none';
        }
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Header Background on Scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Animate Elements on Scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements to animate
    const animateElements = document.querySelectorAll('.benefit-card, .oil-card, .section-header');
    animateElements.forEach(el => observer.observe(el));
}

// Form Validation
function initFormValidation() {
    const calculatorForm = document.querySelector('.calculator-form');

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const oilType = document.getElementById('oil-type').value;
            const volume = document.getElementById('volume').value;

            if (!oilType || !volume) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Заказ отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.7;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Lazy Loading for Images (if real images are added later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Функция для создания карточек масел из базы данных
function createOilCards() {
    const oilsGrid = document.getElementById('oils-grid');
    if (!oilsGrid) return;

    const oils = getAllOils();
    console.log('Создаем карточки для масел:', oils);

    oils.forEach(oil => {
        const oilCard = document.createElement('div');
        oilCard.className = 'oil-card';

        // Проверяем свойства масла
        console.log(`Свойства для ${oil.name}:`, oil.properties);

        oilCard.innerHTML = `
            <div class="oil-image">
                <img src="images/${oil.type.toLowerCase()}.jpg" alt="${oil.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="image-placeholder" style="display: none;">
                    <i class="${oil.icon}"></i>
                    <span>${oil.name}</span>
                </div>
            </div>
            <div class="oil-content">
                <div class="oil-content-top">
                    <h3>${oil.name}</h3>
                    <p>${oil.description}</p>
                    <div class="oil-properties">
                        ${oil.properties.map(property => `<span class="property">${property}</span>`).join('')}
                    </div>
                </div>
                <div class="oil-price">
                        <span class="price-label">от ${oil.pricePer100ml} ${additionalSettings.currency}/100 мл</span>
                </div>
            </div>
        `;

        oilsGrid.appendChild(oilCard);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Создаем карточки масел из базы данных
    createOilCards();

    // Initialize calculator
    new PriceCalculator();

    // Initialize other features
    initSmoothScrolling();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initFormValidation();
    initLazyLoading();

    // Add loading animation
    document.body.classList.add('loaded');
});

// Add CSS for animations
const animationStyles = `
    .benefit-card, .oil-card, .section-header {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .benefit-card.animate-in, .oil-card.animate-in, .section-header.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 30px rgba(0, 0, 0, 0.15);
    }
    
    body.loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 1rem;
            gap: 1rem;
        }
        
        .mobile-menu-btn.active i {
            transform: rotate(90deg);
        }
        
        .mobile-menu-btn i {
            transition: transform 0.3s ease;
        }
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet); 