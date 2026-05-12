<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/lost_reports.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);

    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $keyword = isset($input['keyword']) ? $input['keyword'] : '';
    $category = isset($input['category']) ? $input['category'] : '';
    $location = isset($input['location']) ? $input['location'] : '';
    $order = isset($input['order']) ? $input['order'] : 'Newest first';

    $output = get_losts($conn, $keyword, $category, $location, $order);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error in get_foundreports.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}