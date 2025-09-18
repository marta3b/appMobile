import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { booksData, Book, genres } from '@/constants/booksData';
import { addBookToSaved } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    if (params.genre) {
      setSelectedGenre(params.genre as string);
      filterBooks('', params.genre as string);
    }
  }, [params]);

  const filterBooks = (query: string, genre: string = '') => {
    let filtered = booksData;
    
    if (query) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (genre) {
      filtered = filtered.filter(book => book.genre === genre);
    }
    
    setFilteredBooks(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre('');
    filterBooks(query);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    filterBooks('', genre);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      onPress={() => {
        router.push(`/book/${item.id}`);
      }}
    >
      <ThemedView style={styles.bookCard}>
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
          <ThemedText style={styles.saveText}>Salva</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B3B1B' }}
          headerImage={
            <Image
              source={require('@/assets/images/libri-bho.png')}
            />
          }>

      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">Cerca</ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca libri o autori..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.genresSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Generi</ThemedText>
        <View style={styles.genresContainer}>
          {genres.map(genre => (
            <TouchableOpacity 
              key={genre} 
              style={[styles.genreButton, selectedGenre === genre && styles.genreButtonSelected]}
              onPress={() => handleGenreSelect(genre)}
            >
              <ThemedText style={[styles.genreButtonText, selectedGenre === genre && styles.genreButtonTextSelected]}>
                {genre}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.resultsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {selectedGenre ? `Risultati per ${selectedGenre}` : 
           searchQuery ? `Risultati per "${searchQuery}"` : 
           'Tutti i libri'}
        </ThemedText>
        
        <FlatList
          data={filteredBooks.length > 0 ? filteredBooks : booksData}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  genresSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreButtonSelected: {
    backgroundColor: '#2E8B57',
  },
  genreButtonText: {
    color: '#333',
  },
  genreButtonTextSelected: {
    color: 'white',
  },
  resultsSection: {
    paddingHorizontal: 16,
  },
  bookCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  authorText: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
  genreText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
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
});