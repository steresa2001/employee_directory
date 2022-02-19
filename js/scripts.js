/**
 * Gallery
 * @type {object}
 * Modal button container
 * @type {object}
 */
const gallery = document.querySelector("#gallery");
const modalPaginationContainer = document.querySelector(".modal-btn-container");

/**
 * Controls visibility of pagination for modal
 * @param {array<object>} data - Data of all employees
 * @param {number} cardNum - Number for card
 * @param {object} prevBtn - Previous modal pagination button
 * @param {object} nextBtn - Next modal pagination button
 * @returns {void}
 */
function showHideModalPagination(data, cardNum, prevBtn, nextBtn) {
  cardNum === 0
    ? (prevBtn.style.display = "none")
    : (prevBtn.style.display = "inherit");
  cardNum === data.length - 1
    ? (nextBtn.style.display = "none")
    : (nextBtn.style.display = "inherit");
  if (data.length - 1 === 0) {
    document.querySelector(".modal-btn-container").style.display = "none";
  }
}

/**
 * Handles modal pagination functionality
 * @param {array<object>} data - Data of all employees
 * @param {number} cardNum - Number for card
 * @returns {void}
 */
function modalPagination(data, cardNum) {
  const prevBtn = document.querySelector("#modal-prev");
  const nextBtn = document.querySelector("#modal-next");
  cardNum = parseInt(cardNum);

  showHideModalPagination(data, cardNum, prevBtn, nextBtn);

  prevBtn.onclick = () => {
    cardNum--;
    showHideModalPagination(data, cardNum, prevBtn, nextBtn);
    setEmployeeInfoForModal(data, cardNum);
  };
  nextBtn.onclick = () => {
    cardNum++;
    showHideModalPagination(data, cardNum, prevBtn, nextBtn);
    setEmployeeInfoForModal(data, cardNum);
  };
}
/**
 * Gets employee info for modal
 * @param {object} e - Gets event
 * @param {array<object>} data - Data of all employees
 * @returns {array<object>}
 */
function getEmployeeInfoForModal(e, data) {
  const uuid = e.currentTarget.lastElementChild.value;
  return data.filter((person) => {
    return person.login.uuid === uuid;
  });
}
/**
 * Handles closing of modal
 * @returns {void}
 */
function closeModal() {
  const closeBtn = document.querySelector("#modal-close-btn");
  const modal = document.querySelector(".modal-container");
  const body = document.querySelector("body");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  body.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-container")) {
      modal.style.display = "none";
    }
  });
}
/**
 * Handles opening of the modal
 * @param {object} cards
 * @param {array<object>} data - Data of all employees
 * @returns {void}
 */
function openModal(cards, data) {
  cards.forEach((e) => {
    e.addEventListener("click", (e) => {
      const currentCard = e.currentTarget.getAttribute("data-card");
      const employee = getEmployeeInfoForModal(e, data);
      setEmployeeInfoForModal(employee);
      document.querySelector(".modal-container").style = "display: block;";
      modalPagination(data, currentCard);
    });
  });
}
/**
 * Filters data based on search query
 * @param {array<object>} data - Data of all employees
 * @returns {array<object>}
 */
function returnSearchResults(data) {
  const searchValue = document.querySelector("#search-input").value;
  return data.results.filter((item) => {
    const fullName = `${item.name.first} ${item.name.last}`;
    return fullName.toLowerCase().indexOf(searchValue) !== -1;
  });
}
/**
 * Adds message if no search results
 * @param {number} results - Number of search results
 * @returns {void}
 */
function noSearchResultsMessage(results) {
  const noResults = document.querySelector("#no-results");
  if (results > 0) {
    noResults.classList.add("hide");
    noResults.classList.remove("no-results");
  } else {
    noResults.classList.remove("hide");
    noResults.classList.add("no-results");
  }
}
/**
 * Handles functionality for performing search queries
 * @param {object} element - DOM element
 * @param {string} action - Event type
 * @param {array<object>} data - Data of all employees
 * @returns {void}
 */
