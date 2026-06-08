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

exports.getFollowers =
async (
req,
res
) => {
try {
const followers =
await prisma.follow.findMany({
where: {
followingId:
req.params.id,
},

include: {
follower: {
select: {
id: true,
username: true,
avatar: true,
bio: true,
},
},
},
});

res.json(
followers.map(
(follow) =>
follow.follower
).sort(
(a, b) =>
a.username.localeCompare(
b.username
)
)
);

}
catch(err){

res.status(500).json({
error:
err.message
});

}
};

exports.getFollowing =
async (
req,
res
) => {
try {
const following =
await prisma.follow.findMany({
where: {
followerId:
req.params.id,
},

include: {
following: {
select: {
id: true,
username: true,
avatar: true,
bio: true,
},
},
},
});

res.json(
following.map(
(follow) =>
follow.following
).sort(
(a, b) =>
a.username.localeCompare(
b.username
)
)
);

}
catch(err){

res.status(500).json({
error:
err.message
});

}
};
