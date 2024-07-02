<?php

Kirby::plugin('wym/block-slider', [
  'blueprints' => [
    'blocks/slider' => __DIR__ . '/blueprints/slider.yml'
  ],
  'snippets' => [
    'blocks/slider' => __DIR__ . '/snippets/slider.php',
    'blocks-style/slider-style' => __DIR__ . '/snippets/blocks-style/slider-style.php'
  ]
]);
