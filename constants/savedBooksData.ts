import { Book } from './booksData';

let savedBooks: Book[] = [];
const listeners: Array<() => void> = [];

// Funzione per notificare tutti i listener
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const addBookToSaved = (book: Book, listName: string) => {
  if (!savedBooks.some(b => b.id === book.id)) {
    savedBooks.push(book);
    notifyListeners();
  }
};

export const getSavedBooks = (): Book[] => {
  return savedBooks; // Restituisce una copia dell'array
};

export const removeBookFromSaved = (bookId: string) => {
  savedBooks = savedBooks.filter(book => book.id !== bookId);
  notifyListeners();
};

export const onSavedBooksChange = (callback: () => void) => {
  listeners.push(callback);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};