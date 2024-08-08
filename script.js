document.addEventListener("DOMContentLoaded", function() {
    const buttons = {
        login: document.getElementById("login-btn"),
        register: document.getElementById("register-btn"),
        reset: document.getElementById("reset-btn")
    };

    const forms = {
        login: document.getElementById("login-form"),
        register: document.getElementById("register-form"),
        reset: document.getElementById("reset-form")
    };

    Object.keys(buttons).forEach(formType => {
        buttons[formType].addEventListener("click", () => setActiveForm(formType));
    });

    function setActiveForm(formType) {
        Object.values(forms).forEach(form => form.classList.remove("active"));
        Object.values(buttons).forEach(btn => btn.classList.remove("active"));

        forms[formType].classList.add("active");
        buttons[formType].classList.add("active");
    }

    function showMessage(message, element) {
        element.textContent = message;
        element.style.color = "red";
        element.style.fontSize = "14px";
        element.style.fontWeight = "bold";
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function checkEmail(email, messageElement) {
        messageElement.textContent = "";

        if (!email.includes("@")) {
            showMessage("Email должен содержать символ '@'", messageElement);
            return false;
        }

        const atIndex = email.indexOf("@");
        if (email.slice(atIndex).indexOf(".") === -1) {
            showMessage("Email должен содержать символ '.' после '@'", messageElement);
            return false;
        }

        return true;
    }

    function handleFormSubmit(formType, validationChecks) {
        forms[formType].addEventListener("submit", function(e) {
            e.preventDefault();

            const fields = validationChecks.fields.reduce((acc, field) => {
                acc[field.name] = document.getElementById(field.id).value;
                return acc;
            }, {});

            const message = document.getElementById(validationChecks.messageId);
            let isValid = validationChecks.checks.every(check => check(fields, message));

            message.textContent = isValid ? validationChecks.successMessage : validationChecks.errorMessage;
            message.style.color = isValid ? "green" : "red";
        });
    }

    handleFormSubmit("login", {
        fields: [{ name: "email", id: "login-email" }, { name: "password", id: "login-password" }],
        messageId: "login-message",
        checks: [
            fields => checkEmail(fields.email, document.getElementById("login-message")),
            fields => fields.password
        ],
        successMessage: "Успешная авторизация!",
        errorMessage: "Ошибка авторизации!"
    });

    handleFormSubmit("register", {
        fields: [
            { name: "name", id: "register-name" },
            { name: "email", id: "register-email" },
            { name: "password", id: "register-password" },
            { name: "confirmPassword", id: "confirm-password" }
        ],
        messageId: "register-message",
        checks: [
            fields => checkEmail(fields.email, document.getElementById("register-message")),
            fields => fields.name,
            fields => fields.password === fields.confirmPassword
        ],
        successMessage: "Успешная регистрация!",
        errorMessage: "Ошибка регистрации!"
    });

    handleFormSubmit("reset", {
        fields: [{ name: "email", id: "reset-email" }],
        messageId: "reset-message",
        checks: [fields => checkEmail(fields.email, document.getElementById("reset-message"))],
        successMessage: "Успешное восстановление!",
        errorMessage: "Ошибка восстановления!"
    });
});
