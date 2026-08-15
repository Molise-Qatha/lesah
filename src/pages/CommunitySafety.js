import React from 'react';
import LegalPage from '../components/LegalPage';
import { safetySections } from '../data/legalContent';

function CommunitySafety() {
  return <LegalPage title="Community & Safety Policy" sections={safetySections} showAdminNotice={true} />;
}

export default CommunitySafety;