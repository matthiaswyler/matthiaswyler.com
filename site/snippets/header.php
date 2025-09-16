<header class="columns">

  <div class="flex" style="--span: 8;">
    <a href="<?= $site->url() ?>">
      <?php if ($image = asset('/assets/files/bose.svg')) : ?>
        <img class="logo" src="<?= $image->url() ?>" alt="Matthias Wyler – Visual Practices">
      <?php endif ?>
    </a>
    <div class="text logo-text">
      Studio Matthias Wyler
    </div>
  </div>

  <div class="text" style="--span: 1;">
    <a href="https://sugus.press">sugus.press</a>
  </div>
  <div class="text" style="--span: 1;">
    <a href="https://oeff.space">öff.space</a>
  </div>
  <!-- <div class="text" style="--span: 1;">
    <a href="mailto:mail@matthiaswyler.com">email</a>
  </div> -->

  <a class="info">
    <p>Info</p>
  </a>
</header>