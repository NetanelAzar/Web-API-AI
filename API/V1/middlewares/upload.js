const multer=require('multer');


//יוצר שכבת ביניים

const storage=multer.diskStorage({//
    destination:(req,file,cb) => {
    if(file.fieldname=="picture"){
    
        cb(null,'public/uploads/pics/')
    }
     else if(file.fieldname=="video")
        cb(null,'public/uploads/pics/');
        
    else
     cb(null,'public/uploads/pics/');
        
    },
    filename:(req,file,cb)=>{
        let filename=Math.floor(Math.random()*100000);
        let fileExtension=file.originalname.split('.').pop();
        cb(null,filename +"."+fileExtension)
    }
  });
  
  
  
  const uploadPics=multer({
    storage
  })


  module.exports=uploadPics;


