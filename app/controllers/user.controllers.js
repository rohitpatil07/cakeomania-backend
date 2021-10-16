import userService from '../services/userservice.js';

const getuser = async (req, res) => {
  const user = req.params.user;
  const userid = await userService.getuser(user);
  res.json({ id: userid });
};

export default { getuser };
