// src/pages/ProviderRouter.js
// Routes /provider/:id to the correct vendor component.
// Maseeiso keeps using the ORIGINAL ProviderProfile.js untouched.
import React from 'react';
import { useParams, Link } from 'react-router-dom';

import ProviderProfile from './ProviderProfile'; // existing Maseeiso page — untouched
import EasyLearnProfile from './EasyLearnProfile';
import HairVendorProfile from './HairVendorProfile';

const ROUTES = {
  maseeiso: ProviderProfile,
  easylearn: EasyLearnProfile,
  pontso: HairVendorProfile,
};

function NotFound({ id }) {
  return (
    <div style={{ padding: '4rem 1.5rem', textAlign: 'center', fontFamily: 'inherit' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Provider not found</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        No provider matches &quot;<code>{id}</code>&quot;.
      </p>
      <Link
        to="/marketplace"
        style={{
          display: 'inline-block',
          padding: '0.6rem 1.2rem',
          background: '#0a4d8c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Marketplace
      </Link>
    </div>
  );
}

function ProviderRouter() {
  const { id } = useParams();
  const Component = ROUTES[id];
  if (!Component) return <NotFound id={id} />;
  return <Component />;
}

export default ProviderRouter;