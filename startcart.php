<?php
 session_start();
 $cartItems = $_POST['cartItems'];
 if (isset($_POST['cartItems']) && !empty($_POST["cartItems"])) {
   
     if (!isset($_SESSION['cart'])) {
         $_SESSION['cart'] = array();
     }
   
    array_push($_SESSION['cart'], $cartItems); ;
    $data = ($_SESSION['cart']);
    echo json_encode($data);
} 
?>