document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous error messages
    clearErrors();

    // Gather form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        termsCheckbox: document.getElementById('termsCheckbox').checked
    };

    // Validate form data
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        return;
    }

    // Send data to the server
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            alert('Registration successful! Redirecting to login...');
            window.location.href = '/login';
        } else {
            displayErrors({ submit: result.message });
        }
    } catch (error) {
        displayErrors({ submit: 'An error occurred. Please try again.' });
    }
});

function validateForm(data) {
    const errors = {};

    if (!data.firstName) errors.firstName = 'First name is required';
    if (!data.lastName) errors.lastName = 'Last name is required';
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (!data.phone || data.phone.length < 10) {
        errors.phone = 'Phone number must be at least 10 digits';
    }
    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    if (!data.termsCheckbox) {
        errors.terms = 'You must agree to the terms';
    }

    return errors;
}

function displayErrors(errors) {
    for (const key in errors) {
        if (errors[key]) {
            document.getElementById(`${key}Error`).innerText = errors[key];
        }
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.innerText = '');
}

function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
}