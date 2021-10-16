import searchService from '../services/searchservice.js';

const searchpattern = async (req, res) => {
  const { pattern } = req.body;
  console.log(pattern);
  const response = await searchService.searchpattern(pattern);
  return res.json(response);
};

export default { searchpattern };
