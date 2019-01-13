/**
 * GET /wallet
 * Wallet Page
 */
exports.getQuery = (req, res) => {
  res.render('address/query', {
    title: 'Address Query'
  });
};
