let bookMarkName = document.getElementById("bookMarkName");
let bookMarkURL = document.getElementById("bookMarkURL");
let submitBtn = document.getElementById("submitBtn");
let closeBtn = document.getElementById("closeBtn");
let BoxExit = document.getElementById("BoxExit");
let alertBox = document.querySelector(".box-info");
let warningBox = document.querySelector(".box-information");
let search = document.querySelector("#search");
let arrInfo = JSON.parse(localStorage.getItem("info")) ?? [];
updateMood = false;
let index;
display();

submitBtn.addEventListener("click", function () {
  let info = {
    Name: capitalize(bookMarkName.value),
    URL: bookMarkURL.value,
  };
  if (updateMood) {
    update(info);
  } else {
    if (
      bookMarkName.classList.contains("is-valid") &&
      bookMarkURL.classList.contains("is-valid")
    ) {
      Swal.fire({
        title: "Success!",
        text: "The Data were added successfully!",
        icon: "success",
        timer: 1500,
      });
      arrInfo.push(info);
      changing();
      clear();
      bookMarkName.classList.remove("is-valid");
      bookMarkURL.classList.remove("is-valid");
    } else {
      alertBox.classList.remove("d-none");
    }
  }
});

function clear() {
  bookMarkName.value = "";
  bookMarkURL.value = "";
}
function changing() {
  localStorage.setItem("info", JSON.stringify(arrInfo));
  display();
}

function display() {
  let collector = "";
  let found = false;
  for (let i = 0; i < arrInfo.length; i++) {
    if (arrInfo[i].Name.toLowerCase().includes(search.value.toLowerCase())) {
      index = i;
      collector += `
        <tr>
          <td>${i + 1}</td>
          <td>${arrInfo[i].Name}</td>
          <td>${arrInfo[i].URL}</td>
          <td>
            <button onclick="visit(${i})" class="btn btn-outline-success">
              <i class="fa-solid fa-eye pe-2"></i>Visit
            </button>
          </td>
          <td>
            <button onclick="semiUpdate(${i})" class="btn btn-outline-warning">
              <i class="fa-solid fa-eye pe-2"></i>Update
            </button>
          </td>
          <td>
            <button onclick="deleteInfo(${i})" class="btn btn-outline-danger">
              <i class="fa-solid fa-trash-can pe-2"></i>Delete
            </button>
          </td>
        </tr>`;
      found = true;
    }
  }
  if (!found && arrInfo.length !== 0) {
    collector = `
      <tr>
        <td colspan="6">No results found</td>
      </tr>
    `;
  }
  document.getElementById("tableBody").innerHTML = collector;
}

function deleteInfo(i) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your Data has been deleted.",
        icon: "success",
      });
      arrInfo.splice(i, 1);
      changing();
      clear();
    }
  });
}

function visit(e) {
  let httpsRgx = /^https?:\/\//;
  if (httpsRgx.test(arrInfo[e].URL)) {
    open(arrInfo[e].URL);
  } else {
    open(`https://${arrInfo[e].URL}`);
  }
}

let nameRgx = /^\w{3,}(\s+\w+)*$/;
let urlRgx =
  /^(https?:\/\/)?(www\.)?[\w.-]+\.\w{2,}(\/?(:\d{2,5})?(\/[\w.-]*)*)?$/;

bookMarkName.addEventListener("input", function () {
  validate(bookMarkName, nameRgx);
});

bookMarkURL.addEventListener("input", function () {
  validate(bookMarkURL, urlRgx);
});

function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}
function capitalize(str) {
  if (!str) return "";
  let stringArr = str.split("");
  stringArr[0] = stringArr[0].toUpperCase();
  return stringArr.join("");
}

function closeBox() {
  alertBox.classList.add("d-none");
}
function BoxOut() {
  warningBox.classList.add("d-none");
}

closeBtn.addEventListener("click", closeBox);
BoxExit.addEventListener("click", BoxOut);

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeBox();
  }
});
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-information")) {
    BoxOut();
  }
});

search.addEventListener("input", () => {
  display();
});

function semiUpdate(i) {
  index = i;
  updateMood = true;
  submitBtn.innerHTML = "Update";
  bookMarkName.value = arrInfo[i].Name;
  bookMarkURL.value = arrInfo[i].URL;
}
function update(newData) {
  if (
    bookMarkName.classList.contains("is-valid") &&
    bookMarkURL.classList.contains("is-valid")
  ) {
    arrInfo.splice(index, 1, newData);
    submitBtn.innerHTML = "Submit";
    updateMood = false;
    changing();
    clear();
    bookMarkName.classList.remove("is-valid");
    bookMarkURL.classList.remove("is-valid");
    Swal.fire({
      title: "Success!",
      text: "The Data was updated successfully!",
      icon: "success",
      timer: 1500,
    });
  } else {
    warningBox.classList.remove("d-none");
  }
}
