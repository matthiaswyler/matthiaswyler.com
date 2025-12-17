<?php snippet('layout', slots: true) ?>

<canvas id="trail"></canvas>


<section class="projects" style="--span: 8;"></section>

<section class="life" style="--span: 4;">
  <div class="text prose">
    <?php if ($latestNote = kirby()->site()->find('notes')->children()->listed()->sortBy('num', 'desc')->first()) : ?>
      <p><?= $latestNote->date()->toDate('d.m.Y H:i') ?></p>
      <?= $latestNote->text()->kt() ?>
    <?php endif ?>
  </div>
</section>


<?= js('assets/js/trail.js') ?>

<?php endsnippet() ?>