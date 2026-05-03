<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/lost_reports.php';

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    if (!isset($_SESSION['userID'])) throw new Exception("'userID' is not set in session");

    $output = get_user_foundreport_claims($conn, $inputs['currentPage'], $_SESSION['user_id']);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error in get_user_lostreports.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}