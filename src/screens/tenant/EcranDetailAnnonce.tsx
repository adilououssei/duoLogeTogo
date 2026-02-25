import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Share, Linking, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../../theme/theme';
import { Bouton, Badge, EtoilesNote, Avatar } from '../../components/commun/Composants';
import { useApp } from '../../contexte/ContexteApp';
import { Bien } from '../../types/modeles';

const { width } = Dimensions.get('window');

export default function EcranDetailAnnonce({ route, navigation }: { route: any; navigation: NativeStackNavigationProp<any> }) {
  // ✅ CORRIGE : etait { bien }, maintenant { annonce }
  const { annonce } = route.params as { annonce: Bien };
  const { basculerFavori, estFavori } = useApp();
  const [indexMedia, setIndexMedia] = useState(0);
  const disponible = annonce.statut === 'disponible';

  const tousMedia = [...annonce.images, ...(annonce.videos ?? [])];
  const isVideo = (url: string) => url.includes('video') || url.endsWith('.mp4') || url.endsWith('.mov');

  const allerChat = () => {
    navigation.navigate('Chat', {
      conversation: {
        id: annonce.id,
        titreBien: annonce.titre,
        autreUtilisateur: annonce.agent,
        messages: [],
        dernierMessage: '',
        heureDernierMessage: '',
        nonLus: 0,
      }
    });
  };

  const calculerTotal = () => {
    if (!annonce.infoPrix) return null;
    const { prixMensuel, avanceMois, cautionMois, commissionDemarcheur } = annonce.infoPrix;
    const avance = prixMensuel * avanceMois;
    return { avance, cautionMois, commissionDemarcheur, total: avance + commissionDemarcheur };
  };

  const totaux = calculerTotal();

  return (
    <View style={{ flex: 1, backgroundColor: Couleurs.blanc }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Galerie */}
        <View style={s.enveloppeImage}>
          <FlatList
            data={tousMedia}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setIndexMedia(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={{ width, height: 310 }}>
                <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                {isVideo(item) && (
                  <View style={s.superpositionVideo}>
                    <Ionicons name="play-circle" size={64} color={Couleurs.blanc} />
                  </View>
                )}
              </View>
            )}
          />
          {tousMedia.length > 1 && (
            <View style={s.indicateurs}>
              {tousMedia.map((_, i) => (
                <View key={i} style={[s.indicateur, i === indexMedia && s.indicateurActif]} />
              ))}
            </View>
          )}
          <View style={s.compteurMedia}>
            <Text style={s.texteCompteur}>{indexMedia + 1}/{tousMedia.length}</Text>
          </View>
          <View style={s.navImage}>
            <TouchableOpacity style={s.boutonNav} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Couleurs.blanc} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={s.boutonNav} onPress={() => Share.share({ message: `${annonce.titre} - ${annonce.localisation}` })}>
                <Ionicons name="share-social-outline" size={22} color={Couleurs.blanc} />
              </TouchableOpacity>
              <TouchableOpacity style={s.boutonNav} onPress={() => basculerFavori(annonce.id)}>
                <Ionicons name={estFavori(annonce.id) ? 'heart' : 'heart-outline'} size={22} color={estFavori(annonce.id) ? '#FF4757' : Couleurs.blanc} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <Badge etiquette={disponible ? 'Disponible' : 'Occupee'} couleur={disponible ? Couleurs.succes : Couleurs.erreur} />
          </View>
        </View>

        {/* Corps */}
        <View style={s.corps}>
          <Badge etiquette={annonce.type} couleur={Couleurs.secondaire} />
          {annonce.typeTransaction === 'vente' && <Badge etiquette="A VENDRE" couleur={Couleurs.primaire} />}
          <Text style={s.titre}>{annonce.titre}</Text>

          {/* Prix */}
          <View style={s.rangePrix}>
            <View>
              <Text style={s.prix}>{annonce.prix.toLocaleString()} FCFA</Text>
              <Text style={s.sousPrix}>{annonce.typeTransaction === 'vente' ? 'Prix total' : 'par mois'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <EtoilesNote note={annonce.note} />
              <Text style={{ fontSize: 12, color: Couleurs.texte.secondaire }}>{annonce.note} ({annonce.avis} avis)</Text>
            </View>
          </View>

          {/* Details financiers */}
          {annonce.infoPrix && (
            <View style={s.carteFinanciere}>
              <Text style={s.titreSectionFinanciere}>Details financiers</Text>
              <View style={s.rangeLigneFinanciere}>
                <Text style={s.etiquetteFinanciere}>Loyer mensuel</Text>
                <Text style={s.valeurFinanciere}>{annonce.infoPrix.prixMensuel.toLocaleString()} FCFA</Text>
              </View>
              <View style={s.rangeLigneFinanciere}>
                <Text style={s.etiquetteFinanciere}>Avance requise</Text>
                <Text style={[s.valeurFinanciere, { color: Couleurs.erreur }]}>
                  {annonce.infoPrix.avanceMois} mois ({(annonce.infoPrix.prixMensuel * annonce.infoPrix.avanceMois).toLocaleString()} FCFA)
                </Text>
              </View>
              <View style={s.rangeLigneFinanciere}>
                <Text style={s.etiquetteFinanciere}>Caution</Text>
                <Text style={[s.valeurFinanciere, { color: Couleurs.secondaire }]}>{annonce.infoPrix.cautionMois} mois offerts</Text>
              </View>
              <View style={[s.rangeLigneFinanciere, { borderTopWidth: 1, borderTopColor: Couleurs.bordure, paddingTop: 8, marginTop: 4 }]}>
                <Text style={s.etiquetteFinanciere}>Commission</Text>
                <Text style={[s.valeurFinanciere, { color: Couleurs.accent }]}>{annonce.infoPrix.commissionDemarcheur.toLocaleString()} FCFA</Text>
              </View>
              {totaux && (
                <View style={s.totalFinancier}>
                  <Text style={s.texteTotal}>Total a prevoir</Text>
                  <Text style={s.valeurTotal}>{totaux.total.toLocaleString()} FCFA</Text>
                </View>
              )}
            </View>
          )}

          <View style={s.rangeLoc}>
            <Ionicons name="location" size={16} color={Couleurs.secondaire} />
            <Text style={s.localisation}>{annonce.localisation}</Text>
            <Text style={{ fontSize: 12, color: Couleurs.secondaire, fontWeight: '600' }}>• {annonce.distance} km</Text>
          </View>

          {/* Stats */}
          <View style={s.stats}>
            {annonce.type !== 'Terrain' && (
              <>
                <Stat icone="bed-outline" etiquette="Chambre(s)" valeur={annonce.chambres > 0 ? String(annonce.chambres) : '-'} />
                <Stat icone="water-outline" etiquette="Salle de bain" valeur={annonce.sallesDeBain > 0 ? String(annonce.sallesDeBain) : 'Partagee'} />
              </>
            )}
            <Stat icone="resize-outline" etiquette="Superficie" valeur={`${annonce.superficie}m2`} />
            <Stat icone="eye-outline" etiquette="Vues" valeur={String(annonce.vues)} />
          </View>

          <View style={s.diviseur} />
          <Text style={s.titreSection}>Description</Text>
          <Text style={s.description}>{annonce.description}</Text>

          <View style={s.diviseur} />
          <Text style={s.titreSection}>Equipements</Text>
          <View style={s.equipements}>
            {annonce.equipements.map((e, i) => (
              <View key={i} style={s.elementEquipement}>
                <Ionicons name="checkmark-circle" size={17} color={Couleurs.succes} />
                <Text style={s.texteEquipement}>{e}</Text>
              </View>
            ))}
          </View>

          <View style={s.diviseur} />
          <Text style={s.titreSection}>Agent immobilier</Text>
          <View style={[s.carteAgent, Ombres.sm]}>
            <Avatar uri={annonce.agent.avatar} nom={annonce.agent.nom} taille={54} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.nomAgent}>{annonce.agent.nom}</Text>
              <Text style={{ fontSize: 12, color: Couleurs.texte.secondaire, marginBottom: 4 }}>{annonce.agent.email}</Text>
              <EtoilesNote note={annonce.agent.note} taille={14} />
            </View>
            <TouchableOpacity style={s.iconeChat} onPress={allerChat}>
              <Ionicons name="chatbubble-outline" size={22} color={Couleurs.primaire} />
            </TouchableOpacity>
          </View>

          <Text style={[s.titreSection, { marginTop: 18 }]}>Localisation</Text>
          <TouchableOpacity style={s.cartePlaceholder} onPress={() => navigation.navigate('Carte', { annonce })}>
            <Ionicons name="map" size={36} color={Couleurs.secondaire} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: Couleurs.secondaire, marginTop: 8 }}>Voir sur la carte</Text>
            <Text style={{ fontSize: 12, color: Couleurs.texte.clair, marginTop: 4 }}>
              {annonce.coordonnees.latitude.toFixed(4)}, {annonce.coordonnees.longitude.toFixed(4)}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Barre du bas */}
      <View style={[s.barreBas, Ombres.lg]}>
        <View>
          <Text style={s.prixBas}>{annonce.prix.toLocaleString()} FCFA</Text>
          <Text style={{ fontSize: 12, color: Couleurs.texte.secondaire }}>
            {annonce.typeTransaction === 'vente' ? 'prix total' : '/mois'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, flex: 1, marginLeft: 14 }}>
          <TouchableOpacity style={s.boutonAppel} onPress={() => Linking.openURL(`tel:${annonce.agent.telephone}`)}>
            <Ionicons name="call" size={20} color={Couleurs.blanc} />
          </TouchableOpacity>
          <Bouton titre="Contacter l'agent" onPress={allerChat} style={{ flex: 1 }} desactive={!disponible} />
        </View>
      </View>
    </View>
  );
}

