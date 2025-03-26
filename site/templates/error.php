<?php snippet('layout', slots: true) ?>

<section class="projects" style="--span: 8;"></section>

<section class="life" style="--span: 4;">
  <div class="text">
    <?= $page->text()->kt() ?>
  </div>
</section>

<?php snippet('polysound') ?>

<?php endsnippet() ?>