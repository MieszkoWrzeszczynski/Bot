<?php
header('Access-Control-Allow-Origin: *'); 
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');


	$data = file_get_contents('php://input');
	$fname = uniqid(rand(), true) .'.log';
	$file = fopen("logs/" .$fname, 'w');//creates new file
	fwrite($file, $data);
	fclose($file);

?>