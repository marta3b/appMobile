export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  plot: string;
  image: string;
  publishedYear?: number;
  pages?: number;
  rating?: number;
}

export const booksData: Book[] = [
  {
    id: '1',
    title: 'Orgoglio e Pregiudizio',
    author: 'Jane Austen',
    genre: 'Romanzo rosa',
    description: 'Una delle più famose storie d\'amore della letteratura inglese.',
    plot: `Orgoglio e Pregiudizio racconta...`,
    image: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1813,
    pages: 432,
    rating: 4.7
  },
  {
    id: '2',
    title: 'Il Nome della Rosa',
    author: 'Umberto Eco',
    genre: 'Giallo/Thriller',
    description: 'Un misterioso giallo medievale.',
    plot: `Nel 1327, il frate francescano Guglielmo da Baskerville...`,
    image: 'https://m.media-amazon.com/images/I/81pNKLAGThL._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1980,
    pages: 512,
    rating: 4.6
  },
  {
    id: '3',
    title: 'Harry Potter e la Pietra Filosofale',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'Il primo capitolo della saga del maghetto più famoso.',
    plot: `Harry Potter, un orfano cresciuto dagli zii spregevoli...`,
    image: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1997,
    pages: 320,
    rating: 4.8
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Saggio/Non-fiction',
    description: 'Una breve storia dell\'umanità.',
    plot: `Harari ripercorre la storia dell'Homo Sapiens...`,
    image: 'https://m.media-amazon.com/images/I/71K3c7ZbVXL._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 2011,
    pages: 541,
    rating: 4.6
  },
  {
    id: '5',
    title: 'I Pilastri della Terra',
    author: 'Ken Follett',
    genre: 'Romanzo storico',
    description: 'La costruzione di una cattedrale gotica.',
    plot: `Ambientato nell'Inghilterra del XII secolo...`,
    image: 'https://m.media-amazon.com/images/I/91F5WTFjM6L._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1989,
    pages: 973,
    rating: 4.6
  }
];

export const genres = [
  'Romanzo rosa', 
  'Giallo/Thriller', 
  'Fantasy', 
  'Saggio/Non-fiction', 
  'Romanzo storico'
];

export const genreOrder = ['Giallo/Thriller', 'Romanzo storico', 'Romanzo rosa', 'Fantasy', 'Saggio/Non-fiction'];

export const booksByGenre: Record<string, Book[]> = {
  'Giallo/Thriller': booksData.filter(book => book.genre === 'Giallo/Thriller'),
  'Romanzo storico': booksData.filter(book => book.genre === 'Romanzo storico'),
  'Fantasy': booksData.filter(book => book.genre === 'Fantasy'),
  'Romanzo rosa': booksData.filter(book => book.genre === 'Romanzo rosa'),
  'Saggio/Non-fiction': booksData.filter(book => book.genre === 'Saggio/Non-fiction'),
};