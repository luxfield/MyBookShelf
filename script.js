const todos = [];
const RENDER_EVENT = "render-todo";
const STORAGE_KEY = "book";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(todoObject) {
  const { id, title, author, year, isCompleted } = todoObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "penulis : " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow", "list-book");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.textContent = "Kembalikan ke belum Dibaca";
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.textContent = "Hapus Judul Buku";
    trashButton.classList.add("hapus-buku");
    trashButton.addEventListener("click", function () {
      if (
        window.confirm(
          "Apakah Anda yakin ingin menghapus judul buku ini ? " + title
        )
      ) {
        removeTaskFromCompleted(id);
      }
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.textContent = "Tandai Sudah Dibaca";

    checkButton.classList.add("status-buku");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.textContent = "Hapus Judul Buku";
    trashButton.classList.add("hapus-buku");
    trashButton.addEventListener("click", function () {
      if (
        window.confirm(
          "Apakah Anda yakin ingin menghapus judul buku ini ? " + title
        )
      ) {
        removeTaskFromCompleted(id);
      }
    });

    container.append(checkButton, trashButton);
  }
  return container;
}

function addTodo() {
  const titleBook = document.getElementById("judul").value;
  const author = document.getElementById("penulis").value;
  const bookYear = document.getElementById("tahun").value;
  const isCompleted = document.getElementById("status-baca").checked;
  const generatedID = +new Date();
  const todoObject = generateTodoObject(
    generatedID,
    titleBook,
    author,
    bookYear,
    isCompleted
  );
  todos.push(todoObject);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function ubahstatus() {
  if (document.getElementById("status-baca").checked) {
    document.getElementById("submit").innerHTML =
      "Masukkan buku ke Rak <b>Sudah dibaca</b>";
  } else {
    document.getElementById("submit").innerHTML =
      "Masukkan buku ke Rak <b>Belum dibaca</b>";
  }
}

function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  const submitForm /* HTMLFormElement */ = document.getElementById("form-buku");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("belum-dibaca");
  const listCompleted = document.getElementById("sudah-dibaca");

  // clearing list item
  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});

function cariBuku() {
  const judulBuku = document.getElementById("cari-buku");
  if (judulBuku.value === "") {
    const uncompletedTODOList = document.getElementById("belum-dibaca");
    const listCompleted = document.getElementById("sudah-dibaca");
    // clearing list item
    uncompletedTODOList.innerHTML = "";
    listCompleted.innerHTML = "";

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (todoItem.isCompleted) {
        listCompleted.append(todoElement);
      } else {
        uncompletedTODOList.append(todoElement);
      }
    }
    const container = document.getElementById("jumlahPencarian");
    container.remove(container);
  } else {
    let searchTodo = [];
    for (let todo of todos) {
      if (todo.title.includes(judulBuku.value)) {
        searchTodo.push(todo);
      }
    }
    const uncompletedTODOList = document.getElementById("belum-dibaca");
    const listCompleted = document.getElementById("sudah-dibaca");
    const IdJumlahPencarian = document.getElementById("jumlahPencarian");
    if (IdJumlahPencarian) {
      IdJumlahPencarian.parentNode.removeChild(IdJumlahPencarian);
    }
    console.log(searchTodo);
    // clearing list item
    uncompletedTODOList.innerHTML = "";
    listCompleted.innerHTML = "";

    for (let todo of searchTodo) {
      const todoElement = makeTodo(todo);
      if (todo.isCompleted) {
        listCompleted.append(todoElement);
      } else {
        uncompletedTODOList.append(todoElement);
      }
    }

    const container = document.getElementsByClassName("form-cari-buku");
    const textContainer = document.createElement("div");
    textContainer.setAttribute("id", "jumlahPencarian");
    const textJumlahPencarian = document.createElement("p");
    textJumlahPencarian.innerText =
      "Ditemukan : " + document.getElementsByClassName("list-book").length;
    textContainer.append(textJumlahPencarian);
    container[0].append(textContainer);
  }
}
