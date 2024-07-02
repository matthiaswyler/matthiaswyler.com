document.addEventListener("DOMContentLoaded", function () {
	const infoButton = document.querySelector(".info");
	const buttonText = infoButton.querySelector("p");
	const lifeSection = document.querySelector(".life");

	infoButton.addEventListener("click", function () {
		lifeSection.classList.toggle("show");
		buttonText.textContent = lifeSection.classList.contains("show")
			? "Close"
			: "Info";
	});
});
