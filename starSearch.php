<?php

include_once "database.php";

$stmt = $DBH->prepare("SELECT AVG (stars) FROM reviews WHERE nameid = ?");

try {
    $stmt->execute(array($_GET['nameid']));
} catch (PDOException $e) {
    echo "couldnt connect";
}
$arr = array();

while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $arr[] = $data;
}
echo json_encode($arr);


?>

