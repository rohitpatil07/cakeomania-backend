import User from '../models/User.js';

const getuser = async (email_id) => {
  const userdata = await User.findOne({
    email: email_id,
  });
  return userdata._id;
};

export default { getuser };
