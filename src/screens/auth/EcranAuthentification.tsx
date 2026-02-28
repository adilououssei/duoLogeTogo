import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, RayonBordure } from '../../theme/theme';
import { Bouton, ChampSaisie } from '../../components/commun/Composants';
import { useApp } from '../../contexte/ContexteApp';
import { TypeUtilisateur } from '../../types/modeles';
import { login, register } from '../../services/authService';

const { height } = Dimensions.get('window');

const TYPES_UTILISATEURS: { cle: TypeUtilisateur; etiquette: string; icone: string; description: string }[] = [
  { cle: 'locataire', etiquette: 'Locataire', icone: 'person-outline', description: 'Chercher un logement' },
  { cle: 'proprietaire', etiquette: 'Propriétaire', icone: 'home-outline', description: 'Proposer mes biens' },
  { cle: 'agent', etiquette: 'Agent', icone: 'briefcase-outline', description: 'Gérer des annonces' },
];

const PAYS_AFRIQUE = [
  { code: 'TG', nom: 'Togo', indicatif: '+228' },
  { code: 'GH', nom: 'Ghana', indicatif: '+233' },
  { code: 'BJ', nom: 'Bénin', indicatif: '+229' },
  { code: 'CI', nom: 'Côte d\'Ivoire', indicatif: '+225' },
  { code: 'SN', nom: 'Sénégal', indicatif: '+221' },
  { code: 'CM', nom: 'Cameroun', indicatif: '+237' },
  { code: 'FR', nom: 'France', indicatif: '+33' },
];

