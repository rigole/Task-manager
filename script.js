const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemsBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;



// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];


// Drag Functionality
let draggedItem;
let currentColumn;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')){
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Release the course' , 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completeListArray = ['Being cool', 'Getting stuff done'];
        onHoldListArray = ['Being uncool'];
    }
}


// Set localStorage Arrays
function updateSavedColumns() {

    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]))
    })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
/*  console.log('columnEl:', columnEl);
    console.log('column:', column);
    console.log('item:', item);
    console.log('index:', index);*/

    // List Item
    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
    // Append
    columnEl.appendChild(listEl);
}



// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad){
        getSavedColumns();
    }

    // Backlog Column
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index);
    })
    // Progress Column
    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 1, progressItem, index);
    })

    // Complete Column
    completeList.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 2, completeItem, index);
    })

    // On Hold Column
    onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 3, onHoldItem, index);
    })

    // Run getSavedColumns only once, Update Local Storage
    updatedOnLoad = true;
    updateSavedColumns();
}

// Update Item - Delete if necesarry or update value
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
}

// Add to column list, Reset TextBox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    updateDOM();
}
//Drag function when we start dragging an element
function drag(e) {
    draggedItem = e.target;

}
// Show Add Item Input Box
function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveItemsBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}



// Hide Item Input Box
function hideInputBox(column) {
    addBtns[column].style.visibility = 'visibility';
    saveItemsBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}



// Column Allows for Item to Drop
function allowDrop(e) {
    e.preventDefault();
}
// When item enters column Area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}

// Dropping Item in Column
function drop (e) {
    e.preventDefault();
    // Remove Background Color/Padding
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });
    // Add Item to Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);

}



// On Load
updateDOM();