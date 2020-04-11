const filmsDetailsData = [{
  image: `./images/posters/Inception.jpg`,
  age: 12,
  title: `Inception`,
  originalTitle: `Inception`,
  rating: 8.8,
  director: `Christopher Nolan`,
  writers: `Christopher Nolan`,
  actors: `Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page`,
  release: `8 July 2010`,
  duration: `2h 28min`,
  country: `USA`,
  genres: [
    `Action`, `Adventure`, `Sci-Fi`
  ],
  description: `A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.`,
},
];

const getFilmsDetailsData = (title) => {
  return filmsDetailsData.find((it) => it.title === title);
};


export {getFilmsDetailsData};
