<?php

function admin_block() {
    if (!isset($_SESSION['admin']) || $_SESSION['admin'] == false) {
        echo json_encode([
            "success" => false,
            "redirect" => "search_found.html",
            "data" => [],
            "message" => "Unauthorized Access"
        ]);
        exit();
    }
}