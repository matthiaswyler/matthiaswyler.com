  <div class="control-wrapper">
    <div class="control-background"></div>
    <div id="control-bar">
    </div>
    <button id="sound-toggle" class="toggle" type="button" data-toggled="false" onClick="handleSoundToggle()" title="Toggle Pulse">
      <i class="off">
        <?php if ($asset = asset('/assets/files/play.svg')) : ?>
          <img src="<?= $asset->url() ?>" alt="Switch the Sound on">
        <?php endif ?>
      </i>
      <i class="on">
        <?php if ($asset = asset('/assets/files/pause.svg')) : ?>
          <img src="<?= $asset->url() ?>" alt="Pause the Sound">
        <?php endif ?>
      </i>
    </button>
  </div>
  </div>

  <canvas id="paper"></canvas>

  <?= js([
    'assets/js/polysound.js',
  ]) ?>