<?php

function insert_lostreport( // returns int (inserted row ID) or 0 if insert failed
    $conn,
    $user_id,
    $item_name,
    $item_category,
    $item_description,
    $lost_location,
    $lost_date,
    $image_url,
    $loster_name,
    $facebook_profile,
    $contact_number,
    $email_address,
    $coursection,
    $studentID
) {
    $sql = "INSERT INTO lost_reports 
        (user_id, item_name, item_category, item_desc, lost_location, lost_date, image_url, owner_full_name, owner_fb, owner_phone, owner_email, owner_course_section, owner_student_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssssssssss",
        $user_id,
        $item_name,
        $item_category,
        $item_description,
        $lost_location,
        $lost_date,
        $image_url,
        $loster_name,
        $facebook_profile,
        $contact_number,
        $email_address,
        $coursection,
        $studentID
    );

    $stmt->execute();
    $insertId = $stmt->insert_id;

    $stmt->close();
    return $insertId;
}



function get_user_lostreports($conn, $page, $userID) {
    $pageLimit = 5;

    $sql = "SELECT * FROM lost_reports 
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?";

    $page = max(1, (int)$page);
    $offset = ($page - 1) * $pageLimit;

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $userID, $pageLimit, $offset);

    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    return $data;
}



function get_losts($conn, $keyword = "", $category = "", $location = "", $order = "Newest first") {
    $sql = "SELECT * FROM lost_reports WHERE report_status = 'Lost'";
    $types = '';
    $params = [];

    $keyword = trim($keyword);
    $category = trim($category);
    $location = trim($location);
    $order = trim($order);

    if ($keyword !== "") {
        $sql .= " AND (item_name LIKE ? OR owner_full_name LIKE ? OR item_desc LIKE ?)";
        $types .= 'sss';
        $keywordParam = '%' . $keyword . '%';
        $params[] = $keywordParam;
        $params[] = $keywordParam;
        $params[] = $keywordParam;
    }

    if ($category !== "" && $category !== "Any" && $category !== "N/A") {
        $sql .= " AND item_category = ?";
        $types .= 's';
        $params[] = $category;
    }

    if ($location !== "" && $location !== "Anywhere" && $location !== "N/A") {
        $sql .= " AND lost_location = ?";
        $types .= 's';
        $params[] = $location;
    }

    if ($order === 'Oldest first') {
        $sql .= " ORDER BY id ASC";
    } else {
        $sql .= " ORDER BY id DESC";
    }

    $stmt = $conn->prepare($sql);

    if ($types !== "") {
        $bindParams = [$types];
        foreach ($params as $key => $value) {
            $bindParams[] = &$params[$key];
        }
        call_user_func_array([$stmt, 'bind_param'], $bindParams);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $data;
}



function reset_lost_status($conn, $foundid) {
    $sql = "UPDATE lost_reports SET report_status = 'Lost' WHERE foundreport_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $foundid);
    $stmt->execute();
    $stmt->close();
}



function set_lost_status($conn, $id, $status, $reportID) {
    $sql = "UPDATE lost_reports SET report_status = ?, foundreport_id = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sii", $status, $reportID, $id);
    $stmt->execute();
    $stmt->close();
}



function get_lost_report($conn, $id) {
    $sql = "SELECT * FROM lost_reports WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();
    $stmt->close();
    return $report;
}