(function () {
    var canvas = document.getElementById("signature");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 4;

    var drawing = false;
    var mousePos = {
        x: 0,
        y: 0,
    };
    var lastPos = mousePos;

    canvas.addEventListener(
        "mousedown",
        function (e) {
            drawing = true;
            lastPos = getMousePos(canvas, e);
        },
        false
    );

    canvas.addEventListener(
        "mouseup",
        function (e) {
            drawing = false;
        },
        false
    );

    canvas.addEventListener(
        "mousemove",
        function (e) {
            mousePos = getMousePos(canvas, e);
        },
        false
    );
});
