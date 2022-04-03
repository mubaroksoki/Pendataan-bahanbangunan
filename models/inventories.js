const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({

    kodebarang:{
        type: String,
        required: true,
    },

    

    namabarang:{
        type:String,
        required:true,
    },
    ukuran:{
        type:String,
        required:true,
    },
    harga:{
        type:String,
        required:true,
    },
    stok:{
        type:Number,
        required:true,
    },
    
    image:{
        type:String,
        required:true,
    },

});

module.exports = mongoose.model('Inventory',inventorySchema)