<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/found_reports.php';
require_once __DIR__ . '/../../db/foundreport_claims.php';
require_once __DIR__ . '/../../db/lost_reports.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    if ($inputs['status'] == "Pending" || $inputs['status'] == "Unclaimed") {
        set_claims_statuses($conn, $inputs['id'], "Pending");
        reset_lost_status($conn, $inputs['id']);
        set_report_owner_type($conn, $inputs['id'], null, null);
    }
    if ($inputs['status'] == "To-claim" || $inputs['status'] == "Claimed") {
        set_claims_statuses($conn, $inputs['id'], "Rejected");
    }

    $success = set_report_status($conn, $inputs['id'], $inputs['status']);
    if ($success) {
        echo json_encode([
            "success" => true
        ]);
        exit();
    }
} 
catch (Exception $e) {
    error_log("Error in update_user.php : " . $e->getMessage());
} finally {
    echo json_encode([
        "success" => false
    ]);
}