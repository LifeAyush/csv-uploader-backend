const mongoose = require('mongoose');

const mappedDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const MappedData = mongoose.model('MappedData', mappedDataSchema);

module.exports = MappedData;
