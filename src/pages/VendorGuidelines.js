import React from 'react';
import LegalPage from '../components/LegalPage';
import { vendorSections } from '../data/legalContent';

function VendorGuidelines() {
  return <LegalPage title="Vendor Guidelines" sections={vendorSections} showAdminNotice={true} />;
}

export default VendorGuidelines;