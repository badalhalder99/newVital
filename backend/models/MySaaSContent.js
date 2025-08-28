const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

class MySaaSContent {
  constructor(data) {
    this.tenant_id = data.tenant_id;
    this.type = data.type; // 'hero', 'about', 'service', 'testimonial', 'team', 'contact'
    this.title = data.title || '';
    this.content = data.content || '';
    this.image_url = data.image_url || null;
    this.meta_data = data.meta_data || {};
    this.status = data.status || 'active';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  async save(tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    
    if (this._id) {
      const { _id, ...updateData } = this;
      updateData.updated_at = new Date();
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return result;
    } else {
      const result = await collection.insertOne(this);
      this._id = result.insertedId;
      return result;
    }
  }

  static async findByType(type, tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    return await collection.find({ type, status: 'active' }).sort({ created_at: -1 }).toArray();
  }

  static async findById(id, tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async updateById(id, updateData, tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    updateData.updated_at = new Date();
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async deleteById(id, tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'deleted', updated_at: new Date() } }
    );
  }

  static async getAllContent(tenantId = null) {
    const db = getMongoDb(tenantId ? `tenant_${tenantId}` : 'multi_tenant_saas');
    const collection = db.collection('content');
    return await collection.find({ status: 'active' }).sort({ type: 1, created_at: -1 }).toArray();
  }
}

module.exports = MySaaSContent;