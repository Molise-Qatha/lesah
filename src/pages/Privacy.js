import React from 'react';
import LegalPage from '../components/LegalPage';
import { privacySections } from '../data/legalContent';

function Privacy() {
  return <LegalPage title="Privacy Policy" sections={privacySections} showAdminNotice={true} />;
}

export default Privacy;