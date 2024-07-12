document.addEventListener("DOMContentLoaded", function () {
	const infoButton = document.querySelector(".info");
	const buttonText = infoButton.querySelector("p");
	const lifeSection = document.querySelector(".life");
	const projectsSection = document.querySelector(".projects");

	// Check if the current page is "links" or "books"
	const path = window.location.pathname;
	const isLinksOrBooks = path.includes("links") || path.includes("books");

	if (isLinksOrBooks) {
		// Initially show the .life section on "links" and "books" pages
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
