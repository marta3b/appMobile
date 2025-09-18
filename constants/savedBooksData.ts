import { Book } from './booksData';

const STORAGE_KEY = 'libro_saved_books';
const listeners: Array<() => void> = [];

// Funzione per notificare tutti i listener
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Carica i libri salvati dal localStorage all'inizio
const loadSavedBooks = (): Book[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Errore nel caricamento dei libri salvati:', error);
    return [];
  }
};

// Salva i libri nel localStorage
const saveBooksToStorage = (books: Book[]) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  } catch (error) {
    console.error('Errore nel salvataggio dei libri:', error);
  }
};

// Inizializza con i libri salvati dal localStorage
let savedBooks: Book[] = loadSavedBooks();

export const addBookToSaved = (book: Book, listName: string) => {
  if (!savedBooks.some(b => b.id === book.id)) {
    savedBooks.push(book);
    saveBooksToStorage(savedBooks); // <-- SALVA NEL LOCALSTORAGE
    notifyListeners();
  }
};

export const getSavedBooks = () => {
  return [savedBooks];
};

export const removeBookFromSaved = (bookId: string) => {
  savedBooks = savedBooks.filter(book => book.id !== bookId);
  saveBooksToStorage(savedBooks); // <-- SALVA NEL LOCALSTORAGE
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