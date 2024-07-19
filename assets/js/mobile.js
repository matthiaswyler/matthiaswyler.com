document.addEventListener("DOMContentLoaded", function () {
	const infoButton = document.querySelector(".info");
	const buttonText = infoButton.querySelector("p");
	const lifeSection = document.querySelector(".life");
	const projectsSection = document.querySelector(".projects");

	const path = window.location.pathname;
	const isLinksOrBooks =
		path.includes("links") ||
		path.includes("books") ||
		path.includes("newsletters") ||
		path.includes("manifesto-library");

	if (isLinksOrBooks) {
		lifeSection.classList.add("show");
		buttonText.textContent = "Close";
		projectsSection.classList.remove("show");
	} else {
		projectsSection.classList.add("show");
	}

	infoButton.addEventListener("click", function () {
		lifeSection.classList.toggle("show");
		projectsSection.classList.toggle("show");
		buttonText.textContent = lifeSection.classList.contains("show")
			? "Close"
			: "Info";
	});
});
