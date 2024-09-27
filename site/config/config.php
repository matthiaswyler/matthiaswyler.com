<?php
return [
  'debug'  => false,

  'updates' => true,

  'panel' => [
    'menu' => [
      'site',
      'users',
      'system',
      '-',
      'plausible',
    ]
  ],

  'thumbs' => [
    'format' => 'webp',
    'quality' => 80,
    'driver' => 'im',
  ],

  'floriankarsten.plausible' => [
    'sharedLink' => 'https://plausible.io/share/matthiaswyler.com?auth=o2J0pJrPbs4dUNDytHUpQ',
  ],

  'tobimori.seo.canonicalBase' => 'https://matthiaswyler.com',
  'tobimori.seo.robots.indicator' => false,
  'tobimori.seo.robots.pageSettings' => true,
  'tobimori.seo.robots' => [
    'active' => true,
    'content' => [
      '*' => [
        'Allow' => ['/'],
        'Disallow' => ['/kirby', '/panel', '/content']
      ]
    ]
  ],
];
