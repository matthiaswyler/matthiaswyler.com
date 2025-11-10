// Use SVG files instead of data URIs for CSP compatibility (especially Tor Browser)
const cursorOffsetX = 15; // width / 2
const cursorOffsetY = 15; // height / 2

// Use relative path for assets (works with any base URL)
const createCursor = (filename, offsetX = 0, offsetY = 0) => {
	const url = `/assets/files/${filename}`;
	const x = cursorOffsetX + offsetX;
	const y = cursorOffsetY + offsetY;
	return `url("${url}") ${x} ${y}, pointer`;
};

const leftCursor = createCursor("cursor-left.svg");
const rightCursor = createCursor("cursor-right.svg");

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

		// Hide navigation zones if there's only one slide
		const hideNavigationIfSingleSlide = () => {
			if (splide.length <= 1) {
				if (leftZone) leftZone.style.display = "none";
				if (rightZone) rightZone.style.display = "none";
			} else {
				if (leftZone) leftZone.style.display = "";
				if (rightZone) rightZone.style.display = "";
			}
		};

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

		// Check navigation visibility on mount and when slides change
		splide.on("mounted", hideNavigationIfSingleSlide);
		splide.on("updated", hideNavigationIfSingleSlide);

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
