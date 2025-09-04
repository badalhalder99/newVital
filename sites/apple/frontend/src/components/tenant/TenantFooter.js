import React from 'react';
import { useParams } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const TenantFooter = ({ tenantData, settings }) => {
  const { tenantName } = useParams();
  const siteName = settings?.site_name || tenantData?.name || 'Your Business';
  const primaryColor = settings?.primary_color || '#10b981';
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin
  };

  return (
    <footer className="tenant-footer" style={{ '--primary-color': primaryColor }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{siteName}</h3>
            {settings?.site_tagline && (
              <p className="text-gray-300">{settings.site_tagline}</p>
            )}
            {settings?.meta_description && (
              <p className="text-gray-400 text-sm">{settings.meta_description}</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href={`/${tenantName}`} className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href={`/${tenantName}/about`} className="text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href={`/${tenantName}/services`} className="text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href={`/${tenantName}/testimonials`} className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href={`/${tenantName}/contact`} className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <ul className="space-y-2">
              {settings?.contact_email && (
                <li className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  <span>{settings.contact_email}</span>
                </li>
              )}
              {settings?.contact_phone && (
                <li className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  <span>{settings.contact_phone}</span>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" style={{ color: primaryColor }} />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            {settings?.social_media && (
              <div className="flex space-x-4">
                {Object.entries(settings.social_media).map(([platform, url]) => {
                  const IconComponent = socialIcons[platform];
                  if (IconComponent && url) {
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        style={{ '--hover-color': primaryColor }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TenantFooter;