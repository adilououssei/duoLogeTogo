import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FournisseurApp } from './src/contexte/ContexteApp';
import NavigateurPrincipal from './src/navigation/NavigateurPrincipal';

function App() {
  return (
    <SafeAreaProvider>
      <FournisseurApp>
        <NavigateurPrincipal />
      </FournisseurApp>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);