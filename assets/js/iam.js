document.addEventListener("DOMContentLoaded", function () {
	const godTextInput = document.getElementById("godTextInput");
	const godText = document.getElementById("godText");
	const godForm = document.getElementById("godForm");
	const imageElement = document.getElementById("image");
	const parent = document.querySelector(".projects");
	const maxFontSize = 20; // vh
	let debounceTimer;

	function resizeText() {
		godText.style.fontSize = maxFontSize + "vh";
		const width = godText.scrollWidth;
		const maxWidth = isMobile()
			? window.innerWidth - parseInt(getComputedStyle(godText).paddingLeft) * 2
			: parent.offsetWidth;

		if (width > maxWidth) {
			const newFontSize = Math.max(1, maxFontSize * (maxWidth / width));
			godText.style.fontSize = newFontSize + "vh";
		}
	}

	function tryLoadImage() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const str = godText.textContent
				.replace(/\u00a0/g, "_")
				.replace(/[ÄÖÜ]/g, (m) => ({ Ä: "AE", Ö: "OE", Ü: "UE" }[m]))
				.substring(5);

			godText.style.color = str;
			const url = encodeURI("/assets/files/iam/" + str + ".png");

			fetch(url, { cache: "reload" })
				.then((response) => {
					imageElement.style.backgroundImage = response.ok
						? `url("${url}")`
						: "";
					imageElement.style.display = "block";
					resizeText();
				})
				.catch((error) => {
					// Only log errors that aren't 404s
					if (
						error.name !== "TypeError" ||
						!error.message.includes("Failed to fetch")
					) {
						console.error("Error loading image:", error);
					}
					imageElement.style.backgroundImage = "";
					imageElement.style.display = "block";
					resizeText();
				});
		}, 150); // Wait 150ms after last keystroke before making the request
	}

	function isMobile() {
		return window.getComputedStyle(godForm).display === "block";
	}

	if (isMobile()) {
		document.addEventListener("touchstart", () => godTextInput.focus(), false);

		// Prevent scrolling on mobile
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";

		godTextInput.addEventListener("input", function () {
			const textValue = this.value.toUpperCase().replace(/ /g, "&nbsp;");
			godText.innerHTML = "I&nbsp;AM&nbsp;" + textValue;
			// Force a reflow to get correct width
			godText.offsetHeight;
			resizeText();
			tryLoadImage();
		});

		godForm.onsubmit = () => false;

		godTextInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") e.preventDefault();
		});

		// Initial resize
		resizeText();
		// Add resize listener for mobile
		window.addEventListener("resize", resizeText);
	} else {
		document.addEventListener("keydown", function (e) {
			if (e.keyCode === 8) {
				const str = godText.textContent
					.substring(0, godText.textContent.length - 1)
					.replace(/ /g, "\u00a0");
				if (str.length > 4) {
					godText.innerHTML = str;
					resizeText();
					tryLoadImage();
				}
				e.preventDefault();
			} else if (e.keyCode === 46) {
				godText.innerHTML = "I&nbsp;AM&nbsp;";
				resizeText();
				tryLoadImage();
			}
		});

		document.addEventListener("keypress", function (e) {
			if (!isMobile()) e.preventDefault();

			if (e.which === 127 || e.which === 8) {
				resizeText();
				return;
			}

			const char = String.fromCharCode(e.which).toUpperCase();
			godText.innerHTML += char === " " ? "&nbsp;" : char;
			resizeText();
			tryLoadImage();
		});

		window.addEventListener("resize", resizeText);
		resizeText();
	}
});
