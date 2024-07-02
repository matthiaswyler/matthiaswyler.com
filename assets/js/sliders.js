const width = 30;
const height = 30;

const svgs = {
	left: (color) =>
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="${width}" height="${height}"><path d="M29.8 2.7L2.6 30l27.2 27.3M57.4 30H3.8" fill="none" stroke='${encodeURIComponent(
			color
		)}' stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
	right: (color) =>
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="${width}" height="${height}"><path d="M30.2 57.3L57.4 30 30.2 2.7M2.6 30h53.6" fill="none" stroke='${encodeURIComponent(
			color
		)}' stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const escape = (svg) =>
	svg.replace(/</g, "%3c").replace(/>/g, "%3e").replace(/"/g, "'");

const cache = {};

const createCursor = (direction, color, offsetX = 0, offsetY = 0) => {
	if (!(direction in svgs)) {
		console.warn("Found no cursor svg for direction:", direction);
		return "";
	}

	const key = [direction, color, offsetX, offsetY].join("-");

	if (!cache[key]) {
		const svg = escape(svgs[direction](color));
		const x = width / 2 + offsetX;
		const y = height / 2 + offsetY;
		const url = `url("data:image/svg+xml,${svg}")`;
		cache[key] = `${url} ${x} ${y}, pointer`;
	}

	return cache[key];
};

const leftCursor = createCursor("left", "#ff0");
const rightCursor = createCursor("right", "#ff0");

document.documentElement.style.setProperty("--left-cursor", leftCursor);
document.documentElement.style.setProperty("--right-cursor", rightCursor);

document.addEventListener("DOMContentLoaded", function () {
	const splides = document.querySelectorAll(".splide");

	if (splides.length) {
		splides.forEach((splideElement) => {
			const splideDefaultOptions = {
				type: "loop",
				autoplay: false,
				lazyLoad: "nearby",
				keyboard: true,
				arrows: false,
				pagination: false,
			};

			const splide = new Splide(splideElement, splideDefaultOptions);
			splide.mount();

			const sliderId = splideElement.getAttribute("data-slider");
			const leftZone = splideElement.querySelector(
				`.left-zone[data-slider="${sliderId}"]`
			);
			const rightZone = splideElement.querySelector(
				`.right-zone[data-slider="${sliderId}"]`
			);

			if (leftZone) {
				leftZone.addEventListener("click", () => {
					splide.go("<");
				});
			}

			if (rightZone) {
				rightZone.addEventListener("click", () => {
					splide.go(">");
				});
			}

			const slideCounter = splideElement.querySelector(
				`.slide-counter[data-slider="${sliderId}"]`
			);
			if (slideCounter) {
				const updateCounter = () => {
					slideCounter.textContent = `${splide.index + 1} / ${splide.length}`;
				};

				splide.on("mounted move", updateCounter);
				updateCounter();
			}
		});
	}
});
