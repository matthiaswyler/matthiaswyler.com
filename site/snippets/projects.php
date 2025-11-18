<?php foreach (page('projects')->children()->listed() as $project) : ?>
  <div class="project columns" data-tags="<?= html($project->tags()->isNotEmpty() ? implode(',', $project->tags()->split()) : '') ?>">
    <?php foreach ($project->matter()->toLayouts() as $layout) : ?>
      <?php foreach ($layout->columns() as $column) : ?>
        <div class="<?= $layout->attrs()->class() ?> column" style="--span:<?= $column->span() ?>">
          <?php foreach ($column->blocks() as $block) : ?>
            <div class="block <?= $block->type() ?>">
              <?= $block ?>
            </div>
          <?php endforeach ?>
        </div>
      <?php endforeach ?>
    <?php endforeach ?>
  </div>
<?php endforeach ?>


<script>
  document.querySelectorAll('.project').forEach(project => {
    if (project.querySelector('.studio')) {
      project.classList.add('mb-2');
    } else if (!project.querySelector('.website')) {
      project.classList.add('mb-24');
    }
  });
</script>