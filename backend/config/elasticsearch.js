const { Client } = require('@elastic/elasticsearch');
const { getDB } = require('./database');
const client = new Client({ node: 'http://elasticsearch:9200' });

// Wait until Elasticsearch is ready
async function waitForElastic() {
  let connected = false;
  while (!connected) {
    try {
      const health = await client.cluster.health({});
      console.log('Elasticsearch connected:', health.status);
      connected = true;
    } catch (err) {
      console.log('Waiting for Elasticsearch...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Retry every 3 seconds
    }
  }
}

// Sync MySQL products into Elasticsearch index
async function syncElasticsearch() {
  await waitForElastic();
  const exists = await client.indices.exists({ index: 'products' });
  if (!exists) {
    await client.indices.create({
      index: 'products',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            created_at: { type: 'date' },
            user_id: { type: 'integer' }
          }
        }
      }
    });
    console.log('Elasticsearch index created');
  } else {
    console.log('Elasticsearch index already exists');
  }
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM products');
    if (!rows || rows.length === 0) {
      console.log('No existing products found in MySQL to sync');
    } else {
      for (const product of rows) {
        const normalizedProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          created_at: new Date(product.created_at).toISOString(),
          user_id: product.user_id
        };
        if (isNaN(normalizedProduct.price)) {
          console.warn(`Skipping product ${product.id} - invalid price:`, product.price);
          continue;
        }
        // Index product into Elasticsearch
        await client.index({
          index: 'products',
          id: String(product.id),
          document: normalizedProduct
        });
      }
    }
  } catch (err) {
    console.error('Error syncing products to Elasticsearch:', err);
  }
}

module.exports = { client, syncElasticsearch };
