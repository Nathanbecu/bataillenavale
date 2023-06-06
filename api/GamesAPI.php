<?php
var_dump($_REQUEST);
if ($_REQUEST) {
    echo $_REQUEST["action"]();
}

function saveGame() {
    var_dump($_REQUEST);
}