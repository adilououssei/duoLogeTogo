// @ts-check
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../theme/theme';
import { useApp } from '../contexte/ContexteApp';
import { Notification } from '../types/modeles';
import {EnTete} from '../components/EnTete';
import { SafeAreaView } from 'react-native-safe-area-context';


const META_NOTIF: Record<string, { icone: string; couleur: string }> = {
  nouvelle_annonce:    { icone: 'home',         couleur: Couleurs.primaire },
  message:             { icone: 'chatbubble',   couleur: Couleurs.secondaire },
  mise_a_jour_statut:  { icone: 'sync',         couleur: Couleurs.accent },
  avis:                { icone: 'star',         couleur: Couleurs.accent },
};

export default function EcranNotifications({ navigation }: { navigation: any }) {
  const { notifications, marquerTousLus } = useApp();

  return (
    <SafeAreaView style={s.conteneur}>
      <EnTete
        typeEnTete="minimal"
        titre="Notifications"
        onRetour={() => navigation.goBack()}
        actionDroite={
          <TouchableOpacity onPress={marquerTousLus}>
            <Text style={s.toutLire}>Tout lire</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Espacement.base }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }: { item: Notification }) => {
          const meta = META_NOTIF[item.type] ?? { icone: 'notifications', couleur: Couleurs.primaire };
          return (
            <TouchableOpacity style={[s.carte, !item.lu && s.carteNonLue, Ombres.sm]} activeOpacity={0.7}>
              <View style={[s.enveloppeIcone, { backgroundColor: meta.couleur + '20' }]}>
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
          <View style={{ alignItems: 'center', paddingVertical: 80, gap: 10 }}>
            <Ionicons name="notifications-outline" size={55} color={Couleurs.texte.clair} />
            <Text style={{ fontSize: 15, color: Couleurs.texte.secondaire }}>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  toutLire: { fontSize: 13, color: Couleurs.secondaire, fontWeight: '600' },
  carte: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 14, gap: 12 },
  carteNonLue: { borderLeftWidth: 3, borderLeftColor: Couleurs.primaire },
  enveloppeIcone: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titreNotif: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 3 },
  corpsNotif: { fontSize: 13, color: Couleurs.texte.secondaire, lineHeight: 18, marginBottom: 5 },
  heureNotif: { fontSize: 11, color: Couleurs.texte.clair },
  pointNonLu: { width: 10, height: 10, borderRadius: 5, backgroundColor: Couleurs.primaire, marginTop: 4 },
});
