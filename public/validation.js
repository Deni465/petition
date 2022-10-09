const homepageInput = document.getElementById("homePage");
const cityInput = document.getElementById("city");
const errorBox = document.getElementById("error-box");

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
