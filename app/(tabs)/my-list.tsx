import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Book } from '@/constants/booksData';
import { getSavedBooks, removeBookFromSaved, onSavedBooksChange } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MyListScreen() {
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  useEffect(() => {
  const loadSavedBooks = () => {
    const books = getSavedBooks();
    console.log('Libri caricati:', books.length);
    setSavedBooks(books);
  };

    loadSavedBooks();
    const unsubscribe = onSavedBooksChange(loadSavedBooks);
    return unsubscribe;
  }, []);

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
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                // Segna come letto
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#007AFF" />
              <ThemedText style={styles.actionText}>Letto</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                removeBookFromSaved(item.id);
                alert(`"${item.title}" rimosso dalla lista!`);
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#ff3b30" />
              <ThemedText style={styles.actionText}>Rimuovi</ThemedText>
            </TouchableOpacity>
          </View>
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
        <ThemedText type="title">La tua lista</ThemedText>
        <ThemedText style={styles.subtitle}>
          I libri che hai salvato per leggerli in seguito
        </ThemedText>
      </ThemedView>

      {savedBooks.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color="#ccc" />
          <ThemedText style={styles.emptyText}>
            La tua lista è vuota
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Esplora la libreria e aggiungi libri che vuoi leggere
          </ThemedText>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)')}
          >
            <ThemedText style={styles.exploreButtonText}>Esplora libreria</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.listSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            I tuoi libri ({savedBooks.length})
          </ThemedText>
          
          <FlatList
            data={savedBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 60,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
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
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  bookCard: {
    width: '48%',
    marginBottom: 16,
    marginRight: '4%',
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
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
  genreText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  gridContainer: {
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});