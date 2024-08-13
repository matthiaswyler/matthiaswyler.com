<!--

  Made by Matthias Wyler.
  Say hello ~ matthiaswyler.com

-->
<!doctype html>
<html lang="en" prefix="og: <?= $page->url() ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <?php snippet('seo/head'); ?>

    <link rel="preload" href="<?= url('/assets/css/index.css') ?>" as="style">

    <link rel="shortcut icon" type="image/x-icon" href="<?= url('/assets/files/favicon.ico') ?>">
    <link rel="icon" type="image/png" href="<?= url('/assets/files/favicon.png') ?>">
    <link rel="icon" type="image/svg+xml" href="<?= url('/assets/files/favicon.svg') ?>">
    <link rel="mask-icon" href="<?= url('/assets/files/safari-mask-icon.svg') ?>" color="#000">

    <?= css(['assets/css/index.css']) ?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>

    <?php snippet('plausible'); ?>
</head>

<body>
    <?php snippet('header') ?>
    <!-- <div id="canvas-container"></div> -->
    <main>
        <div class="home columns">
            <?= $slot ?>
        </div>
    </main>
</body>

<?= js([
    'assets/js/mobile.js',
    'assets/js/splide.min.js',
    'assets/js/sliders.js',
    'assets/js/woodlog.js',
]) ?>

<?php snippet('seo/schemas'); ?>

</html>