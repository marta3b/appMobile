import { useState } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { booksData, booksByGenre, genreOrder, Book, genres } from '@/constants/booksData';
import { addBookToSaved } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(booksData);

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      setFilteredBooks(booksData);
    } else {
      setSelectedGenre(genre);
      const filtered = booksData.filter(book => book.genre === genre);
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
            <ThemedText style={styles.saveText}>Salva</ThemedText>
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
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B3B1B' }}
      headerImage={
        <Image
          source={require('@/assets/images/libri-bho.png')}
          style={styles.headerImage}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Shelfy</ThemedText>
        <ThemedText style={styles.subtitle}>La tua libreria personale</ThemedText>
      </ThemedView>

      <ThemedView style={styles.popularSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          {selectedGenre ? `Libri di genere: ${selectedGenre}` : 'Generi popolari'}
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
          {genres.map(genre => (
            <TouchableOpacity 
              key={genre} 
              style={[
                styles.genrePill,
                selectedGenre === genre && styles.genrePillSelected
              ]}
              onPress={() => handleGenreSelect(genre)}
            >
              <ThemedText style={[
                styles.genrePillText,
                selectedGenre === genre && styles.genrePillTextSelected
              ]}>
                {genre}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {selectedGenre ? (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            {filteredBooks.length} libro{filteredBooks.length !== 1 ? 'i' : ''} trovati
          </ThemedText>
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
          Seleziona un genere per filtrare i libri o scorri per scoprire tutte le categorie.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImage: {
    width: '100%',
    height: 200,
  },
  bookInfo: {
    padding: 12,
  },
  authorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  genreText: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },
  gridContainer: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
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
  headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  popularSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
  },
  genreScroll: {
    paddingVertical: 8,
  },
  genrePill: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  genrePillSelected: {
    backgroundColor: '#2E8B57',
  },
  genrePillText: {
    color: '#2E8B57',
    fontWeight: '500',
  },
  genrePillTextSelected: {
    color: 'white',
  },
});