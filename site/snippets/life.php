<div class="columns">
  <?php foreach (page('life')->matter()->toLayouts() as $layout) : ?>
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