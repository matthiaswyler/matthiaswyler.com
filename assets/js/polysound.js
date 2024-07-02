/*
  --- README ---
  
  This polyrhythmic (definition below) spiral effect was inspired by the awesome work of @project_jdm on YouTube.

  I didn't know what polyrhythms were before seeing his content so I had to ask ChatGPT. I then had to ask ChatGPT again, but this time to explain like I'm 5 years old. Here is what it said:

  You know when you're on a swing? Imagine there are two swings side by side. Your friend is swinging three times for every two times you swing. So, sometimes you're at the top together, but other times, you're not. When you're both at the top at the same time, that's like a polyrhythm in music. Two different beats, syncing up at special moments.
  
  Anyways, in the settings object below I have outlined a few different parameters to make it easier to modify some of the core features i.e. start time, total duration, number of cycles, etc.
  
  I didn't know a good way to get instrument sound effects, in particular multiple octaves worth, so I made my own on SoundTrap using the vibraphone. A couple other options are also listed below.
  
  If you want to get your hands dirty you can also take a whack at modifying the code. Just be careful messing with how the notes are played. I almost went deaf a few times lol. And feel free to use this for literally anything.
  
*/

const ASPECT_RATIO = 16 / 9;
const MIN_CANVAS_SIZE = 1920;

const paper = document.getElementById("paper"),
	pen = paper.getContext("2d");

const resizeCanvas = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	let newWidth, newHeight;

	if (width / height > ASPECT_RATIO) {
		newHeight = height;
		newWidth = height * ASPECT_RATIO;
	} else {
		newWidth = width;
		newHeight = width / ASPECT_RATIO;
	}

	newWidth = Math.max(newWidth, MIN_CANVAS_SIZE);
	newHeight = Math.max(newHeight, MIN_CANVAS_SIZE);

	paper.width = newWidth;
	paper.height = newHeight;
	paper.style.width = `${newWidth}px`;
	paper.style.height = `${newHeight}px`;
	paper.style.position = "absolute";
	paper.style.left = `${(width - newWidth) / 2}px`;
	paper.style.top = `${(height - newHeight) / 2}px`;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const get = (selector) => document.querySelector(selector);

const toggles = {
	sound: get("#sound-toggle"),
};

const colors = Array(21).fill("#3e3e3e");

const settings = {
	startTime: Date.now(),
	duration: 900,
	maxCycles: Math.max(colors.length, 100),
	soundEnabled: false,
	pulseEnabled: true,
	instrument: "vibraphone",
};

const handleSoundToggle = (enabled = !settings.soundEnabled) => {
	settings.soundEnabled = enabled;
	toggles.sound.dataset.toggled = enabled;
};

document.onvisibilitychange = () => handleSoundToggle(false);
toggles.sound.onclick = () => handleSoundToggle();

const getFileName = (index) => {
	return settings.instrument === "default"
		? `key-${index}`
		: `${settings.instrument}-key-${index}`;
};

const getUrl = (index) =>
	`https://assets.codepen.io/1468070/${getFileName(index)}.wav`;

const keys = colors.map((_, index) => {
	const audio = new Audio(getUrl(index));
	audio.volume = 0.15;
	return audio;
});

let arcs = [];

const calculateVelocity = (index) => {
	const numberOfCycles = settings.maxCycles - index;
	const distancePerCycle = 2 * Math.PI;
	return (numberOfCycles * distancePerCycle) / settings.duration;
};

const calculateNextImpactTime = (currentImpactTime, velocity) => {
	return currentImpactTime + (Math.PI / velocity) * 1000;
};

const calculateDynamicOpacity = (
	currentTime,
	lastImpactTime,
	baseOpacity,
	maxOpacity,
	duration
) => {
	const timeSinceImpact = currentTime - lastImpactTime;
	const percentage = Math.min(timeSinceImpact / duration, 1);
	const opacityDelta = maxOpacity - baseOpacity;
	return maxOpacity - opacityDelta * percentage;
};

const determineOpacity = (
	currentTime,
	lastImpactTime,
	baseOpacity,
	maxOpacity,
	duration
) => {
	if (!settings.pulseEnabled) return baseOpacity;
	return calculateDynamicOpacity(
		currentTime,
		lastImpactTime,
		baseOpacity,
		maxOpacity,
		duration
	);
};

const calculatePositionOnArc = (center, radius, angle) => ({
	x: center.x + radius * Math.cos(angle),
	y: center.y + radius * Math.sin(angle),
});

const playKey = (index) => keys[index].play();

const init = () => {
	pen.lineCap = "round";

	arcs = colors.map((color, index) => {
		const velocity = calculateVelocity(index);
		const lastImpactTime = 0;
		const nextImpactTime = calculateNextImpactTime(
			settings.startTime,
			velocity
		);

		return {
			color,
			velocity,
			lastImpactTime,
			nextImpactTime,
		};
	});
};

const drawArc = (x, y, radius, start, end, action = "stroke") => {
	pen.beginPath();
	pen.arc(x, y, radius, start, end);
	if (action === "stroke") pen.stroke();
	else pen.fill();
};

const drawPointOnArc = (center, arcRadius, pointRadius, angle) => {
	const position = calculatePositionOnArc(center, arcRadius, angle);
	drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");
};

const draw = () => {
	const width = paper.width;
	const height = paper.height;

	pen.clearRect(0, 0, width, height);

	const currentTime = Date.now();
	const elapsedTime = (currentTime - settings.startTime) / 1000;

	const length = Math.min(width, height) * 0.9;
	const offset = (width - length) / 2;

	const center = {
		x: width / 2,
		y: height / 2,
	};

	const baseLength = length - 2 * offset;
	const initialRadius = baseLength * 0.015;
	const circleRadius = baseLength * 0.0025;
	const clearance = baseLength * 0.03;
	const spacing = (baseLength - initialRadius - clearance) / 2 / colors.length;

	arcs.forEach((arc, index) => {
		const radius = initialRadius + spacing * index;

		pen.globalAlpha = determineOpacity(
			currentTime,
			arc.lastImpactTime,
			0.15,
			0.65,
			1000
		);
		pen.lineWidth = baseLength * 0.0002;
		pen.strokeStyle = arc.color;

		const offsetAngle = (circleRadius * (5 / 3)) / radius;

		drawArc(
			center.x,
			center.y,
			radius,
			Math.PI + offsetAngle,
			2 * Math.PI - offsetAngle
		);
		drawArc(center.x, center.y, radius, offsetAngle, Math.PI - offsetAngle);

		pen.globalAlpha = determineOpacity(
			currentTime,
			arc.lastImpactTime,
			0.15,
			0.85,
			1000
		);
		pen.fillStyle = arc.color;

		drawPointOnArc(center, radius, circleRadius * 0.75, Math.PI);
		drawPointOnArc(center, radius, circleRadius * 0.75, 2 * Math.PI);

		pen.globalAlpha = 1;
		pen.fillStyle = arc.color;

		if (currentTime >= arc.nextImpactTime) {
			if (settings.soundEnabled) {
				playKey(index);
				arc.lastImpactTime = arc.nextImpactTime;
			}
			arc.nextImpactTime = calculateNextImpactTime(
				arc.nextImpactTime,
				arc.velocity
			);
		}

		const distance = elapsedTime >= 0 ? elapsedTime * arc.velocity : 0;
		const angle = (Math.PI + distance) % (2 * Math.PI);

		drawPointOnArc(center, radius, circleRadius, angle);
	});

	requestAnimationFrame(draw);
};

init();
draw();
