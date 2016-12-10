<?php
header("Access-Control-Allow-Origin: *");
if(!empty($_POST['data'])){
	$data = $_POST['data'];
	$fname = uniqid(rand(), true) .'.log';
	$file = fopen("logs/" .$fname, 'w');//creates new file
	fwrite($file, $data);
	fclose($file);
}

?>