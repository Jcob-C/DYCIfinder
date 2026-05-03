import { API_URL } from '../conf/api.js';
import { popupMessage } from './popups.js';



export async function loadSelection(selectionID, apiLink, columnName) {
    const categorySelect = document.getElementById(selectionID);

    const result = await fetch(API_URL + '/' + apiLink, {method: "POST"});
    const response = await result.json();
    console.log(response);
    
    const optionOther = document.createElement("option");
    optionOther.textContent = "N/A";
    categorySelect.appendChild(optionOther);

    if (!response.success) {
        popupMessage("Failed to fetch options for: " + selectionID);
        return;
    }
    
    const data = response.data;

    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.textContent = data[i][columnName];
        categorySelect.appendChild(option);
    }
}



export async function getUserInfo() {
    let response;
    try {
        const result = await fetch(API_URL + "/get_user_info.php", {method: "POST"});
        response = await result.json();
        console.log(response);

        if (!response.success) throw new Error();
        else if (response.data.user) {
            return response.data;
        }
    }
    catch (error) {
        console.error(error);
        popupMessage("Error fetching user info.<br>Please try again.");
        return null;
    }
}