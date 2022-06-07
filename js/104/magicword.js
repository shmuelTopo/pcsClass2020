module.exports = (theMagicWord = 'please') => {
  return (req, res, next) => {
    //if (req.query.magicword === 'please') {
    if (req.searchParams.get('magicword') === theMagicWord) {
      return next();
    }

    next('You didnt say the magic word');
  };
}