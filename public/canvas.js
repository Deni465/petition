const canvas = document.querySelector("canvas");
const form = document.querySelector("form");
const ctx = canvas.getContext("2d");
const hiddenInput = document.getElementById("hiddenInput");

let drawing = false;

const handlePointerDown = (event) => {
    drawing = true;
    ctx.beginPath();
    const [positionX, positionY] = getCursorPosition(event);
    ctx.moveTo(positionX, positionY);
};

const handlePointerUp = () => {
    drawing = false;
    hiddenInput.value = canvas.toDataURL();
};

const handlePointerMove = (event) => {
    if (!drawing) return;
    const [positionX, positionY] = getCursorPosition(event);
    ctx.lineTo(positionX, positionY);
    ctx.stroke();
};

const getCursorPosition = (event) => {
    positionX = event.clientX - event.target.getBoundingClientRect().x;
    positionY = event.clientY - event.target.getBoundingClientRect().y;
    return [positionX, positionY];
};
canvas.addEventListener("mousedown", handlePointerDown, { passive: true });
canvas.addEventListener("mouseup", handlePointerUp, { passive: true });
canvas.addEventListener("mousemove", handlePointerMove, { passive: true });

// ctx.lineWidth = 2;
// ctx.lineJoin = ctx.lineCap = "round";

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const imageURL = canvas.toDataURL();
    const image = document.createElement("img");
    image.src = imageURL;
    image.height = canvas.height;
    image.width = canvas.width;
});
