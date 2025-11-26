<?php
// Fetch all unique tags from listed projects
$projects = page('projects')->children()->listed();
$allTags = [];

foreach ($projects as $project) {
	$projectTags = $project->tags()->split();
	if (!empty($projectTags)) {
		$allTags = array_merge($allTags, $projectTags);
	}
}

$allTags = array_unique($allTags);
sort($allTags);
?>

<nav class="sorting" aria-label="Filter projects by tag">
	<button class="sorting-button" data-tag="all" aria-pressed="false" aria-label="Show all projects">
		All
	</button>
	<?php if ($p5Page = page('p5')) : ?>
		<a href="<?= $p5Page->url() ?>" class="sorting-button" aria-label="Go to p5.js sketches">
			p5.js
		</a>
	<?php endif ?>
	<?php foreach ($allTags as $tag) : ?>
		<button class="sorting-button" data-tag="<?= html($tag) ?>" aria-pressed="false" aria-label="Filter projects by <?= html($tag) ?>">
			<?= html($tag) ?>
		</button>
	<?php endforeach ?>
</nav>
<div class="sorting-status sr-only" aria-live="polite" aria-atomic="true" role="status"></div>

<script>
	(function() {
		function initSorting() {
			const sortingButtons = document.querySelectorAll('.sorting-button');
			const projects = document.querySelectorAll('.project');

			if (sortingButtons.length === 0 || projects.length === 0) return;

			const statusElement = document.querySelector('.sorting-status');
			
			// Extract filtering logic into reusable function
			function filterByTag(selectedTag, buttonElement) {
				// Update button states
				sortingButtons.forEach(btn => {
					btn.classList.remove('active');
					btn.setAttribute('aria-pressed', 'false');
				});
				if (buttonElement) {
					buttonElement.classList.add('active');
					buttonElement.setAttribute('aria-pressed', 'true');
				}

				// Filter projects and count visible
				let visibleCount = 0;
				projects.forEach(project => {
					if (selectedTag === 'all') {
						project.style.display = '';
						visibleCount++;
					} else {
						const projectTags = project.getAttribute('data-tags');
						if (projectTags) {
							const tagsArray = projectTags.split(',').map(tag => tag.trim());
							if (tagsArray.includes(selectedTag)) {
								project.style.display = '';
								visibleCount++;
							} else {
								project.style.display = 'none';
							}
						} else {
							project.style.display = 'none';
						}
					}
				});

				// Announce results to screen readers
				if (statusElement) {
					const tagLabel = selectedTag === 'all' ? 'all projects' : `projects tagged "${selectedTag}"`;
					statusElement.textContent = `Showing ${visibleCount} ${tagLabel}`;
				}
			}

			// Set up click handlers
			sortingButtons.forEach(button => {
				// Skip if it's a link (p5.js button)
				if (button.tagName === 'A') return;

				button.addEventListener('click', function() {
					const selectedTag = this.getAttribute('data-tag');
					filterByTag(selectedTag, this);
				});

				// Keyboard support
				button.addEventListener('keydown', function(e) {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						this.click();
					}
				});
			});

			// Randomly select a tag on page load (exclude p5.js link)
			const filterButtons = Array.from(sortingButtons).filter(btn => btn.tagName === 'BUTTON');
			const availableTags = filterButtons.map(btn => btn.getAttribute('data-tag'));
			const randomTag = availableTags[Math.floor(Math.random() * availableTags.length)];
			const randomButton = filterButtons.find(btn => btn.getAttribute('data-tag') === randomTag);
			filterByTag(randomTag, randomButton);
		}

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initSorting);
		} else {
			initSorting();
		}
	})();
</script>