const Stat = ({ icone, etiquette, valeur }: { icone: string; etiquette: string; valeur: string }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Couleurs.primaire + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
      <Ionicons name={icone as any} size={18} color={Couleurs.primaire} />
    </View>
    <Text style={{ fontSize: 14, fontWeight: '700', color: Couleurs.texte.primaire }}>{valeur}</Text>
    <Text style={{ fontSize: 11, color: Couleurs.texte.secondaire, textAlign: 'center' }}>{etiquette}</Text>
  </View>
);

const s = StyleSheet.create({
  enveloppeImage: { height: 310, position: 'relative' },
  superpositionVideo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  indicateurs: { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  indicateur: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  indicateurActif: { width: 18, backgroundColor: Couleurs.blanc },
  compteurMedia: { position: 'absolute', top: 48, right: 14, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  texteCompteur: { fontSize: 11, color: Couleurs.blanc, fontWeight: '600' },
  navImage: { position: 'absolute', top: 48, left: 14, right: 60, flexDirection: 'row', justifyContent: 'space-between' },
  boutonNav: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center' },
  corps: { backgroundColor: Couleurs.blanc, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -18, padding: Espacement.base },
  titre: { fontSize: 21, fontWeight: '800', color: Couleurs.texte.primaire, marginTop: 6, lineHeight: 28, marginBottom: 10 },
  rangePrix: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  prix: { fontSize: 24, fontWeight: '800', color: Couleurs.primaire },
  sousPrix: { fontSize: 12, color: Couleurs.texte.secondaire },
  carteFinanciere: { backgroundColor: Couleurs.primaire + '08', borderRadius: RayonBordure.lg, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: Couleurs.primaire + '20' },
  titreSectionFinanciere: { fontSize: 14, fontWeight: '700', color: Couleurs.primaire, marginBottom: 10 },
  rangeLigneFinanciere: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  etiquetteFinanciere: { fontSize: 13, color: Couleurs.texte.secondaire },
  valeurFinanciere: { fontSize: 13, fontWeight: '700', color: Couleurs.texte.primaire },
  totalFinancier: { backgroundColor: Couleurs.primaire + '18', borderRadius: RayonBordure.md, padding: 10, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  texteTotal: { fontSize: 13, fontWeight: '700', color: Couleurs.primaire },
  valeurTotal: { fontSize: 16, fontWeight: '800', color: Couleurs.primaire },
  rangeLoc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  localisation: { fontSize: 13, color: Couleurs.texte.secondaire, flex: 1 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  diviseur: { height: 1, backgroundColor: Couleurs.bordure, marginVertical: 16 },
  titreSection: { fontSize: 16, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 12 },
  description: { fontSize: 14, color: Couleurs.texte.secondaire, lineHeight: 22 },
  equipements: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  elementEquipement: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%' },
  texteEquipement: { fontSize: 13, color: Couleurs.texte.primaire },
  carteAgent: { flexDirection: 'row', alignItems: 'center', backgroundColor: Couleurs.fond, borderRadius: RayonBordure.lg, padding: 14 },
  nomAgent: { fontSize: 15, fontWeight: '700', color: Couleurs.texte.primaire },
  iconeChat: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  cartePlaceholder: { height: 140, backgroundColor: Couleurs.secondaire + '14', borderRadius: RayonBordure.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Couleurs.secondaire + '30', borderStyle: 'dashed' },
  barreBas: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: Couleurs.blanc, paddingHorizontal: Espacement.base, paddingVertical: 14, paddingBottom: 28, borderTopWidth: 1, borderTopColor: Couleurs.bordure },
  prixBas: { fontSize: 19, fontWeight: '800', color: Couleurs.primaire },
  boutonAppel: { width: 50, height: 50, borderRadius: 25, backgroundColor: Couleurs.succes, alignItems: 'center', justifyContent: 'center' },
});