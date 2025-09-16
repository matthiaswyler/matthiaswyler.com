document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("trail");
	if (!canvas) {
		console.error("Cursor trail canvas not found.");
		return;
	}

	// Only initialize trail on home page and books page
	if (window.location.pathname !== "/" && window.location.pathname !== "/books") {
		canvas.style.display = "none";
		return;
	}

	const ctx = canvas.getContext("2d");
	let lastEvent = null;
	let currentEvent = null;
	let distanceDrawn = 0;

	// Configuration matching Gus Miller's approach
	const options = {
		color: function() {
			return `hsl(${distanceDrawn / 100 % 360}, 100%, 50%)`;
		},
		splatterThreshold: 1.5,
		maxBrushWidth: 3,
		blotchiness: 15
	};

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.lineJoin = "round";
		ctx.lineCap = "butt";
		lastEvent = null;
		currentEvent = null;
		distanceDrawn = 0;
	}

	function scale() {
		return window.hasOwnProperty("devicePixelRatio") ? window.devicePixelRatio : 1;
	}

	function delta(from, to) {
		if (!from) from = previous();
		if (!to) to = currentEvent;
		return Math.sqrt(Math.pow(to.y - from.y, 2) + Math.pow(to.x - from.x, 2));
	}

	function timeElapsed() {
		return currentEvent.time - previous().time;
	}

	function velocity() {
		return delta(currentEvent, previous()) / timeElapsed();
	}

	function trajectory() {
		return {
			x: currentEvent.x + 2 * (currentEvent.x - previous().x),
			y: currentEvent.y + 2 * (currentEvent.y - previous().y)
		};
	}

	function strokeWidth() {
		return options.maxBrushWidth / Math.sqrt(velocity());
	}

	function previous() {
		return lastEvent || {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			time: new Date()
		};
	}

	function draw() {
		distanceDrawn += delta();
		ctx.beginPath();
		line(previous(), currentEvent, strokeWidth());
		
		if (velocity() > options.splatterThreshold) {
			splatter();
		} else if (velocity() < 0.1 && Math.random() > 0.95) {
			// Create small stationary circles when cursor is barely moving
			stationaryCircle();
		}
	}

	function track(e) {
		const event = {
			x: e.pageX,
			y: e.pageY,
			time: e.timeStamp
		};

		if (!lastEvent) {
			lastEvent = currentEvent = event;
		} else {
			lastEvent = currentEvent;
			currentEvent = event;
		}
	}

	function colorize() {
		ctx.strokeStyle = options.color();
		ctx.fillStyle = options.color();
	}

	function line(from, to, width) {
		colorize();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.closePath();
		ctx.lineWidth = width;
		ctx.stroke();
	}

	function splatter() {
		if (Math.random() > 0.5) {
			const traj = trajectory();
			const size = Math.pow(velocity(), Math.random()) * 0.02;
			spot(traj, size);
		}
	}

	function spot(pos, size) {
		colorize();
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
		ctx.fill();
	}

	function stationaryCircle() {
		colorize();
		ctx.beginPath();
		ctx.arc(currentEvent.x, currentEvent.y, 0.5, 0, 2 * Math.PI);
		ctx.fill();
	}

	// Initialize
	resizeCanvas();

	// Event listeners
	window.addEventListener("resize", resizeCanvas);
	document.addEventListener("mousemove", function(e) {
		track(e);
		draw();
	});
});
