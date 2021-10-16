import Cake from '../models/Cake.js';

const getallcakes = async () => {
  const cakes = await Cake.find();
  return cakes;
};

const getbestsellers = async (number) => {
  const cakes = await Cake.find().limit(number);
  return cakes;
};

const getcakebyid = async (id) => {
  const cake = await Cake.find({ _id: id });
  return cake;
};

export default { getallcakes, getbestsellers, getcakebyid };
