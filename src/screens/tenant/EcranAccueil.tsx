import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../../theme/theme';
import { CarteAnnonce, EnTeteSection, Puce } from '../../components/commun/Composants';
import { ANNONCES_FICTIVES, TYPES_BIENS, TYPES_TRANSACTION } from '../../donnees/donneesFictives';
import { useApp } from '../../contexte/ContexteApp';
import { EnTete } from '../../components/EnTete';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EcranAccueil({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const { utilisateur, basculerFavori, estFavori, nombreNonLus } = useApp();
  const [requete, setRequete] = useState('');
  const [type, setType] = useState('Tous');
  const [typeTransaction, setTypeTransaction] = useState('Tous');

  const disponibles = (ANNONCES_FICTIVES || []).filter(l => l && l.statut === 'disponible');
  const aLaUne = disponibles.slice(0, 4);

  const resultats = (ANNONCES_FICTIVES || []).filter(l => {
    if (!l) return false;
    const correspType = type === 'Tous' || l.type === type;
    const correspTransaction = typeTransaction === 'Tous' || l.typeTransaction === typeTransaction;
    const correspRecherche =
      !requete ||
      l.titre?.toLowerCase().includes(requete.toLowerCase()) ||
      l.localisation?.toLowerCase().includes(requete.toLowerCase());
    return correspType && correspTransaction && correspRecherche && l.statut !== 'occupe';
  });

  return (
    <SafeAreaView style={s.conteneur}>

      {/* ── PARTIE FIXE (ne scroll pas) ── */}

      {/* En-tete */}
      <EnTete
        typeEnTete="accueil"
        nomUtilisateur={utilisateur?.nom}
        avatarUtilisateur={utilisateur?.avatar}
        nombreNotifications={nombreNonLus}
        onNotifications={() => navigation.navigate('Notifications')}
        onProfil={() => navigation.navigate('Profil')}
      />

      {/* Barre de recherche + bouton filtre */}
      <View style={s.zoneRecherche}>
        <View style={[s.barreRecherche, Ombres.sm]}>
          <Ionicons name="search-outline" size={19} color={Couleurs.texte.secondaire} />
          <TextInput
            style={s.saisieRecherche}
            placeholder="Chercher un logement..."
            placeholderTextColor={Couleurs.texte.clair}
            value={requete}
            onChangeText={setRequete}
          />
          {requete ? (
            <TouchableOpacity onPress={() => setRequete('')}>
              <Ionicons name="close-circle" size={18} color={Couleurs.texte.clair} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[s.boutonFiltre, Ombres.sm]}
          onPress={() => navigation.navigate('Recherche')}
        >
          <Ionicons name="options-outline" size={22} color={Couleurs.blanc} />
        </TouchableOpacity>
      </View>

      {/* Filtres transaction (fixes) */}
      <View style={s.zoneFiltres}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Espacement.base }}>
          {TYPES_TRANSACTION.map(t => (
            <Puce
              key={t}
              etiquette={t === 'Tous' ? 'Tous' : t === 'location' ? 'Location' : 'Vente'}
              selectionnee={typeTransaction === t}
              onPress={() => setTypeTransaction(t)}
            />
          ))}
          <View style={s.separateurVertical} />
          {TYPES_BIENS.map(t => (
            <Puce
              key={t}
              etiquette={t}
              selectionnee={type === t}
              onPress={() => setType(t)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── PARTIE SCROLLANTE ── */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* Banniere */}
        <LinearGradient
          colors={[Couleurs.primaire, '#B84200']}
          style={s.banniere}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.titreBanniere}>Trouvez votre{'\n'}logement ideal</Text>
            <Text style={s.sousBanniere}>{disponibles.length} logements disponibles</Text>
          </View>
          <Ionicons name="home" size={70} color="rgba(255,255,255,0.18)" />
        </LinearGradient>

        {/* A la une */}
        <View style={s.section}>
          <EnTeteSection
            titre="A la une"
            etiquetteAction="Voir tout"
            onAction={() => navigation.navigate('Recherche')}
          />
          <FlatList
            data={aLaUne}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarteAnnonce
                bien={item}
                onPress={() => navigation.navigate('DetailAnnonce', { annonce: item })}
                onFavori={() => basculerFavori(item.id)}
                estFavori={estFavori(item.id)}
                compact
              />
            )}
          />
        </View>

        {/* Tous les resultats */}
        <View style={[s.section, { paddingBottom: 20 }]}>
          <EnTeteSection
            titre={requete || type !== 'Tous' ? 'Resultats' : 'Annonces disponibles'}
            etiquetteAction={`${resultats.length} bien${resultats.length > 1 ? 's' : ''}`}
          />
          {resultats.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
              <Ionicons name="search-outline" size={44} color={Couleurs.texte.clair} />
              <Text style={{ fontSize: 15, color: Couleurs.texte.secondaire }}>Aucun logement trouve</Text>
              <TouchableOpacity onPress={() => { setRequete(''); setType('Tous'); setTypeTransaction('Tous'); }}>
                <Text style={{ color: Couleurs.primaire, fontWeight: '600', fontSize: 14 }}>Reinitialiser les filtres</Text>
              </TouchableOpacity>
            </View>
          ) : (
            resultats.map(item => (
              <CarteAnnonce
                key={item.id}
                bien={item}
                onPress={() => navigation.navigate('DetailAnnonce', { annonce: item })}
                onFavori={() => basculerFavori(item.id)}
                estFavori={estFavori(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },

  // Zone recherche fixe
  zoneRecherche: {
    flexDirection: 'row',
    paddingHorizontal: Espacement.base,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Couleurs.fond,
  },
  barreRecherche: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Couleurs.blanc,
    borderRadius: RayonBordure.lg,
    paddingHorizontal: 14,
    gap: 8,
    height: 48,
  },
  saisieRecherche: { flex: 1, fontSize: 14, color: Couleurs.texte.primaire },
  boutonFiltre: {
    width: 48,
    height: 48,
    borderRadius: RayonBordure.lg,
    backgroundColor: Couleurs.primaire,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Zone filtres fixe
  zoneFiltres: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.bordure,
    backgroundColor: Couleurs.fond,
  },
  separateurVertical: {
    width: 1,
    height: 24,
    backgroundColor: Couleurs.bordure,
    marginHorizontal: 8,
    alignSelf: 'center',
  },

  // Partie scrollante
  banniere: {
    marginHorizontal: Espacement.base,
    borderRadius: RayonBordure.xl,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Espacement.base,
    marginTop: Espacement.base,
    overflow: 'hidden',
  },
  titreBanniere: { fontSize: 21, fontWeight: '800', color: Couleurs.blanc, lineHeight: 28 },
  sousBanniere: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  section: { paddingHorizontal: Espacement.base, marginBottom: Espacement.lg },
});