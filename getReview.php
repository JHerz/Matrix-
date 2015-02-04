<?php 

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include_once "database.php";

  
    $nameId = $_GET["specificID"];
     
    $stmt = $DBH->prepare ("SELECT customername, stars, reviewinsert, reviewid FROM product INNER JOIN reviews ON product.nameid = reviews.nameid WHERE product.nameid = ?");
 
     try {
        $stmt->execute(array($nameId));
       
    } catch (PDOException $e) {
        echo "Sorry, we cannot bring you your reviews at this time";
    }
    $arr = array();

while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $arr[] = $data;
}
echo json_encode($arr);
?>
