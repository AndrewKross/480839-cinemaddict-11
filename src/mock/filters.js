const filters = [{
  name: `All movies`,
  id: `all`,
  isActive: true,
}, {
  name: `Watchlist`,
  id: `watchlist`,
  count: Math.floor(Math.random() * 10),
  isActive: false,
}, {
  name: `History`,
  id: `history`,
  count: Math.floor(Math.random() * 10),
  isActive: false,
}, {
  name: `Favorites`,
  id: `favorites`,
  count: Math.floor(Math.random() * 10),
  isActive: false,
}
];

const generateFilters = () => {
  return filters;
};

export {generateFilters};
