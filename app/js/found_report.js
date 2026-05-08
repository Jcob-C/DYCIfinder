import { API_URL } from '../conf/api.js';

const foundReportID = new URLSearchParams(window.location.search).get('id');

let runningLoadFoundReportInfo = false;

document.addEventListener("DOMContentLoaded", function () {
    if (foundReportID == null || foundReportID == "") window.location.href = "admin.html";

    loadFoundReportInfo();
});



async function loadFoundReportInfo() {
    if (runningLoadFoundReportInfo) return;
    runningLoadFoundReportInfo = true;

    const itemNameInput = document.getElementById("found-item-name");
    const categorySelect = document.getElementById("found-category-select");
    const descriptionInput = document.getElementById("found-item-desc");
    const locationSelect = document.getElementById("found-location-select");
    const findDateInput = document.getElementById("found-find-date");
    const previewImage = document.getElementById("found-current-image");
    const finderNameInput = document.getElementById("found-finder-name");
    const studentIdInput = document.getElementById("found-finder-student-id");
    const courseSectionInput = document.getElementById("found-finder-course-section");
    const fbInput = document.getElementById("found-finder-fb");
    const phoneInput = document.getElementById("found-finder-phone");
    const emailInput = document.getElementById("found-finder-email");
    const updateBtn = document.getElementById("found-update-btn");

    let data;
    try {
        const result = await fetch(API_URL + "/admin/get_foundreport.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                id: foundReportID
            })
        });
        const response = await result.json();
        console.log(response);
        data = response.data;

        if (!response.success) {
            window.location.href = "admin.html";
        } 
    }
    catch (error) {
        console.error(error);
        window.location.href = "admin.html";
    }
    
    itemNameInput.value = data.item_name;
    categorySelect.value = data.item_category;
    descriptionInput.value = data.item_desc;
    locationSelect.value = data.find_location;
    findDateInput.value = data.find_date;
    previewImage.src = data.image_url;
    finderNameInput.value = data.finder_full_name;
    studentIdInput.value = data.finder_student_id;
    courseSectionInput.value = data.finder_course_section;
    fbInput.value = data.finder_fb;
    phoneInput.value = data.finder_phone;
    emailInput.value = data.finder_email;

    runningLoadFoundReportInfo = false;
}