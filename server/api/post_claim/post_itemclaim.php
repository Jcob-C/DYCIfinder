<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/foundreport_claims.php';
require_once __DIR__ . '/../../lib/img_host.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $contactNumber = $_POST['claimpost_ownerphone'];
    $description = $_POST['claimpost_description'];
    $facebookProfile = $_POST['claimpost_ownerfb'];
    $emailAddress = $_POST['claimpost_owneremail'];
    $ownerName = $_POST['claimpost_ownername'];
    $studentID = $_POST['claimpost_studentid'];
    $courseSection = $_POST['claimpost_coursesection'];
    $userID = $_SESSION['userID'] ?? null;
    $itemID = $_POST['item_id'];
    $imageURL = null;

    // Convert image upload to URL with free image hosting
    $tmpDir = sys_get_temp_dir();                                                                       // Get the system temporary directory
    if (isset($_FILES['claimpost_image']) && $_FILES['claimpost_image']['error'] === UPLOAD_ERR_OK) { // Check if image is uploaded without errors
        $tmp = $tmpDir . "/" . uniqid("img_") . "_" . $_FILES['claimpost_image']['name'];            // Create a unique temporary file path
        move_uploaded_file($_FILES['claimpost_image']['tmp_name'], $tmp);                             // Move the uploaded file to the temporary location
        $imageURL = get_imageURL($tmp);                                                               // Upload the image and get its URL
        unlink($tmp);                                                                                  // Delete the temporary file path
    }

    $insertedID = insert_claim(
        $conn,
        $userID,
        $itemID,
        $description,
        $imageURL,
        $ownerName,
        $studentID,
        $courseSection,
        $facebookProfile,
        $contactNumber,
        $emailAddress
    );

    $redirect = isset($_SESSION['userID']) ? "history.html" : "search_found.html";

    if ($insertedID > 0) {
        echo json_encode([
            "success" => true,
            "redirect" => $redirect,
            "data" => ["item_claim_id" => $insertedID]
        ]);
        exit();
    } 
}
catch (Exception $e) {
    error_log("Error in post_itemclaim.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "redirect" => null,
        "data" => ["item_claim_id" => 0]
    ]);
}