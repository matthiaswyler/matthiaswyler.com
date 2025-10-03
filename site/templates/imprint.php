<?php snippet('layout', slots: true) ?>

<section class="projects" style="--span: 8;">

</section>
<section class="life" style="--span: 4;">
  <div class="columns text">
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
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.js" defer></script>
<script src="<?= url('assets/js/flock.js') ?>" defer></script>

<?php endsnippet() ?>