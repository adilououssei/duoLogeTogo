import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../theme/theme';
import { Bouton, Avatar } from '../components/commun/Composants';
import { useApp } from '../contexte/ContexteApp';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function EcranProfil({ navigation }: { navigation: any }) {
  const { utilisateur, deconnexion } = useApp(); // ✅ CORRIGÉ : deconnexion
  const [notifActives, setNotifActives] = useState(true);
  const [emailActif, setEmailActif] = useState(true);

  const gererDeconnexion = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => {
          deconnexion(); // ✅ CORRIGÉ
          navigation.replace('Authentification');
        },
      },
    ]);
  };

  // ✅ CORRIGÉ : typage explicite pour éviter l'erreur d'indexation
  const etiquettesType: Record<string, string> = {
    locataire: 'Locataire',
    proprietaire: 'Propriétaire',
    agent: 'Agent Immobilier',
  };
  const iconesType: Record<string, string> = {
    agent: 'briefcase',
    proprietaire: 'home',
    locataire: 'person',
  };

  const typeUser = utilisateur?.type ?? 'locataire';
  const etiquetteType = etiquettesType[typeUser] ?? 'Utilisateur';
  const iconeType = iconesType[typeUser] ?? 'person';

  const menuItems = [
    { icone: 'person-outline', etiquette: 'Modifier le profil', onPress: () => {} },
    { icone: 'heart-outline', etiquette: 'Mes favoris', onPress: () => navigation.navigate('Favoris') },
    { icone: 'time-outline', etiquette: 'Historique', onPress: () => {} },
    { icone: 'shield-checkmark-outline', etiquette: 'Vérification d\'identité', onPress: () => {} },
    { icone: 'language-outline', etiquette: 'Langue', onPress: () => {}, droite: 'Français' },
  ];

  return (
    <SafeAreaView style={s.conteneur}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[Couleurs.primaire, '#C44A00']} style={s.degrade}>
          <TouchableOpacity style={s.boutonParametres}>
            <Ionicons name="settings-outline" size={24} color={Couleurs.blanc} />
          </TouchableOpacity>
          <View style={{ position: 'relative' }}>
            <Avatar uri={utilisateur?.avatar} nom={utilisateur?.nom} taille={88} />
            <TouchableOpacity style={s.boutonCamera}>
              <Ionicons name="camera" size={16} color={Couleurs.blanc} />
            </TouchableOpacity>
          </View>
          <Text style={s.nom}>{utilisateur?.nom ?? 'Utilisateur'}</Text>
          <Text style={s.email}>{utilisateur?.email}</Text>
          {utilisateur?.telephone && <Text style={s.telephone}>{utilisateur.telephone}</Text>}
          <View style={s.badgeRole}>
            <Ionicons name={iconeType as any} size={13} color={Couleurs.blanc} />
            <Text style={s.texteRole}>{etiquetteType}</Text>
          </View>
        </LinearGradient>

        {/* Menu */}
        <View style={[s.carte, { marginTop: 16 }]}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.rangMenu, i > 0 && { borderTopWidth: 1, borderTopColor: Couleurs.bordure }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={s.iconeMenu}><Ionicons name={item.icone as any} size={20} color={Couleurs.primaire} /></View>
              <Text style={s.etiquetteMenu}>{item.etiquette}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {item.droite ? <Text style={{ fontSize: 13, color: Couleurs.texte.secondaire }}>{item.droite}</Text> : null}
                <Ionicons name="chevron-forward" size={17} color={Couleurs.texte.clair} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={s.carte}>
          <Text style={s.titreCarte}>Notifications</Text>
          <View style={s.rangBascule}>
            <View>
              <Text style={s.etiquetteBascule}>Notifications push</Text>
              <Text style={s.descriptionBascule}>Nouvelles annonces, messages</Text>
            </View>
            <Switch
              value={notifActives}
              onValueChange={setNotifActives}
              trackColor={{ false: Couleurs.bordure, true: Couleurs.primaire + '80' }}
              thumbColor={notifActives ? Couleurs.primaire : Couleurs.texte.clair}
            />
          </View>
          <View style={[s.rangBascule, { borderTopWidth: 1, borderTopColor: Couleurs.bordure, paddingTop: 14 }]}>
            <View>
              <Text style={s.etiquetteBascule}>Alertes email</Text>
              <Text style={s.descriptionBascule}>Résumé hebdomadaire</Text>
            </View>
            <Switch
              value={emailActif}
              onValueChange={setEmailActif}
              trackColor={{ false: Couleurs.bordure, true: Couleurs.primaire + '80' }}
              thumbColor={emailActif ? Couleurs.primaire : Couleurs.texte.clair}
            />
          </View>
        </View>

        <View style={{ padding: Espacement.base, paddingBottom: 32 }}>
          <Bouton titre="Déconnexion" variante="contour" onPress={gererDeconnexion} icone="log-out-outline" />
          <Text style={s.version}>LogeTogo v1.0.0 · OUSSEI Adilou</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  degrade: { alignItems: 'center', paddingTop: 20, paddingBottom: 30, position: 'relative' },
  boutonParametres: { position: 'absolute', top: 20, right: 20 },
  boutonCamera: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Couleurs.secondaire, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Couleurs.blanc },
  nom: { fontSize: 22, fontWeight: '800', color: Couleurs.blanc, marginTop: 12, marginBottom: 3 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  telephone: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 8 },
  badgeRole: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  texteRole: { fontSize: 13, color: Couleurs.blanc, fontWeight: '600' },
  carte: { backgroundColor: Couleurs.blanc, marginHorizontal: Espacement.base, marginBottom: Espacement.md, borderRadius: RayonBordure.lg, padding: Espacement.base, ...Ombres.sm },
  titreCarte: { fontSize: 15, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 14 },
  rangMenu: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  iconeMenu: { width: 36, height: 36, borderRadius: 10, backgroundColor: Couleurs.primaire + '18', alignItems: 'center', justifyContent: 'center' },
  etiquetteMenu: { flex: 1, fontSize: 14, color: Couleurs.texte.primaire, fontWeight: '500' },
  rangBascule: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiquetteBascule: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 2 },
  descriptionBascule: { fontSize: 12, color: Couleurs.texte.secondaire },
  version: { fontSize: 12, color: Couleurs.texte.clair, textAlign: 'center', marginTop: 16 },
});