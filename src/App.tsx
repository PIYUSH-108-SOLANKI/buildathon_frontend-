import React from 'react';
import { ArchitectureHomePage } from '@/pages/ArchitectureHomePage';
import { OperationalProvider } from '@/context/OperationalContext';

export const App: React.FC = () => {
  return (
    <OperationalProvider>
      <ArchitectureHomePage />
    </OperationalProvider>
  );
};

export default App;
