<?php snippet('layout', slots: true) ?>

<section class="projects" style="--span: 8;">
  <?php snippet('sorting'); ?>
  <div class="sketches-grid">
    <?php foreach ($page->children()->filterBy('intendedTemplate', 'sketch') as $sketch) : ?>
      <?php snippet('sketch', ['sketch' => $sketch]) ?>
    <?php endforeach ?>
  </div>
</section>

<section class="life" style="--span: 4;">
  <div class="text">
    <div class="columns">
      <?php foreach ($page->life()->toLayouts() as $layout) : ?>
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
  </div>
</section>

<?= js('assets/js/p5.js') ?>

<?php endsnippet() ?>