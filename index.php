<?php

// Load Kirby's autoloader first
require 'kirby/vendor/autoload.php';

// Then load the bootstrap
require 'kirby/bootstrap.php';

echo (new Kirby)->render();
