import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../theme/theme';
import { Avatar } from '../components/commun/Composants';
import { CONVERSATIONS_FICTIVES } from '../donnees/donneesFictives';
import { Conversation, Message } from '../types/modeles';
import {EnTete} from '../components/EnTete';
import { SafeAreaView } from 'react-native-safe-area-context';


// ─── ÉCRAN LISTE DES CONVERSATIONS ───────────────────────────────────────────
export function EcranConversations({ navigation }: { navigation: any }) {
  const [conversations] = useState<Conversation[]>(CONVERSATIONS_FICTIVES);

  return (
    <SafeAreaView style={s.conteneur}>
      <EnTete typeEnTete="simple" titre="Messages" />
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Espacement.base }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.rangeConv, item.nonLus > 0 && s.rangeConvNonLue, Ombres.sm]}
            onPress={() => navigation.navigate('Chat', { conversation: item })}
            activeOpacity={0.8}
          >
            <View style={{ position: 'relative' }}>
              <Avatar uri={item.autreUtilisateur.avatar} nom={item.autreUtilisateur.nom} taille={52} />
              {item.nonLus > 0 && (
                <View style={s.badgeNonLus}>
                  <Text style={{ color: Couleurs.blanc, fontSize: 9, fontWeight: '700' }}>{item.nonLus}</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[s.nomConv, item.nonLus > 0 && { fontWeight: '800' }]}>{item.autreUtilisateur.nom}</Text>
                <Text style={s.heureConv}>{item.heureDernierMessage}</Text>
              </View>
              {item.titreBien && (
                <Text style={s.titreBienConv} numberOfLines={1}>📌 {item.titreBien}</Text>
              )}
              <Text style={[s.dernierMsg, item.nonLus > 0 && { color: Couleurs.texte.primaire, fontWeight: '600' }]} numberOfLines={1}>
                {item.dernierMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 80, gap: 12 }}>
            <Ionicons name="chatbubbles-outline" size={55} color={Couleurs.texte.clair} />
            <Text style={{ fontSize: 15, color: Couleurs.texte.secondaire }}>Aucune conversation</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── ÉCRAN CHAT ───────────────────────────────────────────────────────────────
