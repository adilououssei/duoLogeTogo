import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../../theme/theme';
import { Avatar, Badge, CarteStats } from '../../components/commun/Composants';
import { ANNONCES_FICTIVES } from '../../donnees/donneesFictives';
import { useApp } from '../../contexte/ContexteApp';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TableauBordProprietaire({ navigation }: { navigation: any }) {
  const { utilisateur } = useApp();
  const mesBiens = ANNONCES_FICTIVES.slice(0, 4);
  const disponibles = mesBiens.filter(l => l.statut === 'disponible').length;
  const loues = mesBiens.filter(l => l.statut === 'occupe').length;
  const revenus = mesBiens.filter(l => l.statut === 'occupe').reduce((acc, l) => acc + l.prix, 0);

  return (
    <SafeAreaView style={s.conteneur}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1A1A2E', '#16213E']} style={s.enTete}>
          <View style={s.rangHaut}>
            <View>
              <Text style={s.labelEspace}>Espace Propriétaire</Text>
              <Text style={s.nom}>{utilisateur?.nom}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
              <Avatar uri={utilisateur?.avatar} nom={utilisateur?.nom} taille={46} />
            </TouchableOpacity>
          </View>
          <View style={s.carteRevenus}>
            <Text style={s.labelRevenus}>Revenus mensuels estimés</Text>
            <Text style={s.valeurRevenus}>{revenus.toLocaleString()} FCFA</Text>
            <Text style={s.sousRevenus}>{loues} bien{loues !== 1 ? 's' : ''} loué{loues !== 1 ? 's' : ''}</Text>
          </View>
        </LinearGradient>

        <View style={s.rangStatsCards}>
          <CarteStats icone="home-outline" etiquette="Total" valeur={mesBiens.length} couleur={Couleurs.primaire} />
          <CarteStats icone="checkmark-circle-outline" etiquette="Disponibles" valeur={disponibles} couleur={Couleurs.succes} />
          <CarteStats icone="person-outline" etiquette="Loués" valeur={loues} couleur={Couleurs.secondaire} />
        </View>

        {/* Actions rapides */}
        <View style={s.section}>
          <Text style={s.titreSection}>Actions rapides</Text>
          <View style={s.actions}>
            {[
              { icone: 'business-outline', etiquette: 'Contacter agence', couleur: Couleurs.primaire, onPress: () => navigation.navigate('Conversations') },
              { icone: 'chatbubbles', etiquette: 'Messages', couleur: Couleurs.secondaire, onPress: () => navigation.navigate('Conversations') },
              { icone: 'star', etiquette: 'Avis reçus', couleur: Couleurs.accent, onPress: () => {} },
              { icone: 'document-text', etiquette: 'Contrats', couleur: Couleurs.succes, onPress: () => {} },
            ].map(a => (
              <TouchableOpacity key={a.etiquette} style={s.action} onPress={a.onPress}>
                <View style={[s.iconeAction, { backgroundColor: a.couleur + '22' }]}>
                  <Ionicons name={a.icone as any} size={26} color={a.couleur} />
                </View>
                <Text style={s.etiquetteAction}>{a.etiquette}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info propriétaire */}
        <View style={[s.section, { marginBottom: 0 }]}>
          <View style={s.infoCard}>
            <Ionicons name="information-circle" size={22} color={Couleurs.secondaire} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.infoTitre}>Comment ça fonctionne</Text>
              <Text style={s.infoTexte}>Vous avez des biens à louer? Contactez un agent immobilier via la messagerie. L agent créera les annonces et gérera les locataires pour vous.</Text>
            </View>
          </View>
        </View>

        {/* Mes biens */}
        <View style={[s.section, { paddingBottom: 30 }]}>
          <Text style={s.titreSection}>Mes Biens</Text>
          {mesBiens.map(bien => (
            <View key={bien.id} style={[s.rangBien, Ombres.sm]}>
              <View style={[s.ligneSatut, { backgroundColor: bien.statut === 'disponible' ? Couleurs.succes : Couleurs.secondaire }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.titreBien} numberOfLines={1}>{bien.titre}</Text>
                <Text style={s.locBien}>{bien.localisation}</Text>
                <Text style={s.prixBien}>
                  {bien.prix.toLocaleString()} FCFA{bien.typeTransaction === 'location' ? '/mois' : ' (vente)'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 10 }}>
                <Badge etiquette={bien.statut === 'disponible' ? 'Libre' : 'Loué'} couleur={bien.statut === 'disponible' ? Couleurs.succes : Couleurs.secondaire} />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={() => Alert.alert('Contacter un agent', 'Souhaitez-vous contacter un agent pour ce bien?', [{ text: 'Non' }, { text: 'Oui', onPress: () => navigation.navigate('Conversations') }])}>
                    <Ionicons name="business-outline" size={20} color={Couleurs.secondaire} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  enTete: { padding: Espacement.base, paddingBottom: 30 },
  rangHaut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  labelEspace: { fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  nom: { fontSize: 22, fontWeight: '800', color: Couleurs.blanc },
  carteRevenus: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RayonBordure.xl, padding: 20, alignItems: 'center' },
  labelRevenus: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6 },
  valeurRevenus: { fontSize: 30, fontWeight: '800', color: Couleurs.accent },
  sousRevenus: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  rangStatsCards: { flexDirection: 'row', gap: 10, padding: Espacement.base, marginTop: -14, backgroundColor: Couleurs.blanc, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  section: { padding: Espacement.base },
  titreSection: { fontSize: 16, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 14 },
  actions: { flexDirection: 'row', justifyContent: 'space-around' },
  action: { alignItems: 'center', gap: 7 },
  iconeAction: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  etiquetteAction: { fontSize: 11, color: Couleurs.texte.secondaire, textAlign: 'center', fontWeight: '500' },
  infoCard: { flexDirection: 'row', backgroundColor: Couleurs.secondaire + '15', borderRadius: RayonBordure.lg, padding: 14, borderWidth: 1, borderColor: Couleurs.secondaire + '30', marginBottom: 14 },
  infoTitre: { fontSize: 13, fontWeight: '700', color: Couleurs.secondaire, marginBottom: 4 },
  infoTexte: { fontSize: 12, color: Couleurs.texte.secondaire, lineHeight: 18 },
  rangBien: { flexDirection: 'row', alignItems: 'center', backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 13, marginBottom: 10, gap: 10, overflow: 'hidden' },
  ligneSatut: { width: 4, height: '100%', borderRadius: 2, position: 'absolute', left: 0, top: 0, bottom: 0 },
  titreBien: { fontSize: 14, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 3 },
  locBien: { fontSize: 12, color: Couleurs.texte.secondaire, marginBottom: 3 },
  prixBien: { fontSize: 13, fontWeight: '700', color: Couleurs.primaire },
});
