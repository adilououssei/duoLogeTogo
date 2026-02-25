import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../theme/theme';
import { CarteAnnonce } from '../components/commun/Composants';
import { ANNONCES_FICTIVES, TYPES_BIENS, QUARTIERS } from '../donnees/donneesFictives';
import { useApp } from '../contexte/ContexteApp';
import { Bien } from '../types/modeles';

const PRIX_MAX = 500000;

export default function EcranRecherche({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const { basculerFavori, estFavori } = useApp(); // ✅ ajout du context pour favoris
  const [recherche, setRecherche] = useState('');
  const [typeBien, setTypeBien] = useState('Tous');
  const [typeTransaction, setTypeTransaction] = useState('Tous');
  const [quartier, setQuartier] = useState('Tous');
  const [prixMax, setPrixMax] = useState(PRIX_MAX);
  const [afficherFiltres, setAfficherFiltres] = useState(true);

  const resultats: Bien[] = (ANNONCES_FICTIVES || []).filter(a => {
    if (!a || !a.titre || !a.localisation) return false;
    const correspondRecherche =
      recherche.trim() === '' ||
      a.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      a.localisation.toLowerCase().includes(recherche.toLowerCase());
    const correspondType = typeBien === 'Tous' || a.type === typeBien;
    const correspondTransaction = typeTransaction === 'Tous' || a.typeTransaction === typeTransaction;
    const correspondQuartier = quartier === 'Tous' || a.quartier === quartier;
    const correspondPrix = (a.prix ?? 0) <= prixMax;
    return correspondRecherche && correspondType && correspondTransaction && correspondQuartier && correspondPrix;
  });

  return (
    <SafeAreaView style={s.conteneur}>
      <View style={s.enTete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.boutonRetour}>
          <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
        </TouchableOpacity>
        <Text style={s.titre}>Recherche</Text>
        <TouchableOpacity onPress={() => setAfficherFiltres(!afficherFiltres)}>
          <Ionicons
            name="options-outline"
            size={24}
            color={afficherFiltres ? Couleurs.primaire : Couleurs.texte.primaire}
          />
        </TouchableOpacity>
      </View>

      <View style={s.barreRecherche}>
        <Ionicons name="search-outline" size={20} color={Couleurs.texte.secondaire} />
        <TextInput
          style={s.champRecherche}
          placeholder="Chercher un logement..."
          placeholderTextColor={Couleurs.texte.clair}
          value={recherche}
          onChangeText={setRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => setRecherche('')}>
            <Ionicons name="close-circle" size={18} color={Couleurs.texte.clair} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {afficherFiltres && (
          <View style={s.secteurFiltres}>
            <Text style={s.etiquetteFiltre}>Transaction</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.rangFiltres}>
              {['Tous', 'location', 'vente'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.puce, typeTransaction === t && s.puceActive]}
                  onPress={() => setTypeTransaction(t)}
                >
                  <Text style={[s.textePuce, typeTransaction === t && s.textePuceActive]}>
                    {t === 'Tous' ? 'Tous' : t === 'location' ? 'Location' : 'Vente'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.etiquetteFiltre}>Type de bien</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.rangFiltres}>
              {(TYPES_BIENS || []).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.puce, typeBien === t && s.puceActive]}
                  onPress={() => setTypeBien(t)}
                >
                  <Text style={[s.textePuce, typeBien === t && s.textePuceActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.etiquetteFiltre}>Quartier</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.rangFiltres}>
              {(QUARTIERS || []).map(q => (
                <TouchableOpacity
                  key={q}
                  style={[s.puce, quartier === q && s.puceActive]}
                  onPress={() => setQuartier(q)}
                >
                  <Text style={[s.textePuce, quartier === q && s.textePuceActive]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.etiquetteFiltre}>Prix max : {prixMax.toLocaleString()} FCFA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.rangFiltres}>
              {[50000, 100000, 200000, 300000, 500000].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[s.puce, prixMax === p && s.puceActive]}
                  onPress={() => setPrixMax(p)}
                >
                  <Text style={[s.textePuce, prixMax === p && s.textePuceActive]}>{p / 1000}k</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={s.secteurResultats}>
          <Text style={s.titreResultats}>
            {resultats.length} resultat{resultats.length > 1 ? 's' : ''} trouve{resultats.length > 1 ? 's' : ''}
          </Text>

          {resultats.length === 0 ? (
            <View style={s.vide}>
              <Ionicons name="search-outline" size={60} color={Couleurs.texte.clair} />
              <Text style={s.texteVide}>Aucun logement ne correspond{'\n'}a vos criteres</Text>
              <TouchableOpacity
                style={s.boutonReset}
                onPress={() => {
                  setRecherche('');
                  setTypeBien('Tous');
                  setTypeTransaction('Tous');
                  setQuartier('Tous');
                  setPrixMax(PRIX_MAX);
                }}
              >
                <Text style={s.texteBoutonReset}>Reinitialiser les filtres</Text>
              </TouchableOpacity>
            </View>
          ) : (
            resultats.filter(a => !!a).map(annonce => (
              <View key={annonce.id} style={{ marginBottom: Espacement.md }}>
                <CarteAnnonce
                  bien={annonce}                                              // ✅ bien
                  onPress={() => navigation.navigate('DetailAnnonce', { annonce })}
                  onFavori={() => basculerFavori(annonce.id)}                 // ✅ ajout
                  estFavori={estFavori(annonce.id)}                           // ✅ ajout
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  enTete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Espacement.base,
    paddingVertical: 12,
    backgroundColor: Couleurs.blanc,
    ...Ombres.sm,
  },
  boutonRetour: { padding: 4 },
  titre: { fontSize: 18, fontWeight: '700', color: Couleurs.texte.primaire },
  barreRecherche: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Couleurs.blanc,
    marginHorizontal: Espacement.base,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RayonBordure.lg,
    ...Ombres.sm,
  },
  champRecherche: { flex: 1, fontSize: 15, color: Couleurs.texte.primaire },
  secteurFiltres: {
    backgroundColor: Couleurs.blanc,
    marginHorizontal: Espacement.base,
    borderRadius: RayonBordure.lg,
    padding: Espacement.base,
    marginBottom: 12,
    ...Ombres.sm,
  },
  etiquetteFiltre: {
    fontSize: 13,
    fontWeight: '600',
    color: Couleurs.texte.secondaire,
    marginBottom: 8,
    marginTop: 12,
  },
  rangFiltres: { marginBottom: 4 },
  puce: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Couleurs.bordure,
    marginRight: 8,
    backgroundColor: Couleurs.blanc,
  },
  puceActive: { backgroundColor: Couleurs.primaire, borderColor: Couleurs.primaire },
  textePuce: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.secondaire },
  textePuceActive: { color: Couleurs.blanc },
  secteurResultats: { paddingHorizontal: Espacement.base, paddingBottom: 20 },
  titreResultats: {
    fontSize: 15,
    fontWeight: '700',
    color: Couleurs.texte.primaire,
    marginBottom: 12,
  },
  vide: { alignItems: 'center', paddingVertical: 60 },
  texteVide: {
    fontSize: 15,
    color: Couleurs.texte.secondaire,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  boutonReset: {
    backgroundColor: Couleurs.primaire,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RayonBordure.lg,
  },
  texteBoutonReset: { color: Couleurs.blanc, fontWeight: '700', fontSize: 14 },
});