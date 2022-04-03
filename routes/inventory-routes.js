const express  = require("express");
const router = express.Router();
const Inventory = require('../models/inventories')
const multer = require('multer');
const fs = require("fs")


var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,

}).single("image");

router.post("/add", upload, (req,res)=> {
    const inventory = new Inventory({
        kodebarang: req.body.kodebarang,
        namabarang: req.body.namabarang,
        ukuran: req.body.ukuran,
        harga: req.body.harga,
        stok: req.body.stok,
        image: req.file.filename,
    });
    inventory.save((err)=> {
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: "success",
                message: "Inventory Added Successfully"
            };
            res.redirect("/");
        }
    })
})

router.get("/", (req,res) => {
    Inventory.find().exec((err, inventories) => {
        if(err){
            res.json({message: err.message})
        }else{
            res.render('index',{
                title: 'home page',
                inventories:inventories,
            })
        }
    })
})




router.get("/", (req,res)=> {
    res.render("index", {title: "home page"})
});

router.get('/add', (req,res)=> {
    res.render("add_inventory", {title: "add inventory"})
});



router.get('/edit/:id', (req,res) => {
     let id = req.params.id;
     Inventory.findById(id, (err, inventories) => {
         if(err){
             res.redirect('/');
         }else{
             if(inventories == null){
                 res.redirect('/');
             }else{
                 res.render("edit_inventories", {
                     title: "edin Inventory",
                     inventories:inventories,
                 });
             }
            }

     })
})

router.post('/update/:id', upload, (req,res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image)
        }catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image
    }

    Inventory.findByIdAndUpdate(id, {
        kodebarang: req.body.kodebarang,
        namabarang: req.body.namabarang,
        ukuran: req.body.ukuran,
        harga: req.body.harga,
        stok: req.body.stok,
        image: new_image,
    }, (err,result) => {
        if(err){
            res.json({message: err.message, type:'danger'})
        }else{
            req.session.message = {
                type: 'success',
                message: 'Updated successfully',
            };
            res.redirect('/')
        }
    })
})


router.get('/delete/:id', (req,res)=>{

    let id = req.params.id;
    Inventory.findByIdAndRemove(id, (err,result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/' + result.image)
            }catch(err){
                console.log(err);
            }
        }

        if(err){
            res.json({message: err.message})
        }else{
            req.session.message = {
                type: 'success',
                message: 'inventory deleted successfully'
            }

            res.redirect("/");
        }
    })
})
module.exports = router;