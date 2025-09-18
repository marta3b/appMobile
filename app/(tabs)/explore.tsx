import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { Book } from '@/constants/booksData';
import { getSavedBooks, removeBookFromSaved, onSavedBooksChange } from '@/constants/savedBooksData';
import Ionicons from '@expo/vector-icons/Ionicons';

// Variabile globale per i libri letti 
declare global {
  var readBooks: string[];
}
globalThis.readBooks = globalThis.readBooks || [];

export default function ProfileScreen() {
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [userName] = useState('Lettore Appassionato');

  useEffect(() => {
    const loadData = () => {
      const books = getSavedBooks();
      setSavedBooks(books);
      setReadBooksCount(globalThis.readBooks.length);
    };

    loadData();
    
    const unsubscribe = onSavedBooksChange(loadData);
    
    const interval = setInterval(() => {
      setReadBooksCount(globalThis.readBooks.length);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
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
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              removeBookFromSaved(item.id);
              alert(`"${item.title}" rimosso dai preferiti!`);
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#ff3b30" />
            <ThemedText style={styles.removeText}>Rimuovi</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B3B1B' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#74C365"
          name="person.crop.circle.fill"
          style={styles.headerImage}
        />
      }>
      
      <ThemedView style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image 
            source={require('@/assets/images/profile.png')}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.userName}>
              {userName}
            </ThemedText>
            <ThemedText style={styles.userStats}>
              {savedBooks.length} libri preferiti • {readBooksCount} libri letti
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {savedBooks.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Preferiti</ThemedText>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {readBooksCount}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Letti</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.favoritesSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          I tuoi Preferiti ({savedBooks.length})
        </ThemedText>

        {savedBooks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="heart-dislike" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Nessun libro nei preferiti
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Torna alla home e aggiungi i tuoi libri preferiti!
            </ThemedText>
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => router.push('/(tabs)')}
            >
              <ThemedText style={styles.homeButtonText}>Vai alla Home</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <FlatList
            data={savedBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.readSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Libri Letti ({readBooksCount})
        </ThemedText>

        {readBooksCount === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Nessun libro letto
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Inizia a leggere e segna i libri come letti!
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.readBooksList}>
            {savedBooks
              .filter(book => globalThis.readBooks.includes(book.id))
              .slice(0, 5) // Mostra solo i primi 5 per non appesantire
              .map(book => (
                <TouchableOpacity 
                  key={book.id}
                  style={styles.readBookItem}
                  onPress={() => router.push(`/book/${book.id}`)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#2E8B57" />
                  <ThemedText style={styles.readBookTitle} numberOfLines={1}>
                    {book.title}
                  </ThemedText>
                </TouchableOpacity>
              ))
            }
            {readBooksCount > 5 && (
              <ThemedText style={styles.moreText}>
                +{readBooksCount - 5} altri libri letti
              </ThemedText>
            )}
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.actionsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Azioni
        </ThemedText>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={20} color="#007AFF" />
          <ThemedText style={styles.actionButtonText}>Impostazioni</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
          <ThemedText style={styles.actionButtonText}>Guida e Supporto</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
          <ThemedText style={[styles.actionButtonText, { color: '#ff3b30' }]}>
            Esci
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  profileSection: {
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userStats: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  statNumber: {
    fontSize: 24,
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  favoritesSection: {
    padding: 20,
    marginBottom: 20,
  },
  readSection: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
  homeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  bookCard: {
    width: 150,
    marginRight: 12,
    marginBottom: 16,
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
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  removeText: {
    fontSize: 12,
    color: '#ff3b30',
    marginLeft: 4,
  },
  gridContainer: {
    justifyContent: 'space-between',
  },
  readBooksList: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  readBookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  readBookTitle: {
    marginLeft: 12,
    flex: 1,
    color: '#333',
  },
  moreText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
});