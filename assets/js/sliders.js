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

	if (!splides.length) return;

	// Shared options for all sliders
	const splideDefaultOptions = {
		type: "loop",
		autoplay: false,
		lazyLoad: "nearby",
		keyboard: true,
		arrows: false,
		pagination: false,
		// Accessibility improvements
		a11y: {
			container: "carousel",
			prev: "Previous slide",
			next: "Next slide",
			pagination: "Select a slide to show",
			slide: "slide",
			slideLabel: "Slide %s of %s",
		},
		// Performance improvements
		preloadPages: 1,
		updateOnMove: true,
		throttle: 100, // Throttle resize events
		waitForTransition: true,
		// Touch/swipe improvements
		dragMinThreshold: {
			mouse: 5,
			touch: 25,
		},
		flickMaxPages: 1,
		flickPower: 500,
	};

	splides.forEach((splideElement) => {
		const sliderId = splideElement.getAttribute("data-slider");
		const splide = new Splide(splideElement, splideDefaultOptions);

		// Performance: Destroy slider if it becomes hidden
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting && splide.state.is(Splide.STATES.MOUNTED)) {
					splide.destroy();
				} else if (
					entry.isIntersecting &&
					splide.state.is(Splide.STATES.DESTROYED)
				) {
					splide.mount();
				}
			});
		});
		observer.observe(splideElement);

		// Accessibility: Add keyboard navigation
		splide.on("mounted", () => {
			const slides = splideElement.querySelectorAll(".splide__slide");
			slides.forEach((slide, index) => {
				slide.setAttribute("role", "group");
				slide.setAttribute("aria-roledescription", "slide");
				slide.setAttribute(
					"aria-label",
					`Slide ${index + 1} of ${slides.length}`
				);
			});
		});

		// Click zones with improved touch handling
		const leftZone = splideElement.querySelector(
			`.left-zone[data-slider="${sliderId}"]`
		);
		const rightZone = splideElement.querySelector(
			`.right-zone[data-slider="${sliderId}"]`
		);

		if (leftZone) {
			leftZone.addEventListener("click", (e) => {
				if (e.pointerType === "touch") return; // Prevent double triggers on touch
				splide.go("<");
			});
		}

		if (rightZone) {
			rightZone.addEventListener("click", (e) => {
				if (e.pointerType === "touch") return;
				splide.go(">");
			});
		}

		// Performance: Optimized counter updates
		const slideCounter = splideElement.querySelector(
			`.slide-counter[data-slider="${sliderId}"]`
		);
		if (slideCounter) {
			let lastIndex = -1;
			const updateCounter = () => {
				const newIndex = splide.index;
				if (lastIndex !== newIndex) {
					slideCounter.textContent = `${newIndex + 1} / ${splide.length}`;
					lastIndex = newIndex;
				}
			};

			// Show counter only if there are multiple slides
			const showCounter = () => {
				if (splide.length > 1) {
					slideCounter.classList.add("show");
				} else {
					slideCounter.classList.remove("show");
				}
			};

			splide.on("mounted move", updateCounter);
			splide.on("mounted", showCounter);
		}

		splide.mount();
	});
});
