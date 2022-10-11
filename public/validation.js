const homepageInput = document.getElementById("homepage");
const cityInput = document.getElementById("city");
const errorBox = document.getElementById("error-box");
const firstInput = document.getElementById("first");
const lastInput = document.getElementById("last");
const emailInput = document.getElementById("email");

if (cityInput) {
    cityInput.addEventListener("input", (event) => {
        const value = [...event.target.value];
        console.log(cityInput.value);
        for (let i = 0; i < value.length; i++) {
            if (i === 0) {
                value[i] = value[i].toUpperCase();
                errorBox.innerText = "";
            }
            if (/\d/.test(value[i])) {
                value[i] = "";
                errorBox.innerText = "Please don't insert numbers here";
            }
        }
        cityInput.value = value.join("");
    });
}

if (homepageInput) {
    homepageInput.addEventListener("input", (event) => {
        const value = event.target.value;
        if (value.startsWith("http://") || value.startsWith("https://")) {
            errorBox.innerText = "";
            return;
        }
        errorBox.innerText =
            "Please insert a valid url, that starts with http or https";
    });
}

if (firstInput) {
    firstInput.addEventListener("input", (event) => {
        const value = [...event.target.value];
        console.log(firstInput.value);
        for (let i = 0; i < value.length; i++) {
            if (i === 0) {
                value[i] = value[i].toUpperCase();
                errorBox.innerText = "";
            }
            if (/\d/.test(value[i])) {
                value[i] = "";
                errorBox.innerText = "Please don't insert numbers here";
            }
        }
        firstInput.value = value.join("");
    });
}

if (lastInput) {
    lastInput.addEventListener("input", (event) => {
        const value = [...event.target.value];
        console.log(lastInput.value);
        for (let i = 0; i < value.length; i++) {
            if (i === 0) {
                value[i] = value[i].toUpperCase();
                errorBox.innerText = "";
            }
            if (/\d/.test(value[i])) {
                value[i] = "";
                errorBox.innerText = "Please don't insert numbers here";
            }
        }
        lastInput.value = value.join("");
    });
}

if (emailInput) {
    emailInput.addEventListener("input", (event) => {
        const mailRegEx =
            /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const value = event.target.value;
        if (value.match(mailRegEx)) {
            errorBox.innerText = "";
            return;
        }
        errorBox.innerText = "Please insert a valid email";
    });
}
