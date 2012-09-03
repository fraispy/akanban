<?php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Reponse;


$app->before(function (Request $request) use ($app) {
	if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
		$data = json_decode($request->getContent(), true);
		$request->request->replace(is_array($data) ? $data : array());
	}
});


$app->match('/', function() use ($app) {

	$kv = $app['kvdb'];
	if(!$kv->get('project_1')) {

		$project = array(
			'id' => 1,
			'tasks' => array()
		);

		$c = $app['sae_counter'];
		$c->create('1_task_counter');

		$kv->set('project_1', json_encode($project));
	}


    return $app->redirect('/index.html');
})->bind('homepage');

$app->match('/kanban', function() use ($app) {
    return $app->redirect('/kanban.html');
})->bind('kanban');


// 
$app->get('/api/projects/{id}', function($id) use ($app) {
	
	$kv = $app['kvdb'];
	//{"id":1234567890,"tasks":[1,2,3,4,5]}
	$project = $kv->get('project_'.$id);
	$tasks = array();

	if (!$project) {
		$error = array('message' => 'The project was not found.');
		return $app->json($error, 404);
	} else {
		$project = json_decode($project, true);

		foreach ($project['tasks'] as $taskid) {
			$task = $kv->get('task_'.$taskid);
			if ($task) {
				$task = json_decode($task, true);
				if ( $task['delete'] == 0 ) {
					$tasks[] = $task;
				}
			}
		}
	}

	return $app->json(array(
		'id' => $project['id'],
		'tasks' => $tasks
	));
});


$app->post('/api/projects', function() use ($app) {
	
	// create a new project
	$project = array('id' => 1, 'title' => 'project 1');

	$c = $app['sae_counter'];
	$c->create($project['id'].'_task_counter');

});

// delete task
$app->delete('/api/tasks', function(Request $request) use ($app) {
	// todo verify id is int
	$taskid = $request->request->get('id');

	$kv = $app['kvdb'];
	$task = $kv->get('task_'.$taskid);
	$result = 'fail';
	if ($task) {
		$task = json_decode($task, true); 
		$task['delete'] = 1;
		if ($kv->set('task_'.$taskid, json_encode($task))) {
			$result = 'success';
		}
	}

	return $app->json(array('result' => $result));	
});

// create new task
$app->post('/api/tasks', function(Request $request) use ($app) {

	$c = $app['sae_counter'];
	$kv = $app['kvdb'];
	$result = 'success';

	$task = array(
		'title' => $app->escape($request->request->get('title')),
		'step' => $app->escape($request->request->get('step')),
		'notes' => $app->escape($request->request->get('notes')),
		'color' => $app->escape($request->request->get('color')),
		'blocked' => $app->escape($request->request->get('blocked')),
		'urgent' => $app->escape($request->request->get('urgent')),
		'person' => $app->escape($request->request->get('person')),
		'tag' => $app->escape($request->request->get('tag')),
		'place' => $app->escape($request->request->get('place')),
		'delete' => 0,
		'createAt' => date('Y-m-d H:i:s'),
		'updateAt' => date('Y-m-d H:i:s'),
	);

	// todo verify id is int
	$projectId = $request->request->get('projectId');

	$taskId = $request->request->get('id');
	if ( $taskId ) {
		// update task 
		$task['id'] = $taskId;
		$task['updateAt'] = date('Y-m-d H:i:s');

		if (!$kv->set('task_'.$taskId, json_encode($task))) {
			$result = 'fail';
		}
	} else {
		// create new task
		$taskId = $c->incr($projectId.'_task_counter'); 
		$task['id'] = $taskId;

		$kv->set('task_'.$taskId, json_encode($task));

		$project = json_decode($kv->get('project_'.$projectId), true);
		if (!in_array($taskId, $project['tasks'])) {
			$project['tasks'][] = $taskId;
			$kv->set('project_'.$projectId, json_encode($project));
		}
	}

	return $app->json(array('id' => $taskId, 'result' => $result));
});


$app->match('/test/{id}', function($id) use ($app) {
	// $app['monolog']->addDebug('');

	// $task = array(
	// 	'step' => $app->escape($id),
	// 	'createAt' => date('Y-m-d H:i:s'),
	// 	'updateAt' => date('Y-m-d H:i:s'),
	// );	

	$kv = $app['kvdb'];
	// $kv->set('test', json_encode($task));
	$task = $kv->get('task_1');
	var_dump($task);



})->value('id', "0");



$app->match('/api/initdata', function() use ($app) {

	$task1 = array(
		'id' => 1,
		'title' => 'task 1',
		'notes' => 'some notes about task 1',
		'color' => 'blue',
		'blocked' => true,
		'important' => true,
		'createAt' => date('Y-m-d H:i:s'),
		'updateAt' => date('Y-m-d H:i:s'),
		'person' => array('Bob', 'Green'),
		'comments' => array('first comment', 'second comment'),
	);

	$task2 = array(
		'id' => 2,
		'title' => 'task 2',
		'notes' => 'some notes about task 2',
		'color' => 'red',
		'blocked' => false,
		'important' => true,
		'createAt' => date('Y-m-d H:i:s'),
		'updateAt' => date('Y-m-d H:i:s'),
		'person' => array('Bob', 'Green'),
		'comments' => array('first comment', 'second comment'),
	);

	$task3 = array(
		'id' => 3,
		'title' => 'task 3',
		'notes' => 'some notes about task 3',
		'color' => 'green',
		'blocked' => true,
		'important' => false,
		'createAt' => date('Y-m-d H:i:s'),
		'updateAt' => date('Y-m-d H:i:s'),
		'person' => array('Bob', 'Green'),
		'comments' => array('first comment', 'second comment'),
	);

	$task4 = array(
		'id' => 4,
		'title' => 'task 4',
		'notes' => 'some notes about task 4',
		'color' => '',
		'blocked' => false,
		'important' => false,
		'createAt' => date('Y-m-d H:i:s'),
		'updateAt' => date('Y-m-d H:i:s'),
		'person' => array('Bob', 'Green'),
		'comments' => array('一些中文 comment', 'second comment'),
	);

	$project = array(
		'id' => 1,
		'tasks' => array()
	);

	// var_dump($app->json($task4));exit;

	$kv = $app['kvdb'];
	$c = $app['sae_counter'];
	$c->create('1_task_counter');

	$kv->set('project_1', json_encode($project));
	// $kv->set('task_1', json_encode($task1));
	// $kv->set('task_2', json_encode($task2));
	// $kv->set('task_3', json_encode($task3));
	// $kv->set('task_4', json_encode($task4));

	return "ok";
});