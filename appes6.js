class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    //Create tr element
    const row = document.createElement("tr");
    //Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">&times;</a></td>
  `;
    //Insert row in the table
    list.appendChild(row);
  }

  showAlert(msg, className) {
    //Create div
    const div = document.createElement("div");
    //Add classes
    div.className = `alert ${className}`;
    //Add Text
    div.appendChild(document.createTextNode(msg));
    //Get parent
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    //Insert alert
    container.insertBefore(div, form.nextSibling);

    //Timeout after 3 seconds
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
      this.showAlert("Book deleted!", "success");
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

//Local Storage Class
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

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI();

      //Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//DOM Load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event listeners for add book
document.getElementById("book-form").addEventListener("submit", function(e) {
  e.preventDefault();
  //Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //Instantiate book
  const book = new Book(title, author, isbn);

  //Instantiate UI
  const ui = new UI();

  //Validate
  if (title === "" || author === "" || isbn === "") {
    //Error alert
    ui.showAlert("Please, fill in all fields", "error");
    return;
  } else {
    //Add book to list
    ui.addBookToList(book);

    //Add to Local storage
    Store.addBook(book);

    //Show success
    ui.showAlert("Book added!", "success");

    //Clear fields
    ui.clearFields();
  }
});

//Event Listener for delete book
document.getElementById("book-list").addEventListener("click", function(e) {
  e.preventDefault();
  //Instantiate UI
  const ui = new UI();

  //Delete Book
  ui.deleteBook(e.target);

  //Delete from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