export default function EcranAuthentification({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const { connexion } = useApp();
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion');
  const [typeUtilisateur, setTypeUtilisateur] = useState<TypeUtilisateur>('locataire');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [paysSelectionne, setPaysSelectionne] = useState(PAYS_AFRIQUE[0]);
  const [afficheurPays, setAfficheurPays] = useState(false);
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [chargement, setChargement] = useState(false);

  const valider = () => {
    const e: Record<string, string> = {};
    if (mode === 'inscription') {
      if (!nom.trim()) e.nom = 'Nom requis';
      if (!prenom.trim()) e.prenom = 'Prénom requis';
      if (!telephone.trim()) e.telephone = 'Téléphone requis';
    }
    if (!email.trim()) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!motDePasse) e.motDePasse = 'Mot de passe requis';
    else if (motDePasse.length < 6) e.motDePasse = 'Au moins 6 caractères';
    if (mode === 'inscription' && motDePasse !== confirmation) e.confirmation = 'Les mots de passe ne correspondent pas';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const gererSoumission = async () => {

    if (!valider()) return;
    setChargement(true);
    setTimeout(() => {
      connexion({ // ✅ CORRIGÉ : connexion (pas connecter)
        id: 'u1',
        nom: mode === 'connexion' ? 'Utilisateur Test' : nom,
        prenom: mode === 'connexion' ? '' : prenom,
        email,
        telephone: `${paysSelectionne.indicatif} ${telephone}`,
        indicatifPays: paysSelectionne.indicatif,
        codePays: paysSelectionne.code,
        type: typeUtilisateur,
        verifie: false,
      });
      setChargement(false);
      const dest = typeUtilisateur === 'agent' ? 'OngletAgent' : typeUtilisateur === 'proprietaire' ? 'OngletProprietaire' : 'OngletLocataire';
      navigation.replace(dest as any);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1, backgroundColor: Couleurs.fond }} showsVerticalScrollIndicator={false}>

        {/* En-tête dégradé */}
        <LinearGradient colors={[Couleurs.primaire, '#C44A00']} style={s.enTete}>

          {/* ✅ Bouton retour : permet de revenir à la home sans se connecter */}
          <TouchableOpacity
            style={s.boutonRetour}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('OngletLocataire')}
          >
            <Ionicons name="arrow-back" size={22} color={Couleurs.blanc} />
            <Text style={s.texteRetour}>Continuer sans compte</Text>
          </TouchableOpacity>

          <View style={s.logoWrap}>
            <View style={s.logoIcone}><Ionicons name="home" size={38} color={Couleurs.blanc} /></View>
            <Text style={s.logoTexte}>LogeTogo</Text>
            <Text style={s.logoSous}>Votre logement en quelques clics</Text>
          </View>
        </LinearGradient>

        {/* Carte principale */}
        <View style={s.carte}>
          {/* Onglets Connexion / Inscription */}
          <View style={s.onglets}>
            {(['connexion', 'inscription'] as const).map(m => (
              <TouchableOpacity key={m} style={[s.onglet, mode === m && s.ongletActif]} onPress={() => setMode(m)}>
                <Text style={[s.texteOnglet, mode === m && s.texteOngletActif]}>
                  {m === 'connexion' ? 'Connexion' : 'Inscription'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sélection du type d'utilisateur */}
          <Text style={s.etiquette}>Je suis</Text>
          <View style={s.rangeType}>
            {TYPES_UTILISATEURS.map(t => (
              <TouchableOpacity
                key={t.cle}
                style={[s.boutonType, typeUtilisateur === t.cle && s.boutonTypeActif]}
                onPress={() => setTypeUtilisateur(t.cle)}
              >
                <Ionicons name={t.icone as any} size={22} color={typeUtilisateur === t.cle ? Couleurs.blanc : Couleurs.primaire} />
                <Text style={[s.etiquetteType, typeUtilisateur === t.cle && { color: Couleurs.blanc }]}>{t.etiquette}</Text>
                <Text style={[s.descriptionType, typeUtilisateur === t.cle && { color: 'rgba(255,255,255,0.75)' }]}>{t.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Champs d'inscription */}
          {mode === 'inscription' && (
            <>
              <ChampSaisie etiquette="Nom *" placeholder="Ex: Mensah" valeur={nom} onChangerTexte={setNom} icone="person-outline" erreur={erreurs.nom} />
              <ChampSaisie etiquette="Prénom *" placeholder="Ex: Kofi" valeur={prenom} onChangerTexte={setPrenom} icone="person-outline" erreur={erreurs.prenom} />

              {/* Sélecteur de pays + téléphone */}
              <Text style={s.etiquetteChamp}>Téléphone *</Text>
              <View style={s.rangePhone}>
                <TouchableOpacity style={s.selecteurPays} onPress={() => setAfficheurPays(!afficheurPays)}>
                  <Text style={s.indicatif}>{paysSelectionne.indicatif}</Text>
                  <Ionicons name="chevron-down" size={14} color={Couleurs.texte.secondaire} />
                </TouchableOpacity>
                <View style={s.champPhone}>
                  <ChampSaisie
                    placeholder="90 00 00 00"
                    valeur={telephone}
                    onChangerTexte={setTelephone}
                    clavier="phone-pad"
                    erreur={erreurs.telephone}
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                </View>
              </View>

              {/* Liste des pays */}
              {afficheurPays && (
                <View style={s.listePays}>
                  {PAYS_AFRIQUE.map(p => (
                    <TouchableOpacity
                      key={p.code}
                      style={s.elementPays}
                      onPress={() => { setPaysSelectionne(p); setAfficheurPays(false); }}
                    >
                      <Text style={s.nomPays}>{p.nom}</Text>
                      <Text style={s.indicatifPays}>{p.indicatif}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          <ChampSaisie etiquette="Email *" placeholder="email@example.com" valeur={email} onChangerTexte={setEmail} icone="mail-outline" clavier="email-address" erreur={erreurs.email} />
          <ChampSaisie etiquette="Mot de passe *" placeholder="••••••••" valeur={motDePasse} onChangerTexte={setMotDePasse} icone="lock-closed-outline" motDePasse erreur={erreurs.motDePasse} />

          {mode === 'inscription' && (
            <ChampSaisie etiquette="Confirmer le mot de passe *" placeholder="••••••••" valeur={confirmation} onChangerTexte={setConfirmation} icone="lock-closed-outline" motDePasse erreur={erreurs.confirmation} />
          )}

          {mode === 'connexion' && (
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
              <Text style={{ fontSize: 13, color: Couleurs.secondaire, fontWeight: '600' }}>Mot de passe oublié?</Text>
            </TouchableOpacity>
          )}

          <Bouton titre={mode === 'connexion' ? 'Se connecter' : "S'inscrire"} onPress={gererSoumission} chargement={chargement} style={{ marginBottom: 14 }} />

          <View style={s.separateur}>
            <View style={s.ligne} /><Text style={s.texteOu}>ou</Text><View style={s.ligne} />
          </View>

          <TouchableOpacity style={s.boutonGoogle}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={s.texteGoogle}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.lienAdmin} onPress={() => navigation.navigate('TableauBordAdmin' as any)}>
            <Ionicons name="shield-outline" size={15} color={Couleurs.texte.clair} />
            <Text style={s.texteAdmin}>Accès administrateur</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  enTete: { height: height * 0.32, justifyContent: 'flex-end', paddingBottom: 40, alignItems: 'center' },
  boutonRetour: {
    position: 'absolute',
    top: 52,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  texteRetour: { fontSize: 13, color: Couleurs.blanc, fontWeight: '600' },
  logoWrap: { alignItems: 'center' },
  logoIcone: { width: 68, height: 68, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  logoTexte: { fontSize: 30, fontWeight: '800', color: Couleurs.blanc },
  logoSous: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  carte: { backgroundColor: Couleurs.blanc, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -18, padding: 22, paddingBottom: 40 },
  onglets: { flexDirection: 'row', backgroundColor: Couleurs.fond, borderRadius: RayonBordure.lg, padding: 4, marginBottom: 22 },
  onglet: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: RayonBordure.md },
  ongletActif: { backgroundColor: Couleurs.blanc, elevation: 3 },
  texteOnglet: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.secondaire },
  texteOngletActif: { color: Couleurs.primaire },
  etiquette: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.secondaire, marginBottom: 10 },
  rangeType: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  boutonType: { flex: 1, padding: 10, borderRadius: RayonBordure.lg, borderWidth: 1.5, borderColor: Couleurs.bordure, alignItems: 'center', gap: 4 },
  boutonTypeActif: { backgroundColor: Couleurs.primaire, borderColor: Couleurs.primaire },
  etiquetteType: { fontSize: 12, fontWeight: '700', color: Couleurs.primaire },
  descriptionType: { fontSize: 10, color: Couleurs.texte.clair, textAlign: 'center' },
  etiquetteChamp: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 6 },
  rangePhone: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  selecteurPays: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: Couleurs.bordure, borderRadius: RayonBordure.md, paddingHorizontal: 12, paddingVertical: 14, backgroundColor: Couleurs.blanc },
  indicatif: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.primaire },
  champPhone: { flex: 1 },
  listePays: { backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.md, borderWidth: 1, borderColor: Couleurs.bordure, marginBottom: 16, overflow: 'hidden' },
  elementPays: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: Couleurs.bordure },
  nomPays: { fontSize: 14, color: Couleurs.texte.primaire },
  indicatifPays: { fontSize: 14, color: Couleurs.texte.secondaire, fontWeight: '600' },
  separateur: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  ligne: { flex: 1, height: 1, backgroundColor: Couleurs.bordure },
  texteOu: { fontSize: 12, color: Couleurs.texte.clair },
  boutonGoogle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1.5, borderColor: Couleurs.bordure, borderRadius: RayonBordure.lg, paddingVertical: 13 },
  texteGoogle: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.primaire },
  lienAdmin: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  texteAdmin: { fontSize: 12, color: Couleurs.texte.clair },
});