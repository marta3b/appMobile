import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { booksData } from '@/constants/booksData';
import { addBookToSaved } from '@/constants/savedBooksData';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const book = booksData.find(b => b.id === id);

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Libro non trovato</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">{book.title}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.bookContainer}>
        <Image 
          source={{ uri: book.image }} 
          style={styles.bookImage}
          contentFit="cover"
          transition={1000}
        />
        
        <ThemedView style={styles.detailsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title}>{book.title}</ThemedText>
          <ThemedText type="default" style={styles.author}>di {book.author}</ThemedText>
          <ThemedText type="subtitle" style={styles.genre}>{book.genre}</ThemedText>
          
          {/* DESCRIZIONE E TRAMA PRIMA DEI DETTAGLI TECNICI */}
          <ThemedText style={styles.sectionTitle}>Descrizione</ThemedText>
          <ThemedText style={styles.description}>{book.description}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Trama</ThemedText>
          <ThemedText style={styles.plot}>{book.plot}</ThemedText>
          
          {/* DETTAGLI TECNICI SEMPLICI DOPO LA TRAMA */}
          <View style={styles.technicalDetails}>
            {book.publishedYear && (
              <ThemedText style={styles.detail}>Anno di pubblicazione: {book.publishedYear}</ThemedText>
            )}
            
            {book.pages && (
              <ThemedText style={styles.detail}>Pagine: {book.pages}</ThemedText>
            )}
            
            {book.rating && (
              <ThemedText style={styles.detail}>
                Valutazione: {book.rating}/5
                <Ionicons name="star" size={16} color="#FFD700" style={styles.starIcon} />
              </ThemedText>
            )}
          </View>
          
          {/* BOTTONI SEMPLICI */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.simpleButton}
              onPress={() => {
                addBookToSaved(book, 'preferiti');
                alert(`"${book.title}" aggiunto ai preferiti!`);
              }}
            >
              <Ionicons name="heart-outline" size={20} color="#ff3b30" />
              <ThemedText style={styles.simpleButtonText}>Aggiungi ai preferiti</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.simpleButton}
              onPress={() => Linking.openURL(`https://www.amazon.it/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`)}
            >
              <Ionicons name="search-outline" size={20} color="#007AFF" />
              <ThemedText style={styles.simpleButtonText}>Cerca online per acquistare</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  bookContainer: {
    padding: 16,
  },
  bookImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  genre: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#eee',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    color: '#eee',
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#eee',
    textAlign: 'justify',
    marginBottom: 20,
  },
  technicalDetails: {
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#eee',
  },
  starIcon: {
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  simpleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#b882b8ff',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  simpleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});