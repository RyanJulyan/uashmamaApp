<?php
/* 

Created By: Ryan Julyan 
------------------------- 17 July, 2014------------------------------

For Jeep App project
*/

// place db host name. Usually "localhost"
$db_host = "127.0.0.1";

//Pace username for MySQL db here
$db_username = "root";

//Place password for MySQL db here
$db_pass = "";

//Place MySQL db name here
$db_name = "jeep_app";

$con = mysql_connect("$db_host","$db_username", "$db_pass", "$db_name") or die(mysql_error());
mysql_select_db("$db_name")or die("no database with that name");
?>