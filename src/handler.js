const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push({
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  });

  const response = res.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name) {
    const lowercaseName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(lowercaseName)
    );
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const booksArray = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  const response = res.response({
    status: 'success',
    data: {
      books: booksArray,
    },
  });

  response.code(200);
  return response;
};



const getBooksByIdHandler = (req, res) => {
  const { id } = req.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = res.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBooksByIdHandler = (req, res) => {
  const { id } = req.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = req.payload;

  if(!name){
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if(readPage > pageCount){
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  
  if (index === -1) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  
  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name, year, author, summary, publisher, pageCount, readPage, reading,
    updatedAt,
  };
  
  const response = res.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBooksByIdHandler = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
