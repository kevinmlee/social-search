const mongoose = require('mongoose')

const NewsCacheSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  articles: {
    type: Array,
    required: true,
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.NewsCache || mongoose.model('NewsCache', NewsCacheSchema, 'news')
