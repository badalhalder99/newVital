const { ObjectId } = require('mongodb');
const { getTenantDb } = require('../config/database');

class TenantSettings {
  constructor(settingsData) {
    this._id = settingsData._id || settingsData.id;
    this.site_name = settingsData.site_name;
    this.site_tagline = settingsData.site_tagline;
    this.logo_url = settingsData.logo_url;
    this.primary_color = settingsData.primary_color || '#10b981';
    this.secondary_color = settingsData.secondary_color || '#059669';
    this.contact_email = settingsData.contact_email;
    this.contact_phone = settingsData.contact_phone;
    this.address = settingsData.address;
    this.social_media = settingsData.social_media || {};
    this.meta_keywords = settingsData.meta_keywords;
    this.meta_description = settingsData.meta_description;
    this.created_at = settingsData.created_at || new Date();
    this.updated_at = settingsData.updated_at || new Date();
  }

  static getCollection(tenantId) {
    const db = getTenantDb(tenantId);
    return db.collection('tenant_settings');
  }

  async save(tenantId) {
    const collection = this.constructor.getCollection(tenantId);
    const result = await collection.insertOne({
      site_name: this.site_name,
      site_tagline: this.site_tagline,
      logo_url: this.logo_url,
      primary_color: this.primary_color,
      secondary_color: this.secondary_color,
      contact_email: this.contact_email,
      contact_phone: this.contact_phone,
      address: this.address,
      social_media: this.social_media,
      meta_keywords: this.meta_keywords,
      meta_description: this.meta_description,
      created_at: this.created_at,
      updated_at: this.updated_at
    });
    
    this._id = result.insertedId;
    return result;
  }

  static async findOne(tenantId) {
    const collection = this.getCollection(tenantId);
    return await collection.findOne({});
  }

  async update(tenantId, updateData) {
    Object.assign(this, updateData);
    this.updated_at = new Date();

    const collection = this.constructor.getCollection(tenantId);
    const result = await collection.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { ...updateData, updated_at: this.updated_at } }
    );
    
    return result;
  }

  static fromDocument(doc) {
    if (!doc) return null;
    return new TenantSettings({
      _id: doc._id,
      site_name: doc.site_name,
      site_tagline: doc.site_tagline,
      logo_url: doc.logo_url,
      primary_color: doc.primary_color,
      secondary_color: doc.secondary_color,
      contact_email: doc.contact_email,
      contact_phone: doc.contact_phone,
      address: doc.address,
      social_media: doc.social_media,
      meta_keywords: doc.meta_keywords,
      meta_description: doc.meta_description,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    });
  }
}

module.exports = TenantSettings;