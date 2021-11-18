let fs = require("fs");
let path = require("path");
let types = require("../utility");

function organizefn(dirPath){
    //1-> input for path
    let destPath;
    if (dirPath==undefined) {
        dirPath=process.cwd();
        destPath=path.join(process.cwd(),"organised_files");
    }
    else {
         //2-> create organized files directory
        let doesExist =fs.existsSync(dirPath);
        if (doesExist){
             destPath=path.join(dirPath , "organised_files");
             if (fs.existsSync(destPath)==false) 
                 fs.mkdirSync(destPath);
        }else{
            console.log("Enter correct Path!!!");
            return;
        }
    }
    organizeHelper(dirPath,destPath);
    
 }
 
 //3-> identify categories of all files present in that dir
 //4-> copy/cut files to that org dir under any category
 function organizeHelper(src,dest){
     let childName=fs.readdirSync(src);
     for (let i=0 ;i<childName.length ;i++){
         let childAddress=path.join(src,childName[i]);
         let isFile=fs.lstatSync(childAddress).isFile();
         if(isFile) {
             let cat=getCategory(childName[i]);
             sendFiles(childAddress,dest,cat);
         }
     }
 }
 
 function getCategory(name){
     let ext= path.extname(name);
     ext=ext.slice(1); //without . (operator)
     console.log(ext);
     for (let type in types){
         let cTypeArr=types[type];
         for (let i=0 ; i< cTypeArr.length ;i++){
             if (ext === cTypeArr[i])
                 return type;  
         }
     }
     return "others";
 }
 function sendFiles(src,dest,cat){
     let categoryPath=path.join(dest, cat);
     if (fs.existsSync(categoryPath)==false){
         fs.mkdirSync(categoryPath);
     }
     let fileName=path.basename(src); //create empty file with same name
     let destFilePath= path.join(categoryPath, fileName);
     fs.copyFileSync(src ,destFilePath);
     //fs.unlinkSync(src);  to remove orig copied file
     console.log(fileName,"copied to",destFilePath );
 }

 module.exports = {
    organizeKey: organizefn
}