<?php if ($slider = page('show')->children()->listed()->first()) : ?>
  <section class="splide fixed">
    <div class="splide__track">
      <ul class="splide__list">
        <?php foreach ($slider->files()->sortBy('sort') as $file) : ?>
          <?php if ($file->type() == 'image') : ?>
            <li class="splide__slide">
              <div class="splide__slide__container">
                <img src="<?= $file->url() ?>" data-splide-lazy="<?= $file->url() ?>" alt="<?= $file->alt() ?>">
              </div>
              <div class="caption">
                <?= $file->caption()->kt() ?>
            </li>
          <?php elseif ($file->type() == 'video') : ?>
            <li class="splide__slide">
              <div class="splide__slide__container">
                <video class="video" loop autobuffer autoplay muted playsinline>
                  <source src="<?= $file->url() ?>" type="video/mp4">
                </video>
              </div>
              <div class="caption">
                <?= $file->caption()->kt() ?>
            </li>
          <?php endif ?>
        <?php endforeach ?>
      </ul>
    </div>
  </section>
<?php endif ?>