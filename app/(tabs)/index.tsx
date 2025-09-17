import { useState } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { booksData, booksByGenre, genreOrder, Book } from '@/constants/booksData';
import { addBookToSaved } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(booksData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredBooks(booksData);
    } else {
      const filtered = booksData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      onPress={() => {
        router.push(`/book/${item.id}`);
      }}
    >
      <ThemedView style={styles.bookCard}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.bookImage}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.bookInfo}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.title}</ThemedText>
          <ThemedText type="default" style={styles.authorText}>{item.author}</ThemedText>
          <ThemedText type="subtitle" style={styles.genreText}>{item.genre}</ThemedText>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={(e) => {
              e.stopPropagation();
              addBookToSaved(item, 'preferiti');
              alert(`"${item.title}" aggiunto ai preferiti!`);
            }}
          >
            <Ionicons name="heart-outline" size={16} color="#ff3b30" />
            <ThemedText style={styles.saveText}>Aggiungi ai preferiti</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderGenreSection = (genre: string) => {
    const books = booksByGenre[genre];
    if (!books || books.length === 0) return null;
    
    return (
      <View key={genre} style={styles.genreSection}>
        <ThemedText type="title" style={styles.genreTitle}>{genre}</ThemedText>
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Libreria</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca libri, autori o generi..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </ThemedView>

      {searchQuery ? (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Risultati della ricerca ({filteredBooks.length})</ThemedText>
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        </ThemedView>
      ) : (
        <ScrollView>
          {genreOrder.map(renderGenreSection)}
        </ScrollView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Esplora la tua libreria</ThemedText>
        <ThemedText>
          Premi{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          per aprire gli strumenti di sviluppo.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Vedi i tuoi preferiti</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Azione" icon="heart" onPress={() => alert('Azione preferiti')} />
          </Link.Menu>
        </Link>
        <ThemedText>
          Vai alla sezione Preferiti per vedere i libri che hai salvato.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  genreSection: {
    marginBottom: 24,
  },
  genreTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 20,
  },
  bookCard: {
    width: 150,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  bookImage: {
    width: '100%',
    height: 200,
  },
  bookInfo: {
    padding: 8,
  },
  authorText: {
    fontSize: 12,
    marginTop: 2,
  },
  genreText: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  gridContainer: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {
    fontSize: 12,
    color: '#ff3b30',
    marginLeft: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});