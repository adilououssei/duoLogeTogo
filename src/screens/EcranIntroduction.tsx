import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, RayonBordure } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface Diapositive { id: string; image: string; titre: string; description: string; }

const diapositives: Diapositive[] = [
  { id: '1', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', titre: 'Trouvez votre\nLogement Idéal', description: 'Des milliers de chambres, studios et terrains disponibles partout au Togo.' },
  { id: '2', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', titre: 'Informations\nEn Temps Réel', description: 'Des annonces toujours à jour avec prix, avances et cautions clairement affichés.' },
  { id: '3', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', titre: 'Connectez-vous\nDirectement', description: 'Messages, appels et vidéos intégrés. Échangez avec les agents sans quitter l\'app.' },
];

export default function EcranIntroduction({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList<Diapositive>>(null);

  const suivant = () => {
    if (index < diapositives.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.replace('Authentification');
    }
  };

  const rendreDiapositive: ListRenderItem<Diapositive> = ({ item }) => (
    <View style={{ width, height }}>
      <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.88)']} style={s.degrade} />
      <View style={s.contenu}>
        <View style={s.rangeLogo}>
          <View style={s.boiteLogo}><Ionicons name="home" size={22} color={Couleurs.blanc} /></View>
          <Text style={s.texteLogo}>LogeTogo</Text>
        </View>
        <Text style={s.titre}>{item.titre}</Text>
        <Text style={s.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        ref={ref}
        data={diapositives}
        keyExtractor={i => i.id}
        horizontal pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={rendreDiapositive}
      />
      <View style={s.controles}>
        <View style={s.points}>
          {diapositives.map((_, i) => (
            <View key={i} style={[s.point, i === index && s.pointActif]} />
          ))}
        </View>
        <View style={s.boutons}>
          {index < diapositives.length - 1 ? (
            <>
              <TouchableOpacity onPress={() => navigation.replace('Authentification')} style={s.boutonPasser}>
                <Text style={s.textePasser}>Passer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={suivant} style={s.boutonSuivant}>
                <Text style={s.texteSuivant}>Suivant</Text>
                <Ionicons name="arrow-forward" size={18} color={Couleurs.blanc} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={suivant} style={[s.boutonSuivant, { flex: 1 }]}>
              <Text style={s.texteSuivant}>Commencer</Text>
              <Ionicons name="arrow-forward" size={18} color={Couleurs.blanc} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  degrade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65 },
  contenu: { position: 'absolute', bottom: 200, left: 0, right: 0, paddingHorizontal: 30 },
  rangeLogo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  boiteLogo: { width: 38, height: 38, borderRadius: 12, backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  texteLogo: { fontSize: 22, fontWeight: '800', color: Couleurs.blanc },
  titre: { fontSize: 34, fontWeight: '800', color: Couleurs.blanc, lineHeight: 42, marginBottom: 14 },
  description: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 24 },
  controles: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 28, paddingBottom: 50, paddingTop: 22 },
  points: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 22 },
  point: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  pointActif: { width: 24, backgroundColor: Couleurs.accent },
  boutons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  boutonPasser: { paddingVertical: 14, paddingHorizontal: 16 },
  textePasser: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '600' },
  boutonSuivant: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Couleurs.primaire, borderRadius: RayonBordure.lg, paddingVertical: 16 },
  texteSuivant: { color: Couleurs.blanc, fontSize: 15, fontWeight: '700' },
});
