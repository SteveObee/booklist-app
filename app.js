// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    list.appendChild(row);
  }

  // delete a book
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  // Show alert message
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} mt-4`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
  // Clear the entry fields
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
// Store class handles storage
class Store {
  static getBooks() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBooks(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", e => {
  // Prevent Default
  e.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  // Validate input
  if ((title === "") | (author === "") | (isbn === "")) {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate Book
    const book = new Book(title, author, isbn);
    // add book to list
    UI.addBookToList(book);
    // Add book to storage
    Store.addBooks(book);
    // Alert: Book added
    UI.showAlert("Book Added", "success");
    // Clear the fields
    UI.clearFields();
  }
});
// Event:Remove a book
document.querySelector("#book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show removal alert
  UI.showAlert("Book Removed", "success");
});
