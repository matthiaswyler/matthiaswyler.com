<?php

  if (isset($block)) {
    $height = $block->height();
  }

?>
<?php if ($height->isNotEmpty()): ?>
<?php if (isset($productSlider)): ?>.product #slider<?php else: ?><?php if (isset($heroBlocks)): ?>.hero <?php endif ?>.block-<?php if (isset($numRow) && isset($numColumn)): ?><?= $numRow ?>-<?= $numColumn ?>-<?php endif ?><?= $numBlock ?><?php endif ?> .carousel-media {
  height: <?= $height ?>px;
}
<?php if ($height->value() >= 600): ?>
@media only screen and (max-width: 767px) {
  <?php if (isset($productSlider)): ?>.product #slider<?php else: ?><?php if (isset($heroBlocks)): ?>.hero <?php endif ?>.block-<?php if (isset($numRow) && isset($numColumn)): ?><?= $numRow ?>-<?= $numColumn ?>-<?php endif ?><?= $numBlock ?><?php endif ?> .carousel-media {
    height: <?= commaToDot($height->value()/2) ?>px;
  }
}
<?php endif ?>
<?php endif ?>