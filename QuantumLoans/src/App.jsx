import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetaMaskProvider } from '@metamask/sdk-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Borrow from './pages/Borrow';
import Lend from './pages/Lend';
import CryptoHealth from './pages/CryptoHealth';

function App() {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false,
        dappMetadata: {
          name: "Your App Name",
          url: window.location.host,
        }
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/lend" element={<Lend />} />
          <Route path="/cryptohealth" element={<CryptoHealth />} />
        </Routes>
      </Router>
    </MetaMaskProvider>
  );
}

export default App;