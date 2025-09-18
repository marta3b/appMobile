import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { booksData, Book } from '@/constants/booksData';
import { addBookToSaved } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(booksData);

  const filterBooks = (query: string) => {
    if (query === '') {
      setFilteredBooks(booksData);
    } else {
      const filtered = booksData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterBooks(query);
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B3B1B' }}
      headerImage={
        <Image
          source={require('@/assets/images/libri-bho.png')}
          style={styles.headerImage}
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
            autoFocus={true}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.resultsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {searchQuery ? `Risultati per "${searchQuery}" (${filteredBooks.length})` : 'Tutti i libri'}
        </ThemedText>
        
        {filteredBooks.length === 0 && searchQuery ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Nessun risultato trovato
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Prova con un termine di ricerca diverso
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.horizontalList}
          />
        )}
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
    fontSize: 16,
  },
  resultsSection: {
    paddingHorizontal: 16,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  horizontalList: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  bookCard: {
    width: 150,
    marginRight: 16,
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});