<?php
class database
{
	public $con;

	/*Verbinden met database*/
	public function __construct()
	{
		$dbHost = 'localhost';
		$dbName = 'michiel_js';
		$dbUsername = 'michiel_js';
		$dbPassword = 'password';

		$this->connect($dbHost,$dbUsername,$dbPassword,$dbName);
	}

	public function getConnection()
	{
		return $this->con;
	}

	public function connect($dbHost,$dbUsername,$dbPassword,$dbName)
	{
		$this->con = mysqli_connect($dbHost,$dbUsername,$dbPassword,$dbName);
		if(mysqli_connect_errno())
		{
			echo "Failed to connect to MySQL: ".mysqli_connect_error();
		}
	}

	public function escapeString($string) {
		return mysqli_real_escape_string($this->con,$string);
	}

	public function executeQuery($pQuery,$return = false) {
		$query = $pQuery;
		$result = mysqli_query($this->con,$query);

		if($return) {
			return $result;
		}
	}

	public function getArray($pQuery) {
		$result = $this->executeQuery($pQuery,true);
		$return = mysqli_fetch_assoc($result);

		return $return;
	}

	public function getJson($pQuery) {
		$result = $this->executeQuery($pQuery, true);
		$rows = array();

		while($val = mysqli_fetch_assoc($result)) {
			$rows[] = $val;
		}

		return json_encode($rows);
	}

	/*Connectie sluiten*/
	public function closeConnection()
	{
		mysqli_close($this->con);
	}
}