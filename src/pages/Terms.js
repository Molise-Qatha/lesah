import React from 'react';
import LegalPage from '../components/LegalPage';
import { termsSections } from '../data/legalContent';

function Terms() {
  return <LegalPage title="Terms of Use" sections={termsSections} showAdminNotice={true} />;
}

export default Terms;