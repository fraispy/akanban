<?php
$debug = true;
ini_set('display_errors', $debug);
date_default_timezone_set('Asia/Shanghai');

$loader = require __DIR__.'/../vendor/autoload.php';
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\MonologServiceProvider;

$app = new Silex\Application();
$app['debug'] = $debug;


// local only (need file system write permission)
$app->register(new MonologServiceProvider(), array(
    'monolog.logfile'       => __DIR__.'/../temp/applog.log',
    'monolog.name'          => 'kanban',
    'monolog.level'         => 100 //Logger::DEBUG
));

$app->register(new UrlGeneratorServiceProvider());

// $app->register(new SecurityServiceProvider());
// $app['security.firewalls'] = array(
// 	'login' => array(
// 		'pattern' => '^/$',
// 	       'anonymous' => true,
// 	),
// 	'main' => array(
// 		'pattern' => '^.*$',
// 		'form' => array('login_path' => '/', 'check_path' => '/admin/login_check'),
// 		'users' => array(
// 			'admin' => array('ROLE_ADMIN','5FZ2Z8QIkA7UTZ4BYkoC+GsReLf569mSKDsfods6LYQ8t+a8EW9oaircfMpmaLbPBh4FOBiiFyLfuZmTSUwzZg=='),
// 		),
// 	),
// );


// // sae memcache
// $app['mmc'] = $app->share(function() {
// 	$mmc = memcache_init();
// 	if( $mmc == false ) {
// 	    throw new Exception('Memcache init error!');
// 	}
// 	return $mmc;
// });


// KVDB
$app['kvdb'] = $app->share(function () {
    $kv = new SaeKV();
    if( $kv->init() == false ) {
        throw new Exception('kvdb init error!');
    }
    return $kv;    
});

// SAE Counter
$app['sae_counter'] = $app->share(function () use ($app) {
	$c = new SaeCounter();
	return $c;
});

// // this should use twig4sae hack
// $app->register(new TwigServiceProvider(), array(
//     'twig.options' => array('cache' => false, 'strict_variables' => true),   	// 	'cache' => new Twig_Cache_SAE($mmc)
//     'twig.path'    => array(__DIR__ . '/views', ),
// ));

return $app;
