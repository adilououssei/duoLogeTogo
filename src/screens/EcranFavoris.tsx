import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Couleurs, Espacement } from '../theme/theme';
import { CarteAnnonce, EtatVide } from '../components/commun/Composants';
import { ANNONCES_FICTIVES } from '../donnees/donneesFictives';
import { useApp } from '../contexte/ContexteApp';
import {EnTete} from '../components/EnTete';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function EcranFavoris({ navigation }: { navigation: any }) {
  const { favoris, basculerFavori, estFavori } = useApp();
  const listeFavoris = ANNONCES_FICTIVES.filter(l => favoris.includes(l.id));

  return (
    <SafeAreaView style={s.conteneur}>
      <EnTete typeEnTete="simple" titre="Mes Favoris" sousTitre={`${listeFavoris.length} logement${listeFavoris.length !== 1 ? 's' : ''}`} />
      {listeFavoris.length === 0 ? (
        <EtatVide
          icone="heart-outline"
          titre="Aucun favori"
          description="Appuyez sur le cœur d'une annonce pour l'ajouter ici"
          etiquetteAction="Parcourir les logements"
          onAction={() => navigation.navigate('Recherche')}
        />
      ) : (
        <FlatList
          data={listeFavoris}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: Espacement.base }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CarteAnnonce
              bien={item}
              onPress={() => navigation.navigate('DetailAnnonce', { bien: item })}
              onFavori={() => basculerFavori(item.id)}
              estFavori={estFavori(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
});
