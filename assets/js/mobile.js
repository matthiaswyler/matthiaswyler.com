document.addEventListener("DOMContentLoaded", function () {
	const infoButton = document.querySelector(".info");
	const buttonText = infoButton.querySelector("p");
	const lifeSection = document.querySelector(".life");
	const projectsSection = document.querySelector(".projects");

	const path = window.location.pathname;
	const isHomePage = path === "/" || path === "/home";
	const isLinksOrBooks =
		path.includes("links") ||
		path.includes("books") ||
		path.includes("newsletters") ||
		path.includes("manifesto-library");

	if (isHomePage) {
		projectsSection.classList.add("show");
	} else {
		lifeSection.classList.add("show");
		buttonText.textContent = "Close";
		projectsSection.classList.remove("show");
	}

	infoButton.addEventListener("click", function () {
		lifeSection.classList.toggle("show");
		projectsSection.classList.toggle("show");
		buttonText.textContent = lifeSection.classList.contains("show")
			? "Close"
			: "Info";
	});
});
