import { API } from '../conf/api.js';
import { resizeImage } from '../lib/img_resizer.js';
import { showOKPopup } from '../lib/popups.js';
import { loadSelectOptions } from '../lib/util.js';

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("image1").addEventListener("change", function () { previewImage(this, "preview1", "remove1"); });
    document.getElementById("image2").addEventListener("change", function () { previewImage(this, "preview2", "remove2"); });
    document.getElementById("remove1").addEventListener("click", function () { clearImage("image1", "preview1", "remove1"); });
    document.getElementById("remove2").addEventListener("click", function () { clearImage("image2", "preview2", "remove2"); });
});

let postingLostItemReport = false;

loadSelectOptions("item_category", "get_item_categories.php", "category_name");
loadSelectOptions("lost_location", "get_campus_locations.php", "location_name");



function submitLostReport() {
    
}

function previewImage(input, previewId, removeBtnId) {
    const preview = document.getElementById(previewId);
    const removeBtn = document.getElementById(removeBtnId);
    const reader = new FileReader();

    if (!input.files || !input.files[0]) {
        clearImage(input.id, previewId, removeBtnId);
        return;
    }

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        removeBtn.style.display = "inline-block";
    };

    reader.readAsDataURL(input.files[0]);
}



function clearImage(inputId, previewId, removeBtnId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const removeBtn = document.getElementById(removeBtnId);

    input.value = "";
    preview.src = "";
    preview.style.display = "none";
    removeBtn.style.display = "none";
}