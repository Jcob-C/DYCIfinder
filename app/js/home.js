import { API } from '../conf/api.js';

document.getElementById("prevPageButton").addEventListener("click",prevPage);
document.getElementById("nextPageButton").addEventListener("click",nextPage);
document.getElementById("searchButton").addEventListener("click",reloadFoundPostings);
document.getElementById("sortOptions").addEventListener("change",reorderFoundPostings);

const orderSelection = document.getElementById("sortOptions");
const foundPostTemplate = document.getElementById("foundPostTemplate");
const foundPostsContainer = document.getElementById("foundPosts");

let foundPostings;

initPage();
reloadFoundPostings();

async function reloadFoundPostings() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page"); 
    const keyword = document.getElementById("keywordInput").value.trim();
    const category = document.getElementById("categorySelection").value;
    const location = document.getElementById("locationSelection").value;

    const result = await fetch(API + '/get_found.php', {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            keyword, category, location, page
        })
    });
    const response = await result.json();
    foundPostings = response.data;
    console.log(foundPostings);

    clearFoundPostings();
    loadFoundPostings();
}

function clearFoundPostings() {
    Array.from(foundPostsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") {
            child.remove();
        }
    });
}

function loadFoundPostings() {
    if (orderSelection.value == "Newest first") {
        for (let i = 0; i < foundPostings.length; i++) {
            loadFoundPosting(foundPostings[i]);
        }
    }
    else {
        for (let i = foundPostings.length-1; i >= 0; i--) {
            loadFoundPosting(foundPostings[i]);
        }
    }
}

function loadFoundPosting(post) {
    const clone = foundPostTemplate.content.cloneNode(true);
    clone.querySelector(".title").textContent = post['item_name'];
    clone.querySelector(".location").textContent = "Found at: " + post['location_found'];
    clone.querySelector(".date").textContent = "Found on: " + post['date_found'];
    clone.querySelector(".claimButton").addEventListener("click", function () {
        window.location.href = `post_claim.html?item_id=${post['id']}`;
    });
    foundPostsContainer.appendChild(clone);
}

function reorderFoundPostings() {
    clearFoundPostings();
    loadFoundPostings();
}

function initPage() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("page")) {
        params.set("page", "1");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.replaceState({}, "", newUrl);
    }
}

async function prevPage() {
    const params = new URLSearchParams(window.location.search);
    const currentPage = parseInt(params.get("page") || "1", 10);
    if (currentPage === 1) {
        return;
    }
    const newPage = currentPage - 1;

    params.set("page", newPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, "", newUrl);
    reloadFoundPostings();
}

async function nextPage() {
    const params = new URLSearchParams(window.location.search);
    const currentPage = parseInt(params.get("page") || "1", 10);
    const newPage = currentPage + 1;

    params.set("page", newPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, "", newUrl);
    reloadFoundPostings();
}