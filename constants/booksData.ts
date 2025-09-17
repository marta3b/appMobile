export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  image: string;
  publishedYear?: number;
  pages?: number;
  rating?: number;
}

export const booksData: Book[] = [
  {
    id: '1',
    title: 'Il Nome della Rosa',
    author: 'Umberto Eco',
    genre: 'Romanzo storico',
    description: 'Un misterioso giallo medievale ambientato in un monastero benedettino.',
    image: 'https://m.media-amazon.com/images/I/81JcSw7auLL._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1980,
    pages: 512,
    rating: 4.5
  },

];

export const genreOrder = ['Giallo/Thriller', 'Romanzo storico', 'Romanzo rosa', 'Saggio/Non-fiction'];

export const booksByGenre: Record<string, Book[]> = {
  'Giallo/Thriller': booksData.filter(book => book.genre === 'Giallo/Thriller'),
  'Romanzo storico': booksData.filter(book => book.genre === 'Romanzo storico'),
  'Romanzo rosa': booksData.filter(book => book.genre === 'Romanzo rosa'),
  'Saggio/Non-fiction': booksData.filter(book => book.genre === 'Saggio/Non-fiction'),
};