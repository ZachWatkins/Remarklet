<?php	// User Preferences
	header('content-type: application/json; charset=utf-8');
	header("access-control-allow-origin: *");
	require_once 'login.php';
	// Connect to server.
	$db_server = mysql_connect($db_hostname, $db_username, $db_password);
	if(!$db_server) die("Unable to connect to MySQL: " . mysql_error());

	// Select database.
	mysql_select_db($db_database)
		or die("Unable to select database: " . mysql_error());

	// Select table.
	parse_str($_SERVER['QUERY_STRING']);
	$query = "SELECT * FROM user_preferences WHERE UserID='$key'";
	$result = mysql_query($query);
	if(!$result) die ("Database access failed: " . mysql_error());
	$row = mysql_fetch_row($result);
	// Process data.
	echo '{"Grid":{';
	echo '"Size":"' . $row[1] . '",';
	echo '"Division":"' . $row[2] . '",';
	echo '"Background":"' . $row[3] . '",';
	echo '"Lines":"' . $row[4] . '"';
	echo '},';
	echo '"CSS_Editor":{';
	echo '"Indentation":"' . str_replace('_', ' ', $row[5]) . '",';
	echo '"Font Size":"' . $row[6] . '"';
	echo '},';
	echo '"Export":{';
	echo '"Disable Javascript":"' . $row[7] . '",';
	echo '"Show Browser Info":"' . $row[8] . '",';
	echo '"Require Absolute URLs":"' . $row[9] . '"';
	echo '},';
	echo '"Extra_Features":"' . $row[10] . '"';
	echo '}';
mysql_close($db_server);
?>