const { ObjectId } = require('mongodb');
const { getTenantDb } = require('../config/database');

class TenantTestimonial {
  constructor(testimonialData) {
    this._id = testimonialData._id || testimonialData.id;
    this.name = testimonialData.name;
    this.company = testimonialData.company;
    this.quote = testimonialData.quote;
    this.rating = testimonialData.rating || 5;
    this.image_url = testimonialData.image_url;
    this.is_active = testimonialData.is_active !== undefined ? testimonialData.is_active : true;
    this.order = testimonialData.order || 0;
    this.created_at = testimonialData.created_at || new Date();
    this.updated_at = testimonialData.updated_at || new Date();
  }

  static getCollection(tenantId) {
    const db = getTenantDb(tenantId);
    return db.collection('tenant_testimonials');
  }

  async save(tenantId) {
    const collection = this.constructor.getCollection(tenantId);
    const result = await collection.insertOne({
      name: this.name,
      company: this.company,
      quote: this.quote,
      rating: this.rating,
      image_url: this.image_url,
      is_active: this.is_active,
      order: this.order,
      created_at: this.created_at,
      updated_at: this.updated_at
    });
    
    this._id = result.insertedId;
    return result;
  }

  static async findAll(tenantId, options = {}) {
    const collection = this.getCollection(tenantId);
    const cursor = collection.find(options.where || { is_active: true });
    
    if (options.limit) cursor.limit(options.limit);
    if (options.skip) cursor.skip(options.skip);
    cursor.sort({ order: 1, created_at: -1 });
    
    return await cursor.toArray();
  }

  static async findById(tenantId, id) {
    const collection = this.getCollection(tenantId);
    return await collection.findOne({ _id: new ObjectId(id) });
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
    return new TenantTestimonial({
      _id: doc._id,
      name: doc.name,
      company: doc.company,
      quote: doc.quote,
      rating: doc.rating,
      image_url: doc.image_url,
      is_active: doc.is_active,
      order: doc.order,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    });
  }
}

module.exports = TenantTestimonial;