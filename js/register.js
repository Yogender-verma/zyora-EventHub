// EventHub - Registration Form Validation & Storage Module
document.addEventListener('DOMContentLoaded', () => {
  initRegistrationForm();
});

const STORAGE_KEY = 'eventhub-registrations';

function getStoredRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveRegistration(registration) {
  const registrations = getStoredRegistrations();
  registrations.push(registration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

function isRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

function isValidName(value) {
  return /^[A-Za-z][A-Za-z\s.'-]*$/.test(value.trim());
}

function clearFieldError(field) {
  field.classList.remove('input-error');
  field.removeAttribute('aria-invalid');
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) {
    errorEl.remove();
  }
}

function showFieldError(field, message) {
  field.classList.add('input-error');
  field.setAttribute('aria-invalid', 'true');
  
  let errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) {
    errorEl.textContent = message;
    return;
  }

  errorEl = document.createElement('div');
  errorEl.id = `${field.id}-error`;
  errorEl.className = 'error-text';
  errorEl.setAttribute('role', 'alert');
  errorEl.textContent = message;

  if (field.type === 'checkbox') {
    const parent = field.closest('.form-terms-box') || field.parentElement;
    parent.appendChild(errorEl);
  } else {
    field.insertAdjacentElement('afterend', errorEl);
  }
}

function validateField(field) {
  const value = field.value || '';

  if (field.type === 'checkbox') {
    if (!field.checked) {
      showFieldError(field, 'You must agree to the event rules and code of conduct.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'name') {
    if (!isRequired(value)) {
      showFieldError(field, 'Full name is required.');
      return false;
    }
    if (!isValidName(value)) {
      showFieldError(field, 'Name should contain letters and spaces only.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'email') {
    if (!isRequired(value)) {
      showFieldError(field, 'Email address is required.');
      return false;
    }
    if (!isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'phone') {
    if (!isRequired(value)) {
      showFieldError(field, 'Phone number is required.');
      return false;
    }
    if (!isValidPhone(value)) {
      showFieldError(field, 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'college') {
    if (!isRequired(value)) {
      showFieldError(field, 'College name is required.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'department') {
    if (!isRequired(value)) {
      showFieldError(field, 'Department is required.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'year') {
    if (!isRequired(value) || value.includes('Select')) {
      showFieldError(field, 'Please select your year of study.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'event') {
    if (!isRequired(value) || value.includes('Select')) {
      showFieldError(field, 'Please select an event / track.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'message') {
    clearFieldError(field);
    return true;
  }

  clearFieldError(field);
  return true;
}

function clearFormMessages(form) {
  const messages = form.querySelectorAll('.form-message');
  messages.forEach(msg => msg.remove());
}

function showSuccessBanner(form) {
  clearFormMessages(form);
  const successEl = document.createElement('div');
  successEl.className = 'form-message success';
  successEl.setAttribute('role', 'status');
  successEl.innerHTML = `
    🎉 <strong>Registration Successful!</strong> Your pass for EventHub 2026 is confirmed. See you at Google Office, Hyderabad!
  `;
  const submitWrapper = form.querySelector('.form-submit-wrapper');
  if (submitWrapper) {
    submitWrapper.insertAdjacentElement('beforebegin', successEl);
  } else {
    form.appendChild(successEl);
  }
}

function initRegistrationForm() {
  const forms = document.querySelectorAll('form.validate-form');

  forms.forEach((form) => {
    // Real-time input validation on blur/input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      clearFormMessages(form);

      const fields = Array.from(form.querySelectorAll('input[required], select, textarea, #terms'));
      let isValid = true;

      fields.forEach((field) => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        const formData = {
          id: 'reg-' + Date.now(),
          name: form.querySelector('#name').value.trim(),
          email: form.querySelector('#email').value.trim(),
          phone: form.querySelector('#phone').value.trim(),
          college: form.querySelector('#college').value.trim(),
          department: form.querySelector('#department').value.trim(),
          year: form.querySelector('#year').value,
          event: form.querySelector('#event').value,
          message: form.querySelector('#message') ? form.querySelector('#message').value.trim() : '',
          timestamp: new Date().toISOString()
        };

        saveRegistration(formData);
        showSuccessBanner(form);
        form.reset();

        // Remove error styles if any remained
        inputs.forEach(input => clearFieldError(input));
      } else {
        // Focus first failing field
        const firstError = form.querySelector('.input-error');
        if (firstError) firstError.focus();
      }
    });
  });
}
