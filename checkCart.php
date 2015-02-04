<?php
session_start();
 
$data = ($_SESSION['cart']);
    echo json_encode($data);
?>