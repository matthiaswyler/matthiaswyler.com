<?php

use Kirby\Toolkit\Str;
use Kirby\Toolkit\Html;

/** @var \Kirby\Cms\Block $block */
$alt     = $block->alt();
$caption = $block->caption();
$crop    = $block->crop()->isTrue();
$link    = $block->link();
$ratio   = $block->ratio()->or('auto');
$src     = null;

if ($block->location() == 'web') {
  $src = $block->src()->esc();
} elseif ($image = $block->image()->toFile()) {
  $alt = $alt->or($image->alt());
  $src = $image->url();
}

?>
<?php if ($src): ?>
  <figure <?= Html::attr(['data-ratio' => $ratio, 'data-crop' => $crop]) ?>>
    <?php if ($link->isNotEmpty()): ?>
      <a href="<?= Str::esc($link->toUrl()) ?>">
      <?php endif ?>

      <?php if ($image): ?>
        <?php if ($image->extension() === 'gif' || $image->extension() === 'webp'): ?>
          <img src="<?= $src ?>"
            alt="<?= $alt->esc() ?>"
            loading="lazy"
            decoding="async"
            width="<?= $image->width() ?>"
            height="<?= $image->height() ?>"
            <?php if ($crop): ?>style="object-fit: cover" <?php endif ?>>
        <?php else: ?>
          <img src="<?= $src ?>"
            alt="<?= $alt->esc() ?>"
            loading="lazy"
            decoding="async"
            srcset="<?= $image->srcset([
                      '300w'  => ['width' => 300],
                      '600w'  => ['width' => 600],
                      '900w'  => ['width' => 900],
                      '1200w' => ['width' => 1200],
                      '1600w' => ['width' => 1600]
                    ]) ?>"
            sizes="(min-width: 1200px) 1200px, 100vw"
            width="<?= $image->width() ?>"
            height="<?= $image->height() ?>"
            <?php if ($crop): ?>style="object-fit: cover" <?php endif ?>>
        <?php endif ?>
      <?php else: ?>
        <img src="<?= $src ?>"
          alt="<?= $alt->esc() ?>"
          loading="lazy"
          decoding="async">
      <?php endif ?>

      <?php if ($link->isNotEmpty()): ?>
      </a>
    <?php endif ?>

    <?php if ($caption->isNotEmpty()): ?>
      <figcaption>
        <?= $caption ?>
      </figcaption>
    <?php endif ?>
  </figure>
<?php endif ?>