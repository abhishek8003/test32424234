require("dotenv").config();
const express=require("express");
const app=express();
const multer=require("multer");
const CloudStorage=require("./cloud").storage;
const localStorage=multer.diskStorage({
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}_${file.originalname}`);
    },
    destination:function(req,file,cb){
        return cb(null,"./uploads");
    }
});
const FileValidate=(req,file,cb)=>{
if(file.mimetype=="image/jpeg"||file.mimetype=="image/jpg"||file.mimetype=="image/png"){
    return cb(null,true);
}
else{
    return cb(new Error("File format not supported"),false);
}
}
const localUpload=multer({storage:localStorage,
    fileFilter:FileValidate
});
const cloudUpload=multer({
    storage:CloudStorage,
    fileFilter:FileValidate
})
app.set("view engine","ejs");

app.get("/add",(req,res)=>{
    res.render("add.ejs")
});
app.post("/upload/local",localUpload.single("file[local]"),(req,res)=>{
    console.log(req.file);
    res.json({
        status:"Success",
        Message:"Image Uploaded Successfully-local",
        url:`${req.file.path}`
    })
});
app.post("/upload/cloud",cloudUpload.single("file[cloud]"),(req,res)=>{
    console.log(req.file);
    res.json({
        status:"Success",
        Message:"Image Uploaded Successfully-local",
        url:`${req.file.path}`
    })
});
app.post("/both_type_of_save",cloudUpload.single("myfile"),localUpload.single("myfile"),(req,res)=>{
    console.log(req.file);
    res.json({
        status:"Success",
        Message:"Image Uploaded Successfully-local",
        url:`${req.file.path}`
    })
});
app.listen(5000,()=>{
    console.log("Server is listening to 5000..");
})