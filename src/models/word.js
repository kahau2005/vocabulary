const mongoose = require('mongoose');
const wordSchema = mongoose.Schema({
    infinitive:{
        type: String,
    },
    part_of_speech:{
        type: String,
        
    },
    pronunciation:{
        type: String,
        
    },
    english_definition:{
        type: String,
        
    },
    vietnamese_definition:{
        type: String,
        
    },
    example:{
        type: String,
    }
});

module.exports = mongoose.model('Word', wordSchema);