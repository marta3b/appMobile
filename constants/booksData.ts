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
    plot: `Orgoglio e Pregiudizio racconta la storia delle cinque sorelle Bennet e della loro ricerca di matrimoni vantaggiosi nell'Inghilterra rurale del XIX secolo. La protagonista, Elizabeth Bennet, è una giovane intelligente e indipendente che incontra l'orgoglioso e ricco Mr. Darcy. Inizialmente il loro rapporto è segnato da incomprensioni e pregiudizi reciproci, ma attraverso varie vicissitudini, malintesi e rivelazioni, i due personaggi imparano a superare i loro difetti e a riconoscere il vero amore. Il romanzo esplora temi come le classi sociali, l'educazione, i pregiudizi e la natura del matrimonio.`,
    image: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
    publishedYear: 1813,
    pages: 432,
    rating: 4.7
  }

];

export const genreOrder = ['Giallo/Thriller', 'Romanzo storico', 'Romanzo rosa', 'Saggio/Non-fiction'];

export const booksByGenre: Record<string, Book[]> = {
  'Giallo/Thriller': booksData.filter(book => book.genre === 'Giallo/Thriller'),
  'Romanzo storico': booksData.filter(book => book.genre === 'Romanzo storico'),
  'Romanzo rosa': booksData.filter(book => book.genre === 'Romanzo rosa'),
  'Saggio/Non-fiction': booksData.filter(book => book.genre === 'Saggio/Non-fiction'),
};