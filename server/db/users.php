<?php

function get_user_hashedpass($conn, $email) { // return string or null
    $stmt = $conn->prepare("
        SELECT hashed_pass FROM users WHERE email_address = ?
    ");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row ? $row['hashed_pass'] : null;
}



function get_user_IDandRole($conn, $email) { // return ['id' => int, 'user_role' => string] or null
    $stmt = $conn->prepare("
        SELECT id, user_role FROM users WHERE email_address = ?
    ");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row ? $row : null;
}



function store_user_code($conn, $email, $code) { // return success, true or false
    $stmt = $conn->prepare("
        INSERT INTO users (email_address, register_code, regis_code_created_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            register_code = VALUES(register_code),
            regis_code_created_at = NOW()
    ");

    $stmt->bind_param("si", $email, $code);
    $result = $stmt->execute();

    $stmt->close();
    return $result;
}



function get_valid_user_code($conn, $email) { // return code or null
    $stmt = $conn->prepare("
        SELECT register_code 
        FROM users 
        WHERE email_address = ? 
        AND hashed_pass IS NULL
    ");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row ? $row['register_code'] : null;
}



function edit_user_attribute($conn, $id, $column, $input) { // return success, true or false
    $stmt = $conn->prepare("
        UPDATE users SET $column = ? WHERE id = ?
    ");

    $stmt->bind_param("si", $input, $id);
    $result = $stmt->execute();

    $stmt->close();
    return $result;
}