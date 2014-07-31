<?php
/* 

Created By: Ryan Julyan 
------------------------- 17 July, 2014------------------------------

For Jeep App project
*/

// place db host name. Usually "localhost"
$db_host = "66.116.150.173";

//Pace username for MySQL db here
$db_username = "C379080_jeep";

//Place password for MySQL db here
$db_pass = "J33pDB";

//Place MySQL db name here
$db_name = "C379080_jeep";

// Although musql_connect has depricated this is still more stable for this method atm.
mysql_connect("$db_host","$db_username", "$db_pass", "$db_name") or die(mysql_error());
mysql_select_db("$db_name")or die("no database with that name");
?>