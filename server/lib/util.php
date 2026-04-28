<?php

function admin_block() {
    if (!isset($_SESSION['userID']) || !isset($_SESSION['admin'])) {
        echo json_encode([
            "success" => false,
            "redirect" => "search_found.html",
            "data" => [],
            "message" => "Unauthorized Access"
        ]);
        exit();
    }
}