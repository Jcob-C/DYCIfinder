<?php

function insert_claim($conn, // returns int (inserted row ID) or 0 if insert failed
    $user_id, 
    $item_id, 
    $claim_description,
    $image_url1,
    $image_url2,
    $claimant_name,
    $facebook_profile,
    $contact_number,
    $email_address
) {
    $sql = "INSERT INTO foundreport_claims
    (user_id, foundreport_id, claim_desc, image_url1, image_url2, owner_full_name, owner_fb, owner_fb, owner_email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iisssssss", $user_id, $item_id, $claim_description, $image_url1, $image_url2, $claimant_name, $facebook_profile, $contact_number, $email_address);
    $stmt->execute();
    $stmt->close();
    return $conn->insert_id; 
}



function get_user_foundreport_claims($conn, $page, $userID) {
    $pageLimit = 9;

    $sql = "SELECT frc.*, fr.item_name 
            FROM foundreport_claims frc
            JOIN found_reports fr ON frc.foundreport_id = fr.id
            WHERE frc.user_id = ?
            ORDER BY frc.id DESC
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