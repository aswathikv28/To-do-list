import './style.css';

let input = document.getElementById("user-input-text");
let addButton = document.getElementById("add-button");
let sortButton = document.getElementById("sort-button");
let div = document.getElementById("items-div");
let editModal = document.getElementById("edit-modal");
let editTextBox = document.getElementById("edit-text-box");
let saveEditButton = document.getElementById("save-edit-button");
let currentEditItemID = null;

function generateItemId(){
  return 'id_'+Date.now();
}

function addItems(item) {
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.dataset.id = item.id;
    let checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-item");

    let itemCheckBox = document.createElement("input");
    itemCheckBox.type = "checkbox";
    itemCheckBox.classList.add("check-box");
    itemCheckBox.checked = item.checked; 
    if (item.checked) {
      itemContainer.classList.add("checked");
  }

    let label = document.createElement("label");
    label.textContent = item.value;
    label.classList.add("label");

    let modifyIcons = document.createElement("div");
    modifyIcons.classList.add("icons-modify");

    let deleteiconDiv = document.createElement("div");
    deleteiconDiv.classList.add("delete-icon-div");
    let deleteImage = document.createElement("img");
    deleteImage.classList.add("delete-image");
    deleteImage.src = "image/delete-icon.png";
    deleteImage.alt = "Delete"; 

    deleteiconDiv.addEventListener("click", () => {
        itemContainer.remove();
        removeItemFromLocalStorage(item.id);
    });

    let editButtonDiv = document.createElement("div");
    editButtonDiv.classList.add("edit-icon-div");
    let editButton = document.createElement("img");
    editButton.classList.add("edit-button");
    editButton.src = "image/edit-icon.png";
    editButton.alt = "Edit";
    editButtonDiv.addEventListener("click", () => {
        editModal.style.display = 'block';
        editTextBox.value = label.textContent;
        currentEditItemID = item.id;
        
    });

    itemCheckBox.addEventListener("change", function () {
        itemContainer.classList.toggle("checked", itemCheckBox.checked);
        updateItemCheckedState(item.id, itemCheckBox.checked);
    });

    checkboxContainer.appendChild(itemCheckBox);
    checkboxContainer.appendChild(label);
    itemContainer.appendChild(checkboxContainer);
    deleteiconDiv.appendChild(deleteImage);
    modifyIcons.appendChild(deleteiconDiv);
    editButtonDiv.appendChild(editButton);
    modifyIcons.appendChild(editButtonDiv);
    itemContainer.appendChild(modifyIcons);
    div.appendChild(itemContainer);
}

addButton.addEventListener("click", () => {
    let userValue = input.value.trim();
    if (userValue !== "") {
        const id = generateItemId();
        addItems({id, value: userValue, checked: false });
        let items = JSON.parse(localStorage.getItem("items")) || [];
        items.push({id, value: userValue, checked: false });
        localStorage.setItem("items", JSON.stringify(items));
        input.value = "";
    }
});

sortButton.addEventListener("click", sortItems);

function sortItems() {
    const items = Array.from(div.children);
    items.sort((a, b) => {
        const aChecked = a.querySelector('input').checked;
        const bChecked = b.querySelector('input').checked;
        return (aChecked === bChecked) ? 0 : (aChecked ? 1 : -1);
    });
    items.forEach(item => div.appendChild(item));
}

function loadItems() {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items.forEach(item => addItems(item));
}

loadItems();

function removeItemFromLocalStorage(itemId) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter(item => item.id !== itemId);
    localStorage.setItem("items", JSON.stringify(items));
}

function updateItemCheckedState(itemId, checked) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.map(item =>
        item.id === itemId ? { ...item, checked } : item
    );
    localStorage.setItem("items", JSON.stringify(items));
}

document.querySelector('.close-button')?.addEventListener('click', () => {
    editModal.style.display = 'none';
});

saveEditButton.addEventListener('click', () => {
    if (currentEditItemID && editTextBox.value.trim() !== "") {
        let newValue = editTextBox.value.trim();

        let itemContainer = Array.from(div.children).find(
          container => container.dataset.id === currentEditItemID
        );
        if (itemContainer){
          itemContainer.querySelector('label').textContent = newValue; 
        }
        
        let items = JSON.parse(localStorage.getItem("items"))||[];
        items =items.map(item=>
          item.id === currentEditItemID?{...item, value:newValue}:item
        );
        localStorage.setItem("items",JSON.stringify(items));
        editModal.style.display = 'none';
    }
});


