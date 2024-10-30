const mongoose = require('mongoose');
const unitSchema = mongoose.Schema({
    title:{
        type: String
    },
    paragraph: {
        type: String
    },
    words: []
});

module.exports = mongoose.model('Unit', unitSchema);