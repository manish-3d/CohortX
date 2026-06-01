const prisma = require("../config/db");

exports.followUser = async (
req,
res
) => {
try {

const followingId =
req.params.id;

if (
followingId ===
req.user.id
) {
return res
.status(400)
.json({
message:
"Cannot follow yourself"
});
}

const existing =
await prisma.follow.findUnique({
where:{
followerId_followingId:{
followerId:
req.user.id,

followingId
}
}
});

if(existing){
return res
.status(400)
.json({
message:
"Already following"
});
}

await prisma.follow.create({
data:{
followerId:
req.user.id,

followingId
}
});

res.json({
message:
"User followed"
});

}
catch(err){

res.status(500).json({
error:
err.message
});

}
};

exports.unfollowUser =
async (
req,
res
)=>{

try{

await prisma.follow.delete({
where:{
followerId_followingId:{
followerId:
req.user.id,

followingId:
req.params.id
}
}
});

res.json({
message:
"Unfollowed"
});

}
catch(err){

res.status(500).json({
error:
err.message
});

}

};