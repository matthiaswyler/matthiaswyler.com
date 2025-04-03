document.addEventListener("DOMContentLoaded", function () {
	const godTextInput = document.getElementById("godTextInput");
	const godText = document.getElementById("godText");
	const godForm = document.getElementById("godForm");
	const imageElement = document.getElementById("image");
	const parent = document.querySelector(".projects");
	const maxFontSize = 30; // vh

	function resizeText() {
		godText.style.fontSize = maxFontSize + "vh";
		const width = godText.scrollWidth;
		const parentWidth = parent.offsetWidth;

		if (width > parentWidth) {
			const newFontSize = Math.max(1, maxFontSize * (parentWidth / width));
			godText.style.fontSize = newFontSize + "vh";
		}
	}

	function tryLoadImage() {
		const str = godText.textContent
			.replace(/\u00a0/g, "_")
			.replace(/[ÄÖÜ]/g, (m) => ({ Ä: "AE", Ö: "OE", Ü: "UE" }[m]))
			.substring(5);

		godText.style.color = str;
		const url = encodeURI("/assets/files/iam/" + str + ".png");

		fetch(url, { cache: "reload" })
			.then((response) => {
				imageElement.style.backgroundImage = response.ok ? `url("${url}")` : "";
				imageElement.style.display = "block";
				resizeText();
			})
			.catch(() => {
				imageElement.style.backgroundImage = "";
				imageElement.style.display = "block";
				resizeText();
			});
	}

	function isMobile() {
		return window.getComputedStyle(godForm).display === "block";
	}

	if (isMobile()) {
		document.addEventListener("touchstart", () => godTextInput.focus(), false);

		godTextInput.addEventListener("input", function () {
			const textValue = this.value.toUpperCase().replace(/ /g, "&nbsp;");
			godText.innerHTML = "I&nbsp;AM&nbsp;" + textValue;
			resizeText();
			tryLoadImage();
		});

		godForm.onsubmit = () => false;

		godTextInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") e.preventDefault();
		});
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
