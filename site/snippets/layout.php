<!--

  Made by Matthias Wyler.
  Say hello ~ matthiaswyler.com

-->
<!doctype html>
<html lang="en" prefix="og: <?= $page->url() ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">

    <?php snippet('seo/head'); ?>

    <link rel="preload" href="<?= url('/assets/css/index.css') ?>" as="style" fetchpriority="high">
    <link rel="preload" href="<?= url('/assets/js/mobile.js') ?>" as="script" fetchpriority="high">
    <link rel="preload" href="<?= url('/assets/js/splide.min.js') ?>" as="script" fetchpriority="high">
    <link rel="preload" href="<?= url('/assets/js/sliders.js') ?>" as="script" fetchpriority="high">


    <link rel="shortcut icon" type="image/x-icon" href="<?= url('/assets/files/favicon.ico') ?>">
    <link rel="icon" type="image/png" href="<?= url('/assets/files/favicon.png') ?>">
    <link rel="mask-icon" href="<?= url('/assets/files/safari-mask-icon.svg') ?>" color="#000">

    <?= css(['assets/css/index.css']) ?>

    <?php snippet('plausible'); ?>
</head>

<body data-url="/<?= $page->uri() ?>">
    <?php snippet('header') ?>
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
]) ?>

<?php snippet('seo/schemas'); ?>

</html>