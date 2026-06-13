const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const sortingSelect = document.getElementById("sorting-select");
const tabBtn = document.getElementById("tab-btn");

let myLinks = [];
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));

if (linksFromLocalStorage) {
  myLinks = linksFromLocalStorage;
  render(myLinks);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLinks.push(tabs[0].url);
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
    render(myLinks);
  });
});

// Add the editLead() function
function editLead(index) {
  const newUrl = prompt("Enter the new URL for the lead:");
  if (newUrl) {
    myLinks[index] = newUrl;
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
    render(myLinks);
  }
}

function render(links) {
  let listItems = "";
  for (let i = 0; i < links.length; i++) {
    listItems += `
            <li>
                <a target='_blank' href='${links[i]}'>
                    ${links[i]}
                </a>
                <button class="edit-btn" onclick="editLead(${i})" id="edit-links">Edit</button>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLinks = [];
  render(myLinks);
});

inputBtn.addEventListener("click", function () {
  myLinks.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLinks", JSON.stringify(myLinks));
  render(myLinks);
});

sortingSelect.addEventListener("change", function () {
  const sortingOption = sortingSelect.value;
  if (sortingOption === "date") {
    myLinks.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });
  } else if (sortingOption === "alphabetical") {
    myLinks.sort((a, b) => a.localeCompare(b));
  }
  render(myLinks);
});
