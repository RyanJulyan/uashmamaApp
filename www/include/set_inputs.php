<?php
	
	// Include Database Connection file
	require("connect_to_mysql.php");
	
	$insert_inputs_sql = "
	INSERT INTO `proj_input`(`id`, `input_info_id`, `project_id`) 
	VALUES (NULL,
	".$select_inputs_checkboxes_arr[$i].", 
	".$_REQUEST['project_select']."); ";
	
	// Create SQL Insert panel statement quey
	mysql_query($insert_inputs_sql)or die(mysql_error());
	
?>