export function EcranChat({ route, navigation }: { route: any; navigation: any }) {
  const { conversation } = route.params as { conversation: Conversation };
  const [texte, setTexte] = useState('');
  const [messages, setMessages] = useState<Message[]>(conversation.messages ?? []);
  const [enregistrement, setEnregistrement] = useState(false);
  const [enAppelAudio, setEnAppelAudio] = useState(false);
  const [enAppelVideo, setEnAppelVideo] = useState(false);

  const envoyerMessage = () => {
    if (!texte.trim()) return;
    const nvMsg: Message = {
      id: `m${Date.now()}`,
      envoyeurId: 'moi',
      texte,
      typeMessage: 'texte',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: false,
    };
    setMessages(prev => [...prev, nvMsg]);
    setTexte('');
  };

  const demarrerEnregistrement = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission micro refusée'); return; }
      setEnregistrement(true);
      Alert.alert('Enregistrement', 'Maintenez pour enregistrer. Relâchez pour envoyer.', [
        { text: 'Annuler', onPress: () => setEnregistrement(false) },
        { text: 'Envoyer', onPress: () => {
          const vocal: Message = {
            id: `m${Date.now()}`,
            envoyeurId: 'moi',
            typeMessage: 'vocal',
            dureeVocal: Math.floor(Math.random() * 30) + 5,
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            lu: false,
          };
          setMessages(prev => [...prev, vocal]);
          setEnregistrement(false);
        }},
      ]);
    } catch (e) { setEnregistrement(false); }
  };

  const demarrerAppel = (video: boolean) => {
    Alert.alert(
      video ? 'Appel vidéo' : 'Appel audio',
      `Appeler ${conversation.autreUtilisateur.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: video ? '📹 Appeler' : '📞 Appeler', onPress: () => {
          if (video) setEnAppelVideo(true);
          else setEnAppelAudio(true);
          setTimeout(() => { setEnAppelAudio(false); setEnAppelVideo(false); }, 5000);
        }},
      ]
    );
  };

  // Affichage en appel
  if (enAppelAudio || enAppelVideo) {
    return (
      <View style={s.ecranAppel}>
        <Avatar uri={conversation.autreUtilisateur.avatar} nom={conversation.autreUtilisateur.nom} taille={100} />
        <Text style={s.nomAppel}>{conversation.autreUtilisateur.nom}</Text>
        <Text style={s.statutAppel}>{enAppelVideo ? '📹 Appel vidéo en cours...' : '📞 Appel en cours...'}</Text>
        <View style={s.controleAppel}>
          <TouchableOpacity style={[s.boutonAppelCtrl, { backgroundColor: Couleurs.secondaire }]} onPress={() => Alert.alert('Micro coupé')}>
            <Ionicons name="mic-off" size={26} color={Couleurs.blanc} />
          </TouchableOpacity>
          {enAppelVideo && (
            <TouchableOpacity style={[s.boutonAppelCtrl, { backgroundColor: Couleurs.secondaire }]} onPress={() => Alert.alert('Caméra coupée')}>
              <Ionicons name="videocam-off" size={26} color={Couleurs.blanc} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[s.boutonAppelCtrl, { backgroundColor: Couleurs.erreur }]} onPress={() => { setEnAppelAudio(false); setEnAppelVideo(false); }}>
            <Ionicons name="call" size={26} color={Couleurs.blanc} style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.conteneur}>
      {/* En-tête du chat */}
      <View style={s.enTeteChat}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
        </TouchableOpacity>
        <Avatar uri={conversation.autreUtilisateur.avatar} nom={conversation.autreUtilisateur.nom} taille={40} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.nomChat}>{conversation.autreUtilisateur.nom}</Text>
          {conversation.titreBien && <Text style={s.bienChat} numberOfLines={1}>📌 {conversation.titreBien}</Text>}
        </View>
        {/* Boutons appel */}
        <TouchableOpacity style={s.boutonIconeChat} onPress={() => demarrerAppel(false)}>
          <Ionicons name="call-outline" size={22} color={Couleurs.primaire} />
        </TouchableOpacity>
        <TouchableOpacity style={s.boutonIconeChat} onPress={() => demarrerAppel(true)}>
          <Ionicons name="videocam-outline" size={22} color={Couleurs.primaire} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Espacement.base, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const estMoi = item.envoyeurId === 'moi';
          return (
            <View style={[s.enveloppeMessage, estMoi ? s.messagesMoi : s.messagesAutre]}>
              {item.typeMessage === 'vocal' ? (
                <TouchableOpacity style={[s.bulle, estMoi ? s.bulleMoi : s.bulleAutre, s.bulleVocale]}>
                  <Ionicons name="play-circle" size={28} color={estMoi ? Couleurs.blanc : Couleurs.primaire} />
                  <View style={s.ondesVocales}>
                    {[...Array(8)].map((_, i) => (
                      <View key={i} style={[s.ondeBar, { height: 6 + Math.random() * 14 }, estMoi ? { backgroundColor: 'rgba(255,255,255,0.7)' } : { backgroundColor: Couleurs.primaire + '60' }]} />
                    ))}
                  </View>
                  <Text style={[s.dureeVocal, { color: estMoi ? Couleurs.blanc : Couleurs.texte.secondaire }]}>
                    {item.dureeVocal}s
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={[s.bulle, estMoi ? s.bulleMoi : s.bulleAutre]}>
                  <Text style={[s.texteMessage, estMoi ? s.texteMessageMoi : s.texteMessageAutre]}>{item.texte}</Text>
                </View>
              )}
              <Text style={[s.heureMessage, estMoi ? { textAlign: 'right' } : {}]}>{item.heure}</Text>
            </View>
          );
        }}
      />

      {/* Zone de saisie */}
      <View style={s.zoneSaisie}>
        <TouchableOpacity style={s.boutonJoindre} onPress={() => Alert.alert('Joindre', 'Choisir : Photo, Vidéo ou Document', [
          { text: '📷 Photo' }, { text: '🎥 Vidéo' }, { text: '📄 Document' }, { text: 'Annuler', style: 'cancel' }
        ])}>
          <Ionicons name="attach" size={24} color={Couleurs.texte.secondaire} />
        </TouchableOpacity>
        <TextInput
          style={s.champMessage}
          placeholder="Écrire un message..."
          placeholderTextColor={Couleurs.texte.clair}
          value={texte}
          onChangeText={setTexte}
          multiline
        />
        {texte.trim() ? (
          <TouchableOpacity style={s.boutonEnvoyer} onPress={envoyerMessage}>
            <Ionicons name="send" size={20} color={Couleurs.blanc} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[s.boutonEnvoyer, enregistrement && { backgroundColor: Couleurs.erreur }]}
            onPress={demarrerEnregistrement}
          >
            <Ionicons name={enregistrement ? 'stop' : 'mic'} size={20} color={Couleurs.blanc} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  rangeConv: { flexDirection: 'row', alignItems: 'center', backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 14 },
  rangeConvNonLue: { borderLeftWidth: 3, borderLeftColor: Couleurs.primaire },
  badgeNonLus: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  nomConv: { fontSize: 14, fontWeight: '700', color: Couleurs.texte.primaire },
  heureConv: { fontSize: 11, color: Couleurs.texte.clair },
  titreBienConv: { fontSize: 11, color: Couleurs.secondaire, marginVertical: 2 },
  dernierMsg: { fontSize: 13, color: Couleurs.texte.secondaire },
  enTeteChat: { flexDirection: 'row', alignItems: 'center', padding: Espacement.md, backgroundColor: Couleurs.blanc, borderBottomWidth: 1, borderBottomColor: Couleurs.bordure, gap: 10 },
  nomChat: { fontSize: 15, fontWeight: '700', color: Couleurs.texte.primaire },
  bienChat: { fontSize: 11, color: Couleurs.secondaire },
  boutonIconeChat: { width: 38, height: 38, borderRadius: 19, backgroundColor: Couleurs.primaire + '15', alignItems: 'center', justifyContent: 'center' },
  enveloppeMessage: { marginBottom: 10 },
  messagesMoi: { alignItems: 'flex-end' },
  messagesAutre: { alignItems: 'flex-start' },
  bulle: { maxWidth: '75%', borderRadius: RayonBordure.lg, padding: 12 },
  bulleMoi: { backgroundColor: Couleurs.primaire, borderBottomRightRadius: 4 },
  bulleAutre: { backgroundColor: Couleurs.blanc, borderBottomLeftRadius: 4, ...Ombres.sm },
  bulleVocale: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  texteMessage: { fontSize: 14, lineHeight: 20 },
  texteMessageMoi: { color: Couleurs.blanc },
  texteMessageAutre: { color: Couleurs.texte.primaire },
  heureMessage: { fontSize: 10, color: Couleurs.texte.clair, marginTop: 3, marginHorizontal: 4 },
  ondesVocales: { flexDirection: 'row', alignItems: 'center', gap: 3, width: 60 },
  ondeBar: { width: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' },
  dureeVocal: { fontSize: 11, fontWeight: '600' },
  zoneSaisie: { flexDirection: 'row', alignItems: 'flex-end', padding: Espacement.sm, backgroundColor: Couleurs.blanc, borderTopWidth: 1, borderTopColor: Couleurs.bordure, gap: 8 },
  boutonJoindre: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  champMessage: { flex: 1, minHeight: 42, maxHeight: 120, backgroundColor: Couleurs.fond, borderRadius: 21, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: Couleurs.texte.primaire },
  boutonEnvoyer: { width: 42, height: 42, borderRadius: 21, backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  ecranAppel: { flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', gap: 20 },
  nomAppel: { fontSize: 26, fontWeight: '800', color: Couleurs.blanc },
  statutAppel: { fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  controleAppel: { flexDirection: 'row', gap: 20, marginTop: 40 },
  boutonAppelCtrl: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
