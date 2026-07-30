const forms = document.querySelectorAll('form.validate-form');
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
  const exists = registrations.some((item) => item.email && item.email.toLowerCase() === registration.email.toLowerCase());

  if (!exists) {
    registrations.push(registration);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  }
}

function isRequired(value) {
  return value.trim() !== '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return /^\d{10}$/.test(digits);
}

function isValidName(value) {
  return /^[A-Za-z][A-Za-z\s.'-]*$/.test(value.trim());
}

function clearFieldError(field) {
  field.classList.remove('input-error');
  field.setAttribute('aria-invalid', 'false');
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) {
    errorEl.remove();
  }
}

function showFieldError(field, message) {
  field.classList.add('input-error');
  field.setAttribute('aria-invalid', 'true');
  const existingError = document.getElementById(`${field.id}-error`);
  if (existingError) {
    existingError.textContent = message;
    return;
  }

  const errorEl = document.createElement('div');
  errorEl.id = `${field.id}-error`;
  errorEl.className = 'error-text';
  errorEl.setAttribute('role', 'alert');
  errorEl.textContent = message;

  if (field.type === 'checkbox') {
    const label = field.nextElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.insertAdjacentElement('afterend', errorEl);
    } else {
      field.insertAdjacentElement('afterend', errorEl);
    }
  } else {
    field.insertAdjacentElement('afterend', errorEl);
  }
}

function validateField(field) {
  const value = field.value;

  if (field.type === 'checkbox') {
    if (!field.checked) {
      showFieldError(field, 'You must agree to the event rules.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'email') {
    if (!isRequired(value)) {
      showFieldError(field, 'Email is required.');
      return false;
    }
    if (!isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address.');
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
      showFieldError(field, 'Please enter a valid 10-digit phone number.');
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
      showFieldError(field, 'Name should contain letters only.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'college' || field.id === 'department') {
    if (!isRequired(value)) {
      showFieldError(field, 'This field is required.');
      return false;
    }
    if (!isValidName(value)) {
      showFieldError(field, 'This field should contain letters only.');
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (field.id === 'message') {
    clearFieldError(field);
    return true;
  }

  if (field.tagName === 'SELECT') {
    if (!isRequired(value) || value === 'Select Year' || value === 'Select an Event') {
      const label = field.id === 'year' ? 'Please select your year.' : 'Please select an event.';
      showFieldError(field, label);
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (!isRequired(value)) {
    showFieldError(field, 'This field is required.');
    return false;
  }

  clearFieldError(field);
  return true;
}

function clearFormMessages(form) {
  const message = form.querySelector('.form-message');
  if (message) {
    message.remove();
  }
}

function showSuccessMessage(form) {
  clearFormMessages(form);
  const successEl = document.createElement('p');
  successEl.className = 'form-message success';
  successEl.setAttribute('aria-live', 'polite');
  successEl.textContent = 'Registration submitted successfully!';
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.insertAdjacentElement('beforebegin', successEl);
  } else {
    form.appendChild(successEl);
  }
}

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = Array.from(form.querySelectorAll('input, select, textarea'));
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      form.classList.add('is-loading');
      window.setTimeout(() => {
        form.classList.remove('is-loading');
      }, 350);

      const formData = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        college: form.querySelector('#college').value.trim(),
        department: form.querySelector('#department').value.trim(),
        year: form.querySelector('#year').value,
        event: form.querySelector('#event').value,
        message: form.querySelector('#message').value.trim(),
        agreed: form.querySelector('#terms').checked,
      };

      saveRegistration(formData);
      showSuccessMessage(form);
    }
  });
});
