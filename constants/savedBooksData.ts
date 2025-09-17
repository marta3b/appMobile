import { Book } from './booksData';

let savedBooks: Book[] = [];

export const addBookToSaved = (book: Book, listName: string) => {
  // Verifica se il libro è già salvato
  if (!savedBooks.some(b => b.id === book.id)) {
    savedBooks.push(book);
  }
};

export const getSavedBooks = () => {
  return savedBooks;
};

export const removeBookFromSaved = (bookId: string) => {
  savedBooks = savedBooks.filter(book => book.id !== bookId);
};