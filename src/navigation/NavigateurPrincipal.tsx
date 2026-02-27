import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs } from '../theme/theme';

// Écrans
import EcranIntroduction       from '../screens/EcranIntroduction';
import EcranAuthentification   from '../screens/auth/EcranAuthentification';
import EcranAccueil            from '../screens/tenant/EcranAccueil';
import EcranDetailAnnonce      from '../screens/tenant/EcranDetailAnnonce';
import { EcranConversations, EcranChat } from '../screens/EcranMessages';
import EcranProfil             from '../screens/EcranProfil';
import EcranFavoris            from '../screens/EcranFavoris';
import EcranNotifications      from '../screens/EcranNotifications';
import EcranRecherche          from '../screens/EcranRecherche';
import TableauBordAgent        from '../screens/agent/TableauBordAgent';
import EcranAjoutAnnonce       from '../screens/agent/EcranAjoutAnnonce';
import TableauBordProprietaire from '../screens/owner/TableauBordProprietaire';


const Pile = createNativeStackNavigator();
const Onglets = createBottomTabNavigator();

const STYLE_BARRE_ONGLETS = {
  tabBarActiveTintColor:   Couleurs.primaire,
  tabBarInactiveTintColor: Couleurs.texte.clair,
  tabBarStyle: { borderTopWidth: 1, borderTopColor: Couleurs.bordure, height: 78, paddingBottom: 18 },
  tabBarLabelStyle: { fontSize: 10, fontWeight: '600' as const },
  headerShown: false,
};

// ─── Onglets Locataire ────────────────────────────────────────────────────────
function OngletsLocataire() {
  return (
    <Onglets.Navigator screenOptions={STYLE_BARRE_ONGLETS}>
      <Onglets.Screen
        name="Accueil"
        component={EcranAccueil}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
        }}
      />
      <Onglets.Screen
        name="Favoris"
        component={EcranFavoris}
        options={{
          tabBarLabel: 'Favoris',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />,
        }}
      />
      <Onglets.Screen
        name="Conversations"
        component={EcranConversations}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />,
        }}
      />
      <Onglets.Screen
        name="Profil"
        component={EcranProfil}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />,
        }}
      />
    </Onglets.Navigator>
  );
}

// ─── Onglets Agent ────────────────────────────────────────────────────────────
function OngletsAgent() {
  return (
    <Onglets.Navigator screenOptions={STYLE_BARRE_ONGLETS}>

      {/* ✅ Onglet Accueil : voir les annonces comme les locataires */}
      <Onglets.Screen
        name="Accueil"
        component={EcranAccueil}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
        }}
      />

      {/* Tableau de bord agent */}
      <Onglets.Screen
        name="Dashboard"
        component={TableauBordAgent}
        options={{
          tabBarLabel: 'Tableau de bord',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />,
        }}
      />

      <Onglets.Screen
        name="Conversations"
        component={EcranConversations}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />,
        }}
      />
      <Onglets.Screen
        name="Profil"
        component={EcranProfil}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />,
        }}
      />
    </Onglets.Navigator>
  );
}

// ─── Onglets Propriétaire ─────────────────────────────────────────────────────
function OngletsProprietaire() {
  return (
    <Onglets.Navigator screenOptions={STYLE_BARRE_ONGLETS}>

      {/* ✅ Onglet Accueil : voir les annonces comme les locataires */}
      <Onglets.Screen
        name="Accueil"
        component={EcranAccueil}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
        }}
      />

      {/* Tableau de bord propriétaire */}
      <Onglets.Screen
        name="Dashboard"
        component={TableauBordProprietaire}
        options={{
          tabBarLabel: 'Mes biens',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'business' : 'business-outline'} size={size} color={color} />,
        }}
      />

      <Onglets.Screen
        name="Conversations"
        component={EcranConversations}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />,
        }}
      />
      <Onglets.Screen
        name="Profil"
        component={EcranProfil}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />,
        }}
      />
    </Onglets.Navigator>
  );
}

// ─── Navigateur Principal ─────────────────────────────────────────────────────
export default function NavigateurPrincipal() {
  return (
    <NavigationContainer>
      <Pile.Navigator screenOptions={{ headerShown: false }} initialRouteName="OngletLocataire">
        <Pile.Screen name="Introduction"        component={EcranIntroduction} />
        <Pile.Screen name="Authentification"    component={EcranAuthentification} />
        <Pile.Screen name="OngletLocataire"     component={OngletsLocataire} />
        <Pile.Screen name="OngletAgent"         component={OngletsAgent} />
        <Pile.Screen name="OngletProprietaire"  component={OngletsProprietaire} />
        <Pile.Screen name="DetailAnnonce"       component={EcranDetailAnnonce} />
        <Pile.Screen name="Profil"              component={EcranProfil} />
        <Pile.Screen name="Notifications"       component={EcranNotifications} />
        <Pile.Screen name="Chat"                component={EcranChat} />
        <Pile.Screen name="Favoris"             component={EcranFavoris} />
        <Pile.Screen name="Recherche"           component={EcranRecherche} />
        <Pile.Screen name="AjoutAnnonce"        component={EcranAjoutAnnonce} />
      </Pile.Navigator>
    </NavigationContainer>
  );
}