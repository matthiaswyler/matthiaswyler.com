<?php snippet('layout', slots: true) ?>

<canvas id="trail"></canvas>

<section class="projects" style="--span: 8;"></section>

<section class="life" style="--span: 4;">
  <div class="text">
    <?= $page->text()->kt() ?>
  </div>
</section>

<?php endsnippet() ?>