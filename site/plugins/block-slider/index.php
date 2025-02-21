<?php

Kirby::plugin('matthiaswyler/block-slider', [
  'blueprints' => [
    'blocks/slider' => __DIR__ . '/blueprints/slider.yml'
  ],
  'snippets' => [
    'blocks/slider' => __DIR__ . '/snippets/slider.php'
  ]
]);
