// ============================================
// ОБЩИЙ JAVASCRIPT ДЛЯ ВСЕХ СТРАНИЦ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Сайт загружен!');
    
    // Установка текущего года в футере
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Определяем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Инициализация функций в зависимости от страницы
    if (currentPage === 'gallery.html') {
        initGallery();
    } else if (currentPage === 'contacts.html') {
        initContacts();
    }
});

// ========== ФУНКЦИИ ДЛЯ ГАЛЕРЕИ ==========
function initGallery() {
    console.log('📸 Галерея инициализирована');
    
    // Данные лайков
    let likes = JSON.parse(localStorage.getItem('galleryLikes')) || {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
    };
    
    // Обновление счетчиков
    function updateCounters() {
        const totalLikes = Object.values(likes).reduce((sum, val) => sum + val, 0);
        const totalLikesSpan = document.getElementById('total-likes');
        if (totalLikesSpan) totalLikesSpan.textContent = totalLikes;
        
        document.querySelectorAll('.like-btn').forEach(btn => {
            const id = btn.dataset.id;
            const countSpan = btn.querySelector('.like-count');
            if (countSpan && likes[id]) {
                countSpan.textContent = likes[id];
            }
        });
    }
    
    // Обновление количества изображений
    function updateImageCounter() {
        const visibleCards = Array.from(document.querySelectorAll('.image-card')).filter(card => {
            return card.style.display !== 'none';
        }).length;
        const counter = document.getElementById('image-counter');
        if (counter) counter.textContent = visibleCards;
    }
    
    // Инициализация лайков
    document.querySelectorAll('.like-btn').forEach(btn => {
        const id = btn.dataset.id;
        const countSpan = btn.querySelector('.like-count');
        if (likes[id]) countSpan.textContent = likes[id];
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            likes[id] = (likes[id] || 0) + 1;
            localStorage.setItem('galleryLikes', JSON.stringify(likes));
            const countSpan = this.querySelector('.like-count');
            countSpan.textContent = likes[id];
            updateCounters();
            
            this.classList.add('liked');
            setTimeout(() => this.classList.remove('liked'), 300);
        });
    });
    
    // Зум изображений
    const modal = document.getElementById('zoom-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && modalImg) {
        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.image-card');
                const img = card.querySelector('.gallery-img');
                modalImg.src = img.src;
                modal.classList.add('active');
            });
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', () => modal.classList.remove('active'));
        }
    }
    
    // Фильтрация
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.image-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            updateImageCounter();
        });
    });
    
    // Переключение вида
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const galleryGrid = document.getElementById('image-gallery');
    
    if (gridViewBtn && listViewBtn && galleryGrid) {
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            galleryGrid.classList.remove('list-view');
        });
        
        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            galleryGrid.classList.add('list-view');
        });
    }
    
    updateCounters();
    updateImageCounter();
    setTimeout(updateImageCounter, 100);
}

// ========== ФУНКЦИИ ДЛЯ КОНТАКТОВ ==========
function initContacts() {
    console.log('📞 Страница контактов инициализирована');
    
    // Настройка FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.display = 'none';
        
        if (question) {
            question.addEventListener('click', function() {
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
            });
        }
    });
    
    // Валидация формы
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentCheckbox = document.getElementById('consent');
    const successMessage = document.getElementById('form-success');
    
    function showError(input, message) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        input.classList.add('error');
    }
    
    function hideError(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        input.classList.remove('error');
    }
    
    function validateName() {
        const value = nameInput.value.trim();
        if (value === '') {
            showError(nameInput, 'Введите ваше имя');
            return false;
        }
        if (value.length < 2) {
            showError(nameInput, 'Имя должно содержать минимум 2 символа');
            return false;
        }
        hideError(nameInput);
        return true;
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (value === '') {
            showError(emailInput, 'Введите email');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, 'Введите корректный email');
            return false;
        }
        hideError(emailInput);
        return true;
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        if (value === '') {
            showError(messageInput, 'Введите сообщение');
            return false;
        }
        if (value.length < 10) {
            showError(messageInput, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }
        hideError(messageInput);
        return true;
    }
    
    function validateConsent() {
        const isChecked = consentCheckbox.checked;
        const errorDiv = document.getElementById('consent-error');
        if (!isChecked) {
            if (errorDiv) {
                errorDiv.textContent = 'Необходимо согласие на обработку данных';
                errorDiv.style.display = 'block';
            }
            return false;
        }
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        return true;
    }
    
    if (nameInput) nameInput.addEventListener('blur', validateName);
    if (emailInput) emailInput.addEventListener('blur', validateEmail);
    if (messageInput) messageInput.addEventListener('blur', validateMessage);
    if (consentCheckbox) consentCheckbox.addEventListener('change', validateConsent);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        const isConsentValid = validateConsent();
        
        if (isNameValid && isEmailValid && isMessageValid && isConsentValid) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: document.getElementById('subject')?.value || '',
                message: messageInput.value.trim(),
                date: new Date().toISOString()
            };
            
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(formData);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            console.log('📨 Форма отправлена:', formData);
            
            if (successMessage) successMessage.style.display = 'flex';
            form.reset();
            
            setTimeout(() => {
                if (successMessage) successMessage.style.display = 'none';
            }, 5000);
            
            showNotification('Сообщение успешно отправлено!', 'success');
        } else {
            showNotification('Пожалуйста, заполните все поля', 'error');
        }
    });
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
