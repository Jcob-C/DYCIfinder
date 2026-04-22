<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/lost_reports.php';
require_once __DIR__ . '/../lib/img_host.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$item = $_POST['item'] ?? '';
$category = $_POST['category'] ?? '';
$description = $_POST['description'] ?? '';
$location = $_POST['location'] ?? '';
$date = $_POST['date'] ?? '';
$loster = $_POST['loster'] ?? '';
$facebook = $_POST['facebook'] ?? '';
$contact = $_POST['contact'] ?? '';
$email = $_POST['email'] ?? '';
$status = $_POST['status'] ?? '';
$userID = null;

$image1URL = null;
$image2URL = null;

$tmpDir = sys_get_temp_dir();

if (isset($_FILES['image1']) && $_FILES['image1']['error'] === UPLOAD_ERR_OK) {
    $tmp1 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['image1']['name'];
    move_uploaded_file($_FILES['image1']['tmp_name'], $tmp1);
    $image1URL = uploadAndGetImageURL($tmp1);
    unlink($tmp1);
}

if (isset($_FILES['image2']) && $_FILES['image2']['error'] === UPLOAD_ERR_OK) {
    $tmp2 = $tmpDir . "/" . uniqid("img2_") . "_" . $_FILES['image2']['name'];
    move_uploaded_file($_FILES['image2']['tmp_name'], $tmp2);
    $image2URL = uploadAndGetImageURL($tmp2);
    unlink($tmp2);
}

if (isset($_SESSION['userID'])) {
    $userID = $_SESSION['userID'];
}

$output = insertLostReport(
    $conn,
    $userID,
    $item,
    $category,
    $description,
    $location,
    $date,
    $image1URL,
    $image2URL,
    $loster,
    $facebook,
    $contact,
    $email
);

echo json_encode(["lost_report_id" => $output]); // 0 if failed, otherwise the new report ID