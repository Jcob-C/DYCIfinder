<?php 
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/lost_reports.php';
require_once __DIR__ . '/../../db/foundreport_claims.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $data = [];

    if ($inputs['postType'] == "Lost Report") {
        $data = get_lost_report($conn, $inputs['id']);
    }
    elseif ($inputs['postType'] == "Claim") {
        $data = get_claim($conn, $inputs['id']);
    }
    else {
        echo json_encode([
            "success" => false,
            "data" => []
        ]);
        exit();
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
}
catch (Exception $e) {
    error_log("Error in get_user_info.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}
?>