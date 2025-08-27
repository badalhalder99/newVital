import React from 'react';
import TenantHeader from './TenantHeader';
import TenantFooter from './TenantFooter';
import '../../styles/tenant.css';

const TenantLayout = ({ children, tenantData, settings }) => {
  return (
    <>
      {/* Animated background shapes */}
      <div className="tenant-bg-shapes">
        <div className="tenant-shape"></div>
        <div className="tenant-shape"></div>
        <div className="tenant-shape"></div>
        <div className="tenant-shape"></div>
        <div className="tenant-shape"></div>
        <div className="tenant-shape"></div>
      </div>

      <div className="min-h-screen tenant-site">
        <TenantHeader tenantData={tenantData} settings={settings} />
        <main className="tenant-main">
          {children}
        </main>
        <TenantFooter tenantData={tenantData} settings={settings} />
      </div>
    </>
  );
};

export default TenantLayout;