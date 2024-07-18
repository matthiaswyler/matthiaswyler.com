<?php snippet('layout', slots: true) ?>

<section class="projects" style="--span: 8;">

</section>
<section class="life" style="--span: 4;">
  <div class="columns">
    <?php foreach ($page->matter()->toLayouts() as $layout) : ?>
      <?php foreach ($layout->columns() as $column) : ?>
        <div class="column" style="--span:<?= $column->span() ?>">
          <?php foreach ($column->blocks() as $block) : ?>
            <div class="block <?= $block->type() ?>">
              <?= $block ?>
            </div>
          <?php endforeach ?>
        </div>
      <?php endforeach ?>
    <?php endforeach ?>
  </div>

  <?php snippet('footer') ?>
</section>

<?php snippet('polysound') ?>

<?php endsnippet() ?>