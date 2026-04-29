<?php

function admin_block() {
    if (!isset($_SESSION['userID']) || !isset($_SESSION['isAdmin'])) {
        echo json_encode([
            "success" => false,
            "redirect" => "search_found.html",
            "data" => [],
            "message" => "Unauthorized Access"
        ]);
        exit();
    }
}