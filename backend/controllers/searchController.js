const { client } = require('../config/elasticsearch');

// Search products in Elasticsearch
exports.search = async (req, res) => {
  try {
    const { query, sort } = req.query;

    // Build the Elasticsearch query
    const body = {
      query: {
        bool: {
          must: query ? {
            multi_match: {
              query, 
              fields: ['name', 'description'] 
            }
          } : { match_all: {} },
          filter: []
        }
      },
      sort: sort ? [{ [sort]: { order: 'asc' } }] : []
    };

    const result = await client.search({
      index: 'products',
      size: 20, // limit to 20 results
      body
    });

    // Format the results to send back to client
    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    res.json(hits);
  } catch (err) {
    console.error('search error:', err);
    res.status(500).json({ message: 'Search error' });
  }
};
