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

export default function ProfileScreen() {
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [userName] = useState('Lettore Appassionato');

  useEffect(() => {
    const loadSavedBooks = () => {
      const books = getSavedBooks();
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
              {savedBooks.length} libri preferiti
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
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {savedBooks.filter(book => book.rating && book.rating >= 4).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Altamente valutati</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {Math.floor(savedBooks.length * 0.6)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>In lettura</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.favoritesSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          I tuoi Preferiti
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
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
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