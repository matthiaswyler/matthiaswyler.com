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

    <?php snippet('plausible'); ?>
</head>

<body>
    <?php snippet('header') ?>

    <main>
        <div class="home columns">
            <?= $slot ?>
        </div>
    </main>

    <?php snippet('footer') ?>
</body>

<?= js([
    'assets/js/mobile.js',
    'assets/js/splide.min.js',
    'assets/js/sliders.js',
]) ?>

<?php snippet('seo/schemas'); ?>

</html>