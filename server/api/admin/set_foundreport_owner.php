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
    $inputs = json_decode(file_get_contents("php://input"), true); // 'ownerID' 'foundID' 'postType'

    set_claims_statuses($conn, $inputs['foundID'], "Rejected");
    reset_lost_status($conn, $inputs['foundID']);

    if ($inputs['postType'] == "lost") {
        set_report_owner_type($conn, $inputs['foundID'], "Lost Report",  $inputs['ownerID']);
        set_lost_status($conn, $inputs['ownerID'], "Found", $inputs['foundID']);
    }
    elseif ($inputs['postType'] == "claim") {
        set_report_owner_type($conn, $inputs['foundID'], "Claim", $inputs['ownerID']);
        set_claim_status($conn, $inputs['ownerID'], "Approved");
    }
    
    set_report_status($conn, $inputs['foundID'], "To-claim");

    echo json_encode([
        "success" => true
    ]);
    exit();
} 
catch (Exception $e) {
    error_log("Error in update_user.php : " . $e->getMessage());
} 
finally {
    echo json_encode([
        "success" => false
    ]);
}