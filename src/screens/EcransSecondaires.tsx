import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { EmptyState, ListingCard } from '../composants/index';
import { MOCK_LISTINGS, MOCK_NOTIFICATIONS, PROPERTY_TYPES, DISTRICTS, TYPES_TRANSACTION } from '../constants/mockData';
import { useApp } from '../contexte/ContexteApp';

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export function EcranNotifications({ navigation }: any) {
  const { notifications, marquerToutLu } = useApp();
  const META_NOTIF: Record<string, { icone: string; couleur: string }> = {
    nouvelle_annonce:   { icone: 'home',       couleur: Colors.primary },
    message:            { icone: 'chatbubble', couleur: Colors.secondary },
    mise_a_jour_statut: { icone: 'sync',       couleur: Colors.accent },
    avis:               { icone: 'star',       couleur: Colors.accent },
  };
  return (
    <SafeAreaView style={s.conteneur}>
      <View style={s.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={s.titre}>Notifications</Text>
        <TouchableOpacity onPress={marquerToutLu}><Text style={s.toutLire}>Tout lire</Text></TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.base }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => {
          const meta = META_NOTIF[item.type] ?? { icone: 'notifications', couleur: Colors.primary };
          return (
            <TouchableOpacity style={[s.carteNotif, !item.lu && s.carteNonLue, Shadows.sm]} activeOpacity={0.7}>
              <View style={[s.iconeNotif, { backgroundColor: meta.couleur + '20' }]}>
                <Ionicons name={meta.icone as any} size={22} color={meta.couleur} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.titreNotif, !item.lu && { fontWeight: '700' }]}>{item.titre}</Text>
                <Text style={s.corpsNotif} numberOfLines={2}>{item.corps}</Text>
                <Text style={s.heureNotif}>{item.heure}</Text>
              </View>
              {!item.lu && <View style={s.pointNonLu} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 80 }}>
            <Ionicons name="notifications-outline" size={55} color={Colors.text.light} />
            <Text style={{ fontSize: 15, color: Colors.text.secondary }}>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
export const NotificationsScreen = EcranNotifications;

// ─── FAVORIS ─────────────────────────────────────────────────────────────────
export function EcranFavoris({ navigation }: any) {
  const { favoris, basculerFavori, estFavori } = useApp();
  const listeFavoris = MOCK_LISTINGS.filter(l => favoris.includes(l.id));
  return (
    <SafeAreaView style={s.conteneur}>
      <View style={s.entete}>
        <Text style={s.titre}>Mes Favoris</Text>
        <Text style={s.compteur}>{listeFavoris.length} logement{listeFavoris.length !== 1 ? 's' : ''}</Text>
      </View>
      {listeFavoris.length === 0 ? (
        <EmptyState icon="heart-outline" title="Aucun favori" description="Appuyez sur le cœur d'une annonce pour l'ajouter ici" actionLabel="Parcourir les logements" onAction={() => navigation.navigate('Recherche')} />
      ) : (
        <FlatList
          data={listeFavoris}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: Spacing.base }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard item={item} onPress={() => navigation.navigate('ListingDetail', { listing: item })} onFavorite={() => basculerFavori(item.id)} isFav={estFavori(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
export const FavoritesScreen = EcranFavoris;

// ─── RECHERCHE ────────────────────────────────────────────────────────────────
export function EcranRecherche({ navigation }: any) {
  const { basculerFavori, estFavori, filtresRecherche, definirFiltresRecherche } = useApp();
  const [typeFiltre, setTypeFiltre] = useState('Tous');
  const [quartierFiltre, setQuartierFiltre] = useState('Tous');
  const [transactionFiltre, setTransactionFiltre] = useState('Tous');

  const resultats = MOCK_LISTINGS.filter(l => {
    const corrType = typeFiltre === 'Tous' || l.type === typeFiltre;
    const corrQuartier = quartierFiltre === 'Tous' || l.district === quartierFiltre;
    const corrTransaction = transactionFiltre === 'Tous' || l.typeTransaction === transactionFiltre.toLowerCase();
    return corrType && corrQuartier && corrTransaction;
  });

  return (
    <SafeAreaView style={s.conteneur}>
      <View style={s.entete}>
        <Text style={s.titre}>Recherche</Text>
        <Text style={s.compteur}>{resultats.length} résultat{resultats.length !== 1 ? 's' : ''}</Text>
      </View>
      <View style={{ paddingHorizontal: Spacing.base }}>
        <Text style={s.labelFiltre}>Transaction</Text>
        <View style={s.rangeeFiltre}>
          {TYPES_TRANSACTION.map(t => (
            <TouchableOpacity key={t} style={[s.boutonFiltre, transactionFiltre === t && s.boutonFiltreActif]} onPress={() => setTransactionFiltre(t)}>
              <Text style={[s.texteFiltre, transactionFiltre === t && { color: Colors.white }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.labelFiltre}>Type de bien</Text>
        <FlatList data={PROPERTY_TYPES} keyExtractor={t => t} horizontal showsHorizontalScrollIndicator={false}
          renderItem={({ item: t }) => (
            <TouchableOpacity style={[s.boutonFiltre, typeFiltre === t && s.boutonFiltreActif, { marginRight: 8 }]} onPress={() => setTypeFiltre(t)}>
              <Text style={[s.texteFiltre, typeFiltre === t && { color: Colors.white }]}>{t}</Text>
            </TouchableOpacity>
          )}
        />
        <Text style={s.labelFiltre}>Quartier</Text>
        <FlatList data={DISTRICTS} keyExtractor={d => d} horizontal showsHorizontalScrollIndicator={false}
          renderItem={({ item: d }) => (
            <TouchableOpacity style={[s.boutonFiltre, quartierFiltre === d && s.boutonFiltreActif, { marginRight: 8 }]} onPress={() => setQuartierFiltre(d)}>
              <Text style={[s.texteFiltre, quartierFiltre === d && { color: Colors.white }]}>{d}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={resultats}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.base }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard item={item} onPress={() => navigation.navigate('ListingDetail', { listing: item })} onFavorite={() => basculerFavori(item.id)} isFav={estFavori(item.id)} />
        )}
        ListEmptyComponent={<EmptyState icon="search-outline" title="Aucun résultat" description="Essayez de modifier vos filtres" />}
      />
    </SafeAreaView>
  );
}
export const SearchScreen = EcranRecherche;

// ─── ÉCRAN CARTE ──────────────────────────────────────────────────────────────
export function EcranCarte({ route, navigation }: any) {
  const annonces = route.params?.listings ?? MOCK_LISTINGS.filter(l => l.status === 'available');
  return (
    <SafeAreaView style={s.conteneur}>
      <View style={s.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={s.titre}>Carte</Text>
        <Text style={s.compteur}>{annonces.length} logements</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.secondary + '10' }}>
        <Ionicons name="map" size={60} color={Colors.secondary} />
        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.secondary, marginTop: 12 }}>
          Carte interactive
        </Text>
        <Text style={{ fontSize: 13, color: Colors.text.secondary, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 }}>
          Installez react-native-maps pour afficher la carte des {annonces.length} logements
        </Text>
      </View>
    </SafeAreaView>
  );
}
export const MapScreen = EcranCarte;

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Colors.background },
  entete: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  titre: { flex: 1, fontSize: 20, fontWeight: '800', color: Colors.text.primary },
  toutLire: { fontSize: 13, color: Colors.secondary, fontWeight: '600' },
  compteur: { fontSize: 13, color: Colors.text.secondary },
  carteNotif: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, gap: 12 },
  carteNonLue: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  iconeNotif: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titreNotif: { fontSize: 14, fontWeight: '600', color: Colors.text.primary, marginBottom: 3 },
  corpsNotif: { fontSize: 13, color: Colors.text.secondary, lineHeight: 18, marginBottom: 5 },
  heureNotif: { fontSize: 11, color: Colors.text.light },
  pointNonLu: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginTop: 4 },
  labelFiltre: { fontSize: 13, fontWeight: '600', color: Colors.text.primary, marginVertical: 8 },
  rangeeFiltre: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  boutonFiltre: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  boutonFiltreActif: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  texteFiltre: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
});
