<?php snippet('layout', slots: true) ?>

<?php

$manifests = $page->library()->files()->toFiles();

?>

<section class="projects" style="--span: 8;">
  <?php snippet('iam') ?>
</section>
<section class="life" style="--span: 4;">
  <div class="text">
    <ul>
      <?php foreach ($manifests as $file) : ?>
        <li>
          <a href="<?= $file->url() ?>" target="_blank">
            <p class="link manifesto"><?= $file->title()->or($file->filename()) ?></p>
          </a>
        </li>
      <?php endforeach ?>
    </ul>
  </div>
</section>

<?php endsnippet() ?>