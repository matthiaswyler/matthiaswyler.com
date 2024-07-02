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
			let newFontSize = maxFontSize * (parentWidth / width);
			if (newFontSize < 1) newFontSize = 1;
			godText.style.fontSize = newFontSize + "vh";
		}

		console.log("New font size:", godText.style.fontSize);
	}

	function tryLoadImage() {
		let str = godText.textContent
			.replace(/\u00a0/g, "_")
			.replace("Ä", "AE")
			.replace("Ö", "OE")
			.replace("Ü", "UE")
			.substring(5);
		godText.style.color = str;
		const url = encodeURI("/assets/files/iam/" + str + ".png");

		fetch(url, { cache: "reload" })
			.then((response) => {
				if (response.ok) {
					imageElement.style.backgroundImage = `url("${url}")`;
					imageElement.style.display = "block";
				} else {
					imageElement.style.backgroundImage = "";
					imageElement.style.display = "block";
				}
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
		godTextInput.addEventListener("keyup", function () {
			let textValue = this.value.toUpperCase().replace(/ /g, "&nbsp;");
			godText.innerHTML =
				"<span class='small-start'>I&nbsp;AM&nbsp;</span>" + textValue;
			resizeText();
			tryLoadImage();
		});

		godForm.onsubmit = function () {
			return false;
		};
	} else {
		document.addEventListener("keydown", function (e) {
			if (e.keyCode === 8) {
				let str = godText.textContent
					.substring(0, godText.textContent.length - 1)
					.replace(/ /g, "\u00a0");
				if (str.length > 4) {
					godText.innerHTML = str;
				}
				resizeText();
				tryLoadImage();
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

			let char = String.fromCharCode(e.which).toUpperCase();
			if (char === " ") char = "&nbsp;";
			godText.innerHTML += char;
			resizeText();
			tryLoadImage();
		});

		window.addEventListener("resize", resizeText);

		resizeText();
	}
});
