import cakeService from '../services/cakeservice.js';
const getallcakes = async (req, res) => {
  try {
    const cakes = await cakeService.getallcakes();
    res.json(cakes);
  } catch (error) {
    res.json(error);
  }
};

const getbestsellers = async (req, res) => {
  try {
    const number = parseInt(req.params.limit);
    const cakes = await cakeService.getbestsellers(number);
    res.send(cakes);
  } catch (err) {
    console.log(err);
  }
};

const getcakebyid = async (req, res) => {
  try {
    const id = req.params.id;
    const cake = await cakeService.getcakebyid(id);
    res.json(cake);
  } catch (error) {
    console.log(error);
  }
};

export default { getallcakes, getbestsellers, getcakebyid };
