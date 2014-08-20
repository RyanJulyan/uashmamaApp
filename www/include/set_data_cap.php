<?php

header("Access-Control-Allow-Origin: *"); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

// Include Database Connection file
require("connect_to_mysql.php");

$AllUsers = array();
$AllUsersExploded = explode( ',',$_REQUEST['AllUsersDataCap']);
$noInArray = count($AllUsersExploded);
$noOfEntries = $noInArray/8;

$currentIndex = 0;
$counter = 0;
$itemArray=array();
for($j = 0; $j < $noInArray; $j++){
	array_push($itemArray, $AllUsersExploded[$j]);
	$counter++;
	if($counter == 8){
		array_push($AllUsers,$itemArray);
		$counter = 0;
		$itemArray=array();
	}
	
	
}

$last_user_id;
$lastUserName;

for($i=0; $i < count($AllUsers); $i++){
	$name = $AllUsers[$i][1];
	$surname = $AllUsers[$i][2];
	$email = $AllUsers[$i][3];
	$cell = $AllUsers[$i][4];
	$question = $AllUsers[$i][5];
	$title = $AllUsers[$i][6];
	$opt = $AllUsers[$i][7];
	
	// echo $username;
	
	//echo $AllUsers[$i][1];

	$insert_project_sql = "INSERT INTO uashmama(id, name, surname, email, cell, question, title, opt) 
	VALUES(NULL,
	'".$name."',
	'".$surname."',
	'".$email."',
	'".$cell."',
	'".$question."',
	'".$title."',
	'".$opt."');";
	
	// echo $insert_project_sql."\n\n";
	
	// Create SQL Insert panel statement quey
	 mysql_query($insert_project_sql)or die(mysql_error());
	
	// $last_user_id = $user_id;
	// $lastUserName = $username;
}

?>