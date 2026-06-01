const cloudinary =
require(
"../config/cloudinary"
);

exports.uploadImage =
async (
req,
res
)=>{

try{

if(
!req.files
){

return res
.status(400)
.json({

message:
"No image"

});

}

const result =
await cloudinary
.uploader.upload(

req.files.image
.tempFilePath,

{

folder:
"cohortx"

}

);

res.json({

url:
result.secure_url

});

}

catch(err){

console.log(
err
);

res.status(500)
.json({

message:
"Upload failed"

});

}

};