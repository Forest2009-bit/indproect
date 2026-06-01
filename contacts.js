// CONTACTS.JS - Скрипт для страницы контактов
// Валидация формы, отправка данных, интерактивность

document.addEventListener('DOMContentLoaded', function() {
    console.log('📞 Страница контактов загружена');
    
    // Установка текущего года в футере
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Анимация FAQ (раскрывающиеся ответы)
    setupFAQ();
    
    // Валидация формы
    setupFormValidation();
    
    // Дополнительные эффекты для полей формы
    setupFormEffects();
});

// Функция для настройки FAQ (аккордеон)
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Изначально все ответы скрыты
        answer.style.display = 'none';
        
        question.addEventListener('click', function() {
            // Переключаем отображение ответа
            const isOpen = answer.style.display === 'block';
            
            // Закрываем все другие ответы (опционально)
            // faqItems.forEach(otherItem => {
            //     const otherAnswer = otherItem.querySelector('.faq-answer');
            //     otherAnswer.style.display = 'none';
            // });
            
            // Открываем/закрываем текущий
            answer.style.display = isOpen ? 'none' : 'block';
            
            // Анимация иконки
            const icon = this.querySelector('.fa-chevron-right');
            if (icon) {
                icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });
}

// Функция для настройки валидации формы
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    // Получаем все поля
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentCheckbox = document.getElementById('consent');
    
    // Функция для отображения ошибки
    function showError(input, message) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        input.classList.add('error');
        input.classList.remove('valid');
    }
    
    // Функция для скрытия ошибки
    function hideError(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        input.classList.remove('error');
        input.classList.add('valid');
    }
    
    // Валидация имени
    function validateName() {
        const value = nameInput.value.trim();
        if (value === '') {
            showError(nameInput, 'Пожалуйста, введите ваше имя');
            return false;
        }
        if (value.length < 2) {
            showError(nameInput, 'Имя должно содержать минимум 2 символа');
            return false;
        }
        hideError(nameInput);
        return true;
    }
    
    // Валидация email
    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        
        if (value === '') {
            showError(emailInput, 'Пожалуйста, введите email');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, 'Введите корректный email адрес');
            return false;
        }
        hideError(emailInput);
        return true;
    }
    
    // Валидация сообщения
    function validateMessage() {
        const value = messageInput.value.trim();
        if (value === '') {
            showError(messageInput, 'Пожалуйста, введите сообщение');
            return false;
        }
        if (value.length < 10) {
            showError(messageInput, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }
        hideError(messageInput);
        return true;
    }
    
    // Валидация чекбокса
    function validateConsent() {
        const isChecked = consentCheckbox.checked;
        const errorDiv = document.getElementById('consent-error');
        
        if (!isChecked) {
            if (errorDiv) {
                errorDiv.textContent = 'Необходимо согласие на обработку персональных данных';
                errorDiv.style.display = 'block';
            }
            consentCheckbox.classList.add('error');
            return false;
        }
        
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        consentCheckbox.classList.remove('error');
        return true;
    }
    
    // Добавляем обработчики событий для полей
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', validateName);
    
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', validateEmail);
    
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', validateMessage);
    
    consentCheckbox.addEventListener('change', validateConsent);
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверяем все поля
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        const isConsentValid = validateConsent();
        
        if (isNameValid && isEmailValid && isMessageValid && isConsentValid) {
            // Собираем данные формы
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: document.getElementById('subject').value,
                message: messageInput.value.trim(),
                consent: consentCheckbox.checked,
                date: new Date().toISOString()
            };
            
            // Сохраняем в localStorage для демонстрации (имитация отправки)
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(formData);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            console.log('📨 Форма отправлена:', formData);
            
            // Показываем сообщение об успехе
            successMessage.style.display = 'flex';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            
            // Очищаем форму
            form.reset();
            
            // Убираем классы валидации
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('valid', 'error');
            });
            
            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
                successMessage.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 5000);
            
            // Дополнительная анимация
            showNotification('Сообщение успешно отправлено!', 'success');
        } else {
            // Показываем уведомление об ошибке
            showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            
            // Прокручиваем к первому полю с ошибкой
            const firstError = document.querySelector('.form-input.error, .form-textarea.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// Функция для настройки дополнительных эффектов формы
function setupFormEffects() {
    // Эффект при фокусе на полях
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Эффект для кнопки отправки при наведении
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        font-family: inherit;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимаций уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
