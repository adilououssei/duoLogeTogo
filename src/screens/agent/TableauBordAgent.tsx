import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../../theme/theme';
import { Avatar, Badge } from '../../components/commun/Composants';
import { ANNONCES_FICTIVES } from '../../donnees/donneesFictives';
import { useApp } from '../../contexte/ContexteApp';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TableauBordAgent({ navigation }: { navigation: any }) {
  const { utilisateur } = useApp();
  const mesAnnonces = ANNONCES_FICTIVES.slice(0, 4);
  const disponibles = mesAnnonces.filter(l => l.statut === 'disponible').length;

  return (
    <SafeAreaView style={s.conteneur}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[Couleurs.primaire, '#B84200']} style={s.enTete} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={s.rangHaut}>
            <View>
              <Text style={s.sousTitre}>Tableau de bord</Text>
              <Text style={s.nomAgent}>{utilisateur?.nom ?? 'Agent'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
              <Avatar uri={utilisateur?.avatar} nom={utilisateur?.nom} taille={46} />
            </TouchableOpacity>
          </View>
          <View style={s.rangStats}>
            {[['Annonces', mesAnnonces.length], ['Disponibles', disponibles], ['Vues', 456], ['Note', '4.8★']].map(([label, val]) => (
              <View key={String(label)} style={s.stat}>
                <Text style={s.valeurStat}>{val}</Text>
                <Text style={s.etiquetteStat}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Actions rapides */}
        <View style={s.carteActions}>
          {[
            { icone: 'add-circle', etiquette: 'Ajouter', couleur: Couleurs.primaire, onPress: () => navigation.navigate('AjoutAnnonce') },
            { icone: 'list', etiquette: 'Mes annonces', couleur: Couleurs.secondaire, onPress: () => {} },
            { icone: 'chatbubbles', etiquette: 'Messages', couleur: Couleurs.accent, onPress: () => navigation.navigate('Conversations') },
            { icone: 'stats-chart', etiquette: 'Statistiques', couleur: Couleurs.succes, onPress: () => {} },
          ].map(a => (
            <TouchableOpacity key={a.etiquette} style={s.action} onPress={a.onPress}>
              <View style={[s.iconeAction, { backgroundColor: a.couleur + '22' }]}>
                <Ionicons name={a.icone as any} size={26} color={a.couleur} />
              </View>
              <Text style={s.etiquetteAction}>{a.etiquette}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mes annonces */}
        <View style={s.section}>
          <View style={s.rangTitre}>
            <Text style={s.titreSection}>Mes annonces</Text>
            <Text style={s.voirTout}>Voir tout</Text>
          </View>
          {mesAnnonces.map(annonce => (
            <View key={annonce.id} style={[s.rangAnnonce, Ombres.sm]}>
              <View style={[s.ligneSatut, { backgroundColor: annonce.statut === 'disponible' ? Couleurs.succes : Couleurs.erreur }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.titreAnnonce} numberOfLines={1}>{annonce.titre}</Text>
                <Text style={s.metaAnnonce}>{annonce.localisation} · {annonce.vues} vues</Text>
                <Text style={s.prixAnnonce}>
                  {annonce.prix.toLocaleString()} FCFA{annonce.typeTransaction === 'location' ? '/mois' : ' (vente)'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <Badge etiquette={annonce.statut === 'disponible' ? 'Disponible' : 'Occupée'} couleur={annonce.statut === 'disponible' ? Couleurs.succes : Couleurs.erreur} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('AjoutAnnonce', { bien: annonce })}>
                    <Ionicons name="create-outline" size={20} color={Couleurs.secondaire} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Alert.alert('Supprimer', 'Confirmer?', [{ text: 'Annuler' }, { text: 'Supprimer', style: 'destructive' }])}>
                    <Ionicons name="trash-outline" size={20} color={Couleurs.erreur} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AjoutAnnonce')}>
        <Ionicons name="add" size={28} color={Couleurs.blanc} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  enTete: { padding: Espacement.base, paddingBottom: 28 },
  rangHaut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sousTitre: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  nomAgent: { fontSize: 22, fontWeight: '800', color: Couleurs.blanc },
  rangStats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RayonBordure.lg, padding: 14 },
  stat: { alignItems: 'center' },
  valeurStat: { fontSize: 20, fontWeight: '800', color: Couleurs.blanc },
  etiquetteStat: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  carteActions: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Couleurs.blanc, marginTop: -14, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingVertical: 18, ...Ombres.sm },
  action: { alignItems: 'center', gap: 7 },
  iconeAction: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  etiquetteAction: { fontSize: 11, color: Couleurs.texte.secondaire, fontWeight: '500' },
  section: { padding: Espacement.base },
  rangTitre: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titreSection: { fontSize: 16, fontWeight: '700', color: Couleurs.texte.primaire },
  voirTout: { fontSize: 13, color: Couleurs.secondaire, fontWeight: '600' },
  rangAnnonce: { flexDirection: 'row', alignItems: 'center', backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 13, marginBottom: 10, gap: 10, overflow: 'hidden' },
  ligneSatut: { width: 4, height: '100%', borderRadius: 2, position: 'absolute', left: 0, top: 0, bottom: 0 },
  titreAnnonce: { fontSize: 14, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 3 },
  metaAnnonce: { fontSize: 12, color: Couleurs.texte.secondaire, marginBottom: 3 },
  prixAnnonce: { fontSize: 13, fontWeight: '700', color: Couleurs.primaire },
  fab: { position: 'absolute', bottom: 24, right: 22, width: 58, height: 58, borderRadius: 29, backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center', ...Ombres.lg },
});
