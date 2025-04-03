document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("trail");
	if (!canvas) {
		console.error("Cursor trail canvas not found.");
		return;
	}
	const ctx = canvas.getContext("2d");
	let lastX = null;
	let lastY = null;
	let isDrawing = false;

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		isDrawing = false;
		lastX = null;
		lastY = null;
	}

	function draw(e) {
		if (!isDrawing) {
			lastX = e.clientX;
			lastY = e.clientY;
			isDrawing = true;
			return;
		}

		if (lastX !== null && lastY !== null) {
			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();
		}
		lastX = e.clientX;
		lastY = e.clientY;
	}
	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);
	document.addEventListener("mousemove", draw);
});
