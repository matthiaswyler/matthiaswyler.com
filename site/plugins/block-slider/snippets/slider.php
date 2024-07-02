<?php

if (!$block->media()->isNotEmpty()) {
  return;
}

static $sliderCounter = 0;
$sliderCounter++;
$sliderId = 'splide' . str_pad($sliderCounter, 2, '0', STR_PAD_LEFT);

?>

<div class="splide" id="<?= $sliderId ?>" data-slider="<?= $sliderId ?>" aria-label="Slider with images">
  <div class="left-zone" data-slider="<?= $sliderId ?>"></div>
  <div class="right-zone" data-slider="<?= $sliderId ?>"></div>
  <div class="splide__track">
    <ul class="splide__list">
      <?php foreach ($block->media()->toFiles() as $mediaFile) : ?>
        <?php if ($mediaFile->type() === 'image') : ?>
          <?php if ($mediaFile->extension() === 'gif') : ?>
            <li class="splide__slide" style="--aspect-ratio: <?= $mediaFile->width() . '/' . $mediaFile->height() ?>">
              <img class="lazyload" src="<?= $mediaFile->url() ?>" alt="<?= $mediaFile->alt() ?>" loading="lazy">
              <?php if ($mediaFile->caption()->isNotEmpty()) : ?>
                <div class="caption">
                  <?= $mediaFile->caption() ?>
                </div>
              <?php endif ?>
            </li>
          <?php else : ?>
            <li class="splide__slide" style="--aspect-ratio: <?= $mediaFile->width() . '/' . $mediaFile->height() ?>">
              <picture>
                <?php foreach (['webp', 'jpg'] as $format) : ?>
                  <?php
                  $srcset = [
                    '300w'  => $mediaFile->thumb(['width' => 300, 'format' => $format])->url() . ' 300w',
                    '600w'  => $mediaFile->thumb(['width' => 600, 'format' => $format])->url() . ' 600w',
                    '900w'  => $mediaFile->thumb(['width' => 900, 'format' => $format])->url() . ' 900w',
                    '1200w' => $mediaFile->thumb(['width' => 1200, 'format' => $format])->url() . ' 1200w',
                    '1800w' => $mediaFile->thumb(['width' => 1800, 'format' => $format])->url() . ' 1800w'
                  ];
                  ?>
                  <?php if ($format != 'jpg') : ?>
                    <source srcset="<?= implode(', ', $srcset) ?>" type="image/<?= $format ?>">
                  <?php else : ?>
                    <img class="lazyload" srcset="<?= implode(', ', $srcset) ?>" src="<?= $mediaFile->thumb(['width' => 800, 'format' => 'webp'])->url() ?>" alt="<?= $mediaFile->alt() ?>" loading="lazy">
                  <?php endif; ?>
                <?php endforeach; ?>
              </picture>
              <?php if ($mediaFile->caption()->isNotEmpty()) : ?>
                <div class="caption">
                  <?= $mediaFile->caption() ?>
                </div>
              <?php endif ?>
            </li>
          <?php endif; ?>
        <?php elseif ($mediaFile->type() === 'video') : ?>
          <li class="splide__slide">
            <div class="splide__slide__container">
              <video class="video" loop autobuffer autoplay muted playsinline>
                <source src="<?= $mediaFile->url() ?>" type="video/mp4">
              </video>
            </div>
            <div class="caption">
              <?= $mediaFile->caption() ?>
            </div>
          </li>
        <?php endif; ?>
      <?php endforeach; ?>
    </ul>
  </div>
  <div class="slide-counter" data-slider="<?= $sliderId ?>"></div>
</div>