<?php

include_once "database.php";

$stmt = $DBH->prepare("SELECT * FROM product WHERE category = ? ORDER BY price");// AND  price > 0 AND price < 500"); // OR company = '" . $name . "' AND  price > $min AND price < $max OR category = '" . $name . "' AND  price > $min AND price < $max ");

try {
    $stmt->execute(array($_GET['itemType']));
} catch (PDOException $e) {
    echo "couldnt connect";
}
$arr = array();

while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $arr[] = $data;
}
echo json_encode($arr);
?>