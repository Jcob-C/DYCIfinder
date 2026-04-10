import { API } from '../conf/api.js';

document.getElementById("prevPageButton").addEventListener("click",prevPage);
document.getElementById("nextPageButton").addEventListener("click",nextPage);
document.getElementById("searchButton").addEventListener("click",reloadFoundPostings);

const foundPostTemplate = document.getElementById("foundPostTemplate");
const foundPostsContainer = document.getElementById("foundPosts");

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
    const data = response.data;
    console.log(data);
    
    Array.from(foundPostsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") {
            child.remove();
        }
    });

    for (let i = 0; i < data.length; i++) {
        const clone = foundPostTemplate.content.cloneNode(true);
        clone.querySelector(".title").textContent = data[i]['item_name'];
        clone.querySelector(".location").textContent = "Found at: " + data[i]['location_found'];
        clone.querySelector(".date").textContent = "Found on: " + data[i]['date_found'];
        clone.querySelector(".claimButton").addEventListener("click", function () {
            window.location.href = `post_claim.html?item_id=${data[i]['id']}`;
        });
        foundPostsContainer.appendChild(clone);
    }
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