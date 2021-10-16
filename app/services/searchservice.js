import Cake from '../models/Cake.js';
const searchpattern = async (pattern) => {
  const regex = new RegExp('.*' + pattern + '.*');
  try {
    const response = await Cake.find({
      name: { $regex: regex, $options: 'xi' },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default { searchpattern };