function triggerSearch(element, action, data) {
  element.addEventListener(action, () => {
    const filteredResults = returnSearchResults(data);
    noSearchResultsMessage(filteredResults.length);
    gallery.innerHTML = "";
    generateUserCards(filteredResults);
    const cards = document.querySelectorAll(".card");
    openModal(cards, filteredResults);
  });
}

/**
 * Fetch request
 */
fetch("https://randomuser.me/api/?results=12&nat=US")
  .then((response) => response.json())
  .then((data) => {
    // Call functions after data has been successfully returned
    generateUserCards(data.results);
    createModalTemplate();
    generateSearchForm();

    const cards = document.querySelectorAll(".card");
    const searchInput = document.querySelector("#search-input");

    searchInput.addEventListener("focus", () => {
      searchInput.classList.add("search-input-on");
      searchInput.classList.remove("search-input-off");
    });
    searchInput.addEventListener("blur", () => {
      searchInput.classList.add("search-input-off");
      searchInput.classList.remove("search-input-on");
    });

    triggerSearch(searchInput, "keyup", data);
    openModal(cards, data.results);
    closeModal();
  })
  .catch((error) => console.log(error));
/**
 * Creates a card for each user
 * @param {array<object>} data - Data of all employees
 * @returns {void}
 */
function generateUserCards(data) {
  const html = data
    .map(
      (item, index) => `
     <div class="card" data-card="${index}">
        <div class="card-img-container">
            <img class="card-img" src="${item.picture.thumbnail}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
            <p class="card-text">${item.email}</p>
            <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
        </div>
        <input class="js-uuid" type="hidden" value="${item.login.uuid}">
     </div>
     `
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", html);
}
/**
 * Creates the template for the modal
 * @returns {void}
 */
function createModalTemplate() {
  const html = `
    <div class="modal-container" style="display:none;">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                // Dynamic user info goes here
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `;
  document.querySelector("body").insertAdjacentHTML("beforeend", html);
}
/**
 * Gets day of month
 * @param {number} num - Gets the day of the month
 * @returns {number}
 */
function getDay(num) {
  let day = new Date(num);
  day = day.getUTCDate();
  if (day < 10) return `0${day}`;
  return day;
}
/**
 * Gets month
 * @param {number} num - Gets the month
 * @returns {number}
 */
function getMonth(num) {
  let month = new Date(num);
  month = month.getMonth() + 1;
  if (month > 0 && month < 10) return `0${month}`;
  return month;
}
/**
 * Gets the year
 * @param {number} num - Gets the full year
 * @returns {number}
 */
function getYear(num) {
  const year = new Date(num);
  return year.getFullYear();
}
/**
 * Sets the DOB in required format
 * @param {number} num
 * @returns {string}
 */
function formatDob(num) {
  const month = getMonth(num);
  const day = getDay(num);
  const year = getYear(num);
  const dob = `${month}/${day}/${year}`;
  return dob;
}
/**
 * Creates employee info for modal
 * @param {array<object>} data - Data of all employees
 * @param {number} index - Default parameter for number of card
 * @returns {void}
 */
function setEmployeeInfoForModal(data, index = 0) {
  const html = `
    <img class="modal-img" src="${
      data[index].picture.medium
    }" alt="profile picture">
    <h3 id="name" class="modal-name cap">${data[index].name.first} ${
    data[index].name.last
  }</h3>
    <p class="modal-text">${data[index].email}</p>
    <p class="modal-text cap">${data[index].location.city}</p>
    <hr>
    <p class="modal-text">${data[index].phone}</p>
    <p class="modal-text">${data[index].location.street.number} ${
    data[index].location.street.name
  }, ${data[index].location.city}, ${data[index].location.state}, ${
    data[index].location.postcode
  }</p>
    <p class="modal-text">Birthday: ${formatDob(data[index].dob.date)}</p>
        `;
  // Clear HTML before inserting new HTML
  document.querySelector(".modal-info-container").innerHTML = "";
  document
    .querySelector(".modal-info-container")
    .insertAdjacentHTML("beforeend", html);
}
/**
 * Creates HTML for search
 * @returns {void}
 */
function generateSearchForm() {
  const html = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
    </form>
    `;

  document
    .querySelector(".search-container")
    .insertAdjacentHTML("beforeend", html);
}
