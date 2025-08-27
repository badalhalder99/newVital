const { ObjectId } = require('mongodb');
const { getTenantDb } = require('../config/database');

class TenantPage {
  constructor(pageData) {
    this._id = pageData._id || pageData.id;
    this.page_type = pageData.page_type; // 'home', 'about', 'services', 'testimonials', 'contact'
    this.title = pageData.title;
    this.content = pageData.content;
    this.meta_description = pageData.meta_description;
    this.is_active = pageData.is_active !== undefined ? pageData.is_active : true;
    this.order = pageData.order || 0;
    this.created_at = pageData.created_at || new Date();
    this.updated_at = pageData.updated_at || new Date();
  }

  static getCollection(tenantId) {
    const db = getTenantDb(tenantId);
    return db.collection('tenant_pages');
  }

  async save(tenantId) {
    const collection = this.constructor.getCollection(tenantId);
    const result = await collection.insertOne({
      page_type: this.page_type,
      title: this.title,
      content: this.content,
      meta_description: this.meta_description,
      is_active: this.is_active,
      order: this.order,
      created_at: this.created_at,
      updated_at: this.updated_at
    });
    
    this._id = result.insertedId;
    return result;
  }

  static async findByPageType(tenantId, pageType) {
    const collection = this.getCollection(tenantId);
    return await collection.findOne({ page_type: pageType, is_active: true });
  }

  static async findAll(tenantId, options = {}) {
    const collection = this.getCollection(tenantId);
    const cursor = collection.find(options.where || {});
    
    if (options.limit) cursor.limit(options.limit);
    if (options.skip) cursor.skip(options.skip);
    cursor.sort({ order: 1, created_at: 1 });
    
    return await cursor.toArray();
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

  async delete(tenantId) {
    const collection = this.constructor.getCollection(tenantId);
    const result = await collection.deleteOne({ _id: new ObjectId(this._id) });
    return result;
  }

  static fromDocument(doc) {
    if (!doc) return null;
    return new TenantPage({
      _id: doc._id,
      page_type: doc.page_type,
      title: doc.title,
      content: doc.content,
      meta_description: doc.meta_description,
      is_active: doc.is_active,
      order: doc.order,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    });
  }
}

module.exports = TenantPage;