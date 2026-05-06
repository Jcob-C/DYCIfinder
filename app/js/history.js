import { popupMessage, popupLoading } from "../lib/popups.js";
import { API_URL } from "../conf/api.js";
import { getUserInfo } from "../lib/util.js";

let lostCurrentPage = 1;
let claimsCurrentPage = 1;
let onLastLostPage = true;
let onLastClaimsPage = true;
let runningLoadLosts = false;
let runningLoadClaims = false;
let currentTab = "losts";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("losts-tab-btn").addEventListener("click", function () { switchTab("losts"); });
    document.getElementById("claims-tab-btn").addEventListener("click", function () { switchTab("claims"); });
    document.getElementById("next-pagebtn").addEventListener("click", function () { changePage(1); });
    document.getElementById("prev-pagebtn").addEventListener("click", function () { changePage(-1); });
    switchtoLoggedInPage();
    loadClaims();
    loadLosts();
});



async function switchtoLoggedInPage() {
    const data = await getUserInfo();
    if (!data) return;
    document.getElementById("loggedin-page").style.display = "block";
    document.getElementById("loggedout-page").style.display = "none";
}



async function loadLosts() {
    if (runningLoadLosts) return;
    runningLoadLosts = true;

    const lostsContainer = document.getElementById("lost-reports-container");
    const postTemplate = document.getElementById("post-template");
    const viewDetailsTemplate = document.getElementById("viewdetails-lost-template");

    let data;
    try {
        const result = await fetch(API_URL + '/history/get_user_lostreports.php', {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ currentPage: lostCurrentPage })
        });
        const response = await result.json();
        console.log(response);

        if (response.success) data = response.data;
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        runningLoadLosts = false;
        return;
    }
    
    if (data.length < 5) onLastLostPage = true;
    else onLastLostPage = false;

    Array.from(lostsContainer.children).forEach(child => { child.remove(); });
    
    for (let i = 0; i < data.length; i++) {
        let post = data[i];
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".item-name").textContent = post['item_name'];
        clone.querySelector(".post-status").textContent = post['report_status'];
        clone.querySelector(".post-date").textContent = post['created_at'];

        clone.querySelector(".view-details").addEventListener("click", function () {

            const detailsClone = viewDetailsTemplate.content.cloneNode(true);

            detailsClone.querySelector(".created-at").textContent = post['created_at'];
            detailsClone.querySelector(".report-status").textContent = post['report_status'];

            detailsClone.querySelector(".item-name").textContent = post['item_name'];
            detailsClone.querySelector(".item-category").textContent = post['item_category'];
            detailsClone.querySelector(".item-desc").textContent = post['item_desc'];
            detailsClone.querySelector(".lost-location").textContent = post['lost_location'];
            detailsClone.querySelector(".lost-date").textContent = post['lost_date'];

            detailsClone.querySelector(".item-image").src = post['image_url'];

            detailsClone.querySelector(".owner-name").textContent = post['owner_full_name'];
            detailsClone.querySelector(".owner-student-id").textContent = post['owner_student_id'];
            detailsClone.querySelector(".owner-course").textContent = post['owner_course_section'];

            detailsClone.querySelector(".owner-fb").textContent = post['owner_fb'];
            detailsClone.querySelector(".owner-phone").textContent = post['owner_phone'];
            detailsClone.querySelector(".owner-email").textContent = post['owner_email'];

            detailsClone.querySelector(".details-done").addEventListener("click", function () {
                this.closest(".popup-overlay").remove();
            });

            lostsContainer.appendChild(detailsClone);
        });
        lostsContainer.appendChild(clone);
    }
    runningLoadLosts = false;
}



async function loadClaims() {
    if (runningLoadClaims) return;
    runningLoadClaims = true;

    const claimsContainer = document.getElementById("claim-posts-container");
    const postTemplate = document.getElementById("post-template");
    const viewDetailsTemplate = document.getElementById("viewdetails-claims-template");

    let data;
    try {
        const result = await fetch(API_URL + '/history/get_user_claimposts.php', {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ currentPage: claimsCurrentPage })
        });
        const response = await result.json();
        console.log(response);

        if (response.success) data = response.data;
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        runningLoadClaims = false;
        return;
    }
    
    if (data.length < 5) onLastClaimsPage = true;
    else onLastClaimsPage = false;

    Array.from(claimsContainer.children).forEach(child => { child.remove(); });
    
    for (let i = 0; i < data.length; i++) {
        let post = data[i];
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".item-name").textContent = post['item_name'];
        clone.querySelector(".post-status").textContent = post['claim_status'];
        clone.querySelector(".post-date").textContent = post['created_at'];

        clone.querySelector(".view-details").addEventListener("click", function () {

            const detailsClone = viewDetailsTemplate.content.cloneNode(true);

            detailsClone.querySelector(".created-at").textContent = post['created_at'];
            detailsClone.querySelector(".claim-status").textContent = post['claim_status'];

            detailsClone.querySelector(".item-name").textContent = post['item_name'];
            detailsClone.querySelector(".claim-desc").textContent = post['claim_desc'];
            detailsClone.querySelector(".view-post-btn").addEventListener("click", function () {
                window.location.href = `post_claim.html?item_id=${post['foundreport_id']}`;
            });

            detailsClone.querySelector(".image-url").src = post['image_url'] || '';

            detailsClone.querySelector(".owner-name").textContent = post['owner_full_name'];
            detailsClone.querySelector(".owner-student-id").textContent = post['owner_student_id'];
            detailsClone.querySelector(".owner-course").textContent = post['owner_course_section'];

            detailsClone.querySelector(".owner-fb").textContent = post['owner_fb'];
            detailsClone.querySelector(".owner-phone").textContent = post['owner_phone'];
            detailsClone.querySelector(".owner-email").textContent = post['owner_email'];

            detailsClone.querySelector(".details-done").addEventListener("click", function () {
                this.closest(".popup-overlay").remove();
            });

            claimsContainer.appendChild(detailsClone);
        });
        claimsContainer.appendChild(clone);
    }
    runningLoadClaims = false;
}



async function changePage(increment) {
    if (currentTab === "losts") {
        if ((onLastLostPage && increment === 1) || (lostCurrentPage === 1 && increment === -1)) return;
        lostCurrentPage += increment;
        loadLosts();
    }
    else if (currentTab === "claims") {
        if ((onLastClaimsPage && increment === 1) || (claimsCurrentPage === 1 && increment === -1)) return;
        claimsCurrentPage += increment;
        loadClaims();
    }
    document.getElementById("current-page").textContent = currentTab == "losts" ? lostCurrentPage : claimsCurrentPage;
}



function switchTab(tab) {
    if (currentTab == tab) return;

    const sw = document.getElementById("tab-switch");  // add
    
    if (tab == "losts") {
        document.getElementById("lost-reports-tab").style.display = "block";
        document.getElementById("claim-posts-tab").style.display = "none";
        sw.classList.remove("on-claims");                               // add
        document.getElementById("losts-tab-btn").classList.add("active");    // add
        document.getElementById("claims-tab-btn").classList.remove("active"); // add
    }
    else if (tab == "claims") {
        document.getElementById("claim-posts-tab").style.display = "block";
        document.getElementById("lost-reports-tab").style.display = "none";
        sw.classList.add("on-claims");                                  // add
        document.getElementById("claims-tab-btn").classList.add("active");   // add
        document.getElementById("losts-tab-btn").classList.remove("active"); // add
    }

    currentTab = tab;
    document.getElementById("current-page").textContent = currentTab == "losts" ? lostCurrentPage : claimsCurrentPage;
}