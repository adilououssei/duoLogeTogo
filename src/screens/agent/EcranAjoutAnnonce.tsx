// @ts-check
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Switch, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Couleurs, Espacement, RayonBordure } from '../../theme/theme';
import { Bouton, ChampSaisie, Puce } from '../../components/commun/Composants';
import { TYPES_BIENS, TYPES_TRANSACTION, QUARTIERS, EQUIPEMENTS_LISTE } from '../../donnees/donneesFictives';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function EcranAjoutAnnonce({ navigation, route }: { navigation: any; route: any }) {
  const existant = route?.params?.bien;
  const estModification = !!existant;

  const [etape, setEtape] = useState(1);
  const [titre, setTitre] = useState(existant?.titre ?? '');
  const [type, setType] = useState(existant?.type ?? 'Chambre');
  const [typeTransaction, setTypeTransaction] = useState(existant?.typeTransaction ?? 'location');
  const [quartier, setQuartier] = useState(existant?.quartier ?? 'Golfe');
  const [localisation, setLocalisation] = useState(existant?.localisation ?? '');
  const [description, setDescription] = useState(existant?.description ?? '');

  // Prix
  const [prixMensuel, setPrixMensuel] = useState(existant?.infoPrix?.prixMensuel ? String(existant.infoPrix.prixMensuel) : existant?.prix ? String(existant.prix) : '');
  const [avanceMois, setAvanceMois] = useState(existant?.infoPrix?.avanceMois ? String(existant.infoPrix.avanceMois) : '6');
  const [cautionMois, setCautionMois] = useState(existant?.infoPrix?.cautionMois ? String(existant.infoPrix.cautionMois) : '3');
  const [commission, setCommission] = useState(existant?.infoPrix?.commissionDemarcheur ? String(existant.infoPrix.commissionDemarcheur) : '');

  const [chambres, setChambres] = useState(existant?.chambres ? String(existant.chambres) : '1');
  const [sallesDeBain, setSallesDeBain] = useState(existant?.sallesDeBain ? String(existant.sallesDeBain) : '0');
  const [superficie, setSuperficie] = useState(existant?.superficie ? String(existant.superficie) : '');
  const [equipements, setEquipements] = useState<string[]>(existant?.equipements ?? []);
  const [equipementPersonnalise, setEquipementPersonnalise] = useState('');
  const [disponible, setDisponible] = useState(existant?.statut !== 'occupe');
  const [images, setImages] = useState<string[]>(existant?.images ?? []);
  const [videos, setVideos] = useState<string[]>(existant?.videos ?? []);
  const [chargement, setChargement] = useState(false);

  const basculerEquipement = (e: string) =>
    setEquipements(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const ajouterEquipementPerso = () => {
    if (!equipementPersonnalise.trim()) return;
    if (!equipements.includes(equipementPersonnalise.trim())) {
      setEquipements(prev => [...prev, equipementPersonnalise.trim()]);
    }
    setEquipementPersonnalise('');
  };

  const choisirImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsMultipleSelection: true });
    if (!result.canceled) setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
  };

  const choisirVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, quality: 0.8 });
    if (!result.canceled) setVideos(prev => [...prev, ...result.assets.map(a => a.uri)]);
  };

  const gererSoumission = () => {
    if (!titre.trim() || !prixMensuel.trim() || !localisation.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre, le prix et la localisation.'); return;
    }
    setChargement(true);
    setTimeout(() => {
      setChargement(false);
      Alert.alert('Succès', estModification ? 'Annonce modifiée!' : 'Annonce publiée!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1200);
  };

  const avanceTotale = parseInt(prixMensuel || '0') * parseInt(avanceMois || '0');
  const commissionCalculee = commission || prixMensuel;

  return (
    <SafeAreaView style={s.conteneur}>
      {/* En-tête */}
      <View style={s.enTete}>
        <TouchableOpacity onPress={() => etape > 1 ? setEtape(etape - 1) : navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
        </TouchableOpacity>
        <Text style={s.titreEnTete}>{estModification ? 'Modifier l\'annonce' : 'Nouvelle annonce'}</Text>
        <Text style={s.indicateurEtape}>{etape} / 3</Text>
      </View>

      {/* Barre de progression */}
      <View style={s.fondProgression}>
        <View style={[s.remplissageProgression, { width: `${(etape / 3) * 100}%` }]} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Espacement.base }} showsVerticalScrollIndicator={false}>

        {/* ÉTAPE 1 - Informations générales */}
        {etape === 1 && (
          <>
            <Text style={s.titreEtape}>Informations générales</Text>
            <ChampSaisie etiquette="Titre *" placeholder="Ex: Chambre meublée à Adidogomé" valeur={titre} onChangerTexte={setTitre} icone="home-outline" />
            <ChampSaisie etiquette="Description" placeholder="Décrivez le logement..." valeur={description} onChangerTexte={setDescription} multiLigne nombreLignes={4} />

            <Text style={s.etiquetteChamp}>Type de transaction</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <TouchableOpacity
                style={[s.boutonTransac, typeTransaction === 'location' && s.boutonTransacActif]}
                onPress={() => setTypeTransaction('location')}
              >
                <Ionicons name="home" size={20} color={typeTransaction === 'location' ? Couleurs.blanc : Couleurs.primaire} />
                <Text style={[s.texteTransac, typeTransaction === 'location' && { color: Couleurs.blanc }]}>Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.boutonTransac, typeTransaction === 'vente' && s.boutonTransacActif]}
                onPress={() => setTypeTransaction('vente')}
              >
                <Ionicons name="cash" size={20} color={typeTransaction === 'vente' ? Couleurs.blanc : Couleurs.primaire} />
                <Text style={[s.texteTransac, typeTransaction === 'vente' && { color: Couleurs.blanc }]}>Vente</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.etiquetteChamp}>Type de bien</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {TYPES_BIENS.filter(t => t !== 'Tous').map(t => <Puce key={t} etiquette={t} selectionnee={type === t} onPress={() => setType(t)} />)}
            </ScrollView>

            <Text style={s.etiquetteChamp}>Quartier</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {QUARTIERS.filter(d => d !== 'Tous').map(d => <Puce key={d} etiquette={d} selectionnee={quartier === d} onPress={() => setQuartier(d)} />)}
            </ScrollView>

            <ChampSaisie etiquette="Localisation précise *" placeholder="Quartier, rue..." valeur={localisation} onChangerTexte={setLocalisation} icone="location-outline" />
          </>
        )}

        {/* ÉTAPE 2 - Détails et Prix */}
        {etape === 2 && (
          <>
            <Text style={s.titreEtape}>Détails & Prix</Text>

            {/* Prix selon le type de transaction */}
            {typeTransaction === 'location' ? (
              <>
                <ChampSaisie etiquette="Prix mensuel (FCFA) *" placeholder="Ex: 25000" valeur={prixMensuel} onChangerTexte={setPrixMensuel} clavier="numeric" icone="cash-outline" />

                <View style={s.grillePrix}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.etiquetteChamp}>Avance (mois) *</Text>
                    <ChampSaisie valeur={avanceMois} onChangerTexte={setAvanceMois} clavier="numeric" placeholder="Ex: 6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.etiquetteChamp}>Caution (mois offerts)</Text>
                    <ChampSaisie valeur={cautionMois} onChangerTexte={setCautionMois} clavier="numeric" placeholder="Ex: 3" />
                  </View>
                </View>

                <ChampSaisie
                  etiquette="Commission démarcheur (FCFA)"
                  placeholder={`Par défaut: ${prixMensuel || '0'} FCFA (1 mois)`}
                  valeur={commission}
                  onChangerTexte={setCommission}
                  clavier="numeric"
                  icone="person-outline"
                />

                {/* Récapitulatif financier */}
                {prixMensuel && (
                  <View style={s.recapFinancier}>
                    <Text style={s.titreRecap}>💰 Récapitulatif pour le locataire</Text>
                    <Text style={s.ligneRecap}>• Avance : {parseInt(prixMensuel) * parseInt(avanceMois || '0')} FCFA ({avanceMois} mois)</Text>
                    <Text style={s.ligneRecap}>• Caution : {cautionMois} mois offerts avant paiement</Text>
                    <Text style={s.ligneRecap}>• Commission : {commissionCalculee} FCFA</Text>
                    <Text style={[s.ligneRecap, { fontWeight: '700', marginTop: 6 }]}>
                      Total à l'entrée : {(parseInt(prixMensuel) * parseInt(avanceMois || '0') + parseInt(commissionCalculee || '0')).toLocaleString()} FCFA
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <ChampSaisie etiquette="Prix de vente (FCFA) *" placeholder="Ex: 8500000" valeur={prixMensuel} onChangerTexte={setPrixMensuel} clavier="numeric" icone="cash-outline" />
            )}

            {/* Infos physiques (sauf terrains) */}
            {type !== 'Terrain' && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <ChampSaisie etiquette="Chambres" valeur={chambres} onChangerTexte={setChambres} clavier="numeric" style={{ flex: 1 }} />
                <ChampSaisie etiquette="Salle de bain" valeur={sallesDeBain} onChangerTexte={setSallesDeBain} clavier="numeric" style={{ flex: 1 }} />
              </View>
            )}
            <ChampSaisie etiquette="Superficie m²" valeur={superficie} onChangerTexte={setSuperficie} clavier="numeric" />

            {/* Équipements avec saisie personnalisée */}
            <Text style={s.etiquetteChamp}>Équipements</Text>
            <View style={s.grilleEquipements}>
              {EQUIPEMENTS_LISTE.map(e => (
                <TouchableOpacity key={e} style={[s.puceEquipement, equipements.includes(e) && s.puceEquipementActive]} onPress={() => basculerEquipement(e)}>
                  <Ionicons name={equipements.includes(e) ? 'checkmark-circle' : 'add-circle-outline'} size={15} color={equipements.includes(e) ? Couleurs.blanc : Couleurs.texte.secondaire} />
                  <Text style={[s.textePuceEquipement, equipements.includes(e) && { color: Couleurs.blanc }]}>{e}</Text>
                </TouchableOpacity>
              ))}
              {/* Équipements personnalisés */}
              {equipements.filter(e => !EQUIPEMENTS_LISTE.includes(e)).map(e => (
                <TouchableOpacity key={e} style={[s.puceEquipement, s.puceEquipementActive]} onPress={() => basculerEquipement(e)}>
                  <Ionicons name="checkmark-circle" size={15} color={Couleurs.blanc} />
                  <Text style={[s.textePuceEquipement, { color: Couleurs.blanc }]}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ajout équipement personnalisé */}
            <View style={s.rangeEquipementPerso}>
              <TextInput
                style={s.champEquipementPerso}
                placeholder="Ajouter un équipement personnalisé..."
                placeholderTextColor={Couleurs.texte.clair}
                value={equipementPersonnalise}
                onChangeText={setEquipementPersonnalise}
              />
              <TouchableOpacity style={s.boutonAjouterEquipement} onPress={ajouterEquipementPerso}>
                <Ionicons name="add" size={22} color={Couleurs.blanc} />
              </TouchableOpacity>
            </View>

            {typeTransaction === 'location' && (
              <View style={s.rangeBascule}>
                <View>
                  <Text style={s.etiquetteBascule}>Disponible immédiatement</Text>
                  <Text style={{ fontSize: 12, color: Couleurs.texte.secondaire }}>Le logement est prêt à être loué</Text>
                </View>
                <Switch value={disponible} onValueChange={setDisponible} trackColor={{ false: Couleurs.bordure, true: Couleurs.primaire + '80' }} thumbColor={disponible ? Couleurs.primaire : Couleurs.texte.clair} />
              </View>
            )}
          </>
        )}

        {/* ÉTAPE 3 - Photos et Vidéos */}
        {etape === 3 && (
          <>
            <Text style={s.titreEtape}>Photos & Vidéos</Text>
            <Text style={{ fontSize: 13, color: Couleurs.texte.secondaire, marginBottom: 16, lineHeight: 20 }}>
              Ajoutez des photos et vidéos de qualité pour attirer plus d'intéressés (max 8 photos + 3 vidéos)
            </Text>

            {/* Photos */}
            <Text style={s.etiquetteChamp}>Photos ({images.length}/8)</Text>
            <View style={s.grilleImages}>
              {images.map((img, i) => (
                <View key={i} style={s.enveloppeImg}>
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  {i === 0 && <View style={s.badgePrincipale}><Text style={{ fontSize: 9, color: Couleurs.blanc, fontWeight: '700' }}>Principale</Text></View>}
                  <TouchableOpacity style={s.boutonSupprimer} onPress={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
                    <Ionicons name="close-circle" size={22} color={Couleurs.erreur} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 8 && (
                <TouchableOpacity style={s.boutonAjouterImg} onPress={choisirImage}>
                  <Ionicons name="camera-outline" size={30} color={Couleurs.primaire} />
                  <Text style={{ fontSize: 11, color: Couleurs.primaire, fontWeight: '600' }}>Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Vidéos */}
            <Text style={[s.etiquetteChamp, { marginTop: 16 }]}>Vidéos ({videos.length}/3)</Text>
            <View style={s.grilleImages}>
              {videos.map((vid, i) => (
                <View key={i} style={s.enveloppeImg}>
                  <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="videocam" size={32} color={Couleurs.blanc} />
                    <Text style={{ color: Couleurs.blanc, fontSize: 10, marginTop: 4 }}>Vidéo {i + 1}</Text>
                  </View>
                  <TouchableOpacity style={s.boutonSupprimer} onPress={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}>
                    <Ionicons name="close-circle" size={22} color={Couleurs.erreur} />
                  </TouchableOpacity>
                </View>
              ))}
              {videos.length < 3 && (
                <TouchableOpacity style={s.boutonAjouterImg} onPress={choisirVideo}>
                  <Ionicons name="videocam-outline" size={30} color={Couleurs.secondaire} />
                  <Text style={{ fontSize: 11, color: Couleurs.secondaire, fontWeight: '600' }}>Vidéo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Récapitulatif */}
            <View style={s.recapFinal}>
              <Text style={s.titreRecapFinal}>Récapitulatif</Text>
              <Text style={s.ligneRecapFinal}>📍 {localisation || 'Non défini'}</Text>
              <Text style={s.ligneRecapFinal}>🏠 {type} ({typeTransaction}) · {superficie}m²</Text>
              <Text style={s.ligneRecapFinal}>💰 {parseInt(prixMensuel || '0').toLocaleString()} FCFA{typeTransaction === 'location' ? '/mois' : ' (vente)'}</Text>
              {typeTransaction === 'location' && <Text style={s.ligneRecapFinal}>📅 Avance : {avanceMois} mois · Caution : {cautionMois} mois</Text>}
              <Text style={s.ligneRecapFinal}>📸 {images.length} photo(s) · 🎥 {videos.length} vidéo(s) · ⚙️ {equipements.length} équipement(s)</Text>
            </View>
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Pied de page */}
      <View style={s.piedPage}>
        {etape < 3
          ? <Bouton titre="Suivant" onPress={() => setEtape(etape + 1)} icone="arrow-forward" />
          : <Bouton titre={estModification ? 'Sauvegarder' : 'Publier l\'annonce'} onPress={gererSoumission} chargement={chargement} icone="cloud-upload-outline" />
        }
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  enTete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Espacement.base, paddingVertical: Espacement.md, backgroundColor: Couleurs.blanc },
  titreEnTete: { fontSize: 17, fontWeight: '700', color: Couleurs.texte.primaire },
  indicateurEtape: { fontSize: 13, color: Couleurs.texte.secondaire, fontWeight: '600' },
  fondProgression: { height: 3, backgroundColor: Couleurs.bordure },
  remplissageProgression: { height: 3, backgroundColor: Couleurs.primaire },
  titreEtape: { fontSize: 19, fontWeight: '800', color: Couleurs.texte.primaire, marginBottom: 16 },
  etiquetteChamp: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 8 },
  boutonTransac: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: RayonBordure.lg, borderWidth: 1.5, borderColor: Couleurs.bordure, backgroundColor: Couleurs.blanc },
  boutonTransacActif: { backgroundColor: Couleurs.primaire, borderColor: Couleurs.primaire },
  texteTransac: { fontSize: 14, fontWeight: '700', color: Couleurs.primaire },
  grillePrix: { flexDirection: 'row', gap: 10, marginBottom: 0 },
  recapFinancier: { backgroundColor: Couleurs.primaire + '10', borderRadius: RayonBordure.lg, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: Couleurs.primaire + '25' },
  titreRecap: { fontSize: 13, fontWeight: '700', color: Couleurs.primaire, marginBottom: 8 },
  ligneRecap: { fontSize: 12, color: Couleurs.texte.primaire, marginBottom: 4 },
  grilleEquipements: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  puceEquipement: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, borderRadius: RayonBordure.complet, borderWidth: 1.5, borderColor: Couleurs.bordure, backgroundColor: Couleurs.blanc },
  puceEquipementActive: { backgroundColor: Couleurs.primaire, borderColor: Couleurs.primaire },
  textePuceEquipement: { fontSize: 12, fontWeight: '500', color: Couleurs.texte.secondaire },
  rangeEquipementPerso: { flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'center' },
  champEquipementPerso: { flex: 1, borderWidth: 1.5, borderColor: Couleurs.bordure, borderRadius: RayonBordure.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Couleurs.texte.primaire, backgroundColor: Couleurs.blanc },
  boutonAjouterEquipement: { width: 44, height: 44, borderRadius: RayonBordure.md, backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  rangeBascule: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 14, marginBottom: 16 },
  etiquetteBascule: { fontSize: 14, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 2 },
  grilleImages: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  enveloppeImg: { width: '47%', height: 120, borderRadius: RayonBordure.lg, overflow: 'hidden', position: 'relative' },
  badgePrincipale: { position: 'absolute', top: 6, left: 6, backgroundColor: Couleurs.primaire, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  boutonSupprimer: { position: 'absolute', top: 4, right: 4, backgroundColor: Couleurs.blanc, borderRadius: 12 },
  boutonAjouterImg: { width: '47%', height: 120, borderRadius: RayonBordure.lg, borderWidth: 2, borderColor: Couleurs.primaire, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: Couleurs.primaire + '0A' },
  recapFinal: { backgroundColor: Couleurs.primaire + '10', borderRadius: RayonBordure.lg, padding: 14, borderWidth: 1, borderColor: Couleurs.primaire + '28' },
  titreRecapFinal: { fontSize: 14, fontWeight: '700', color: Couleurs.primaire, marginBottom: 8 },
  ligneRecapFinal: { fontSize: 13, color: Couleurs.texte.primaire, marginBottom: 5 },
  piedPage: { padding: Espacement.base, backgroundColor: Couleurs.blanc, borderTopWidth: 1, borderTopColor: Couleurs.bordure },
});
