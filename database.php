<?php

$host = 'localhost';
$dbname = 'products';
$user = 'root';

try {
    $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>