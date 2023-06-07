<?php
$conn = new PDO('mysql:host=localhost;dbname=bataillenavale', "root", "root");

if ($_REQUEST) {
    echo $_REQUEST["action"]();
}

function saveGame() {
    global $conn;
    $boatsConf = json_encode($_REQUEST['game']['boatConf']);
    $boats = json_encode($_REQUEST['game']['boats']);

    $query = "INSERT INTO games (configuration, boats) VALUES ('" . $boatsConf . "', '" . $boats . "')";
    $conn->exec($query);
}