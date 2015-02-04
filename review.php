<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include_once "database.php";

    
    $nameId = $_POST["nameId"];
    $stars = $_POST["stars"];
    $reviewinsert = $_POST["reviewinsert"];
    $customername = $_POST['customername'];
  
    
   echo($nameId . $stars . $review);
   
    $stmt = $DBH->prepare ("INSERT INTO reviews (nameid, customername, stars, reviewinsert)VALUES (:nameId, :customername, :stars, :reviewinsert) ");


    try {
        $stmt->execute(array(':nameId'=>$nameId,':customername'=>$customername, ':stars'=>$stars, ':reviewinsert'=>$reviewinsert));
        echo "success";
    } catch (PDOException $e) {
        echo "problem with your review";
    }
 
 
/*$arr = array();

while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $arr[] = $data;
}
echo json_encode($arr); */
?>
    