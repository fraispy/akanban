<?php
$app = require __DIR__.'/../src/init.php';
require __DIR__.'/../src/app.php';

// sae_xhprof_start();
$app->run();
// sae_xhprof_end();