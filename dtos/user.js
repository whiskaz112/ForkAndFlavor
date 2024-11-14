const userDTO = {
  toPublicDTO: user => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    following: user.following,
    follower: user.follower,
  }),

  toListDTO: user => ({
    id: user._id,
    username: user.username,
  }),

  toAdminDTO: user => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    following: user.following,
    follower: user.follower,
    likes: user.likes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }),
};

module.exports = userDTO;
