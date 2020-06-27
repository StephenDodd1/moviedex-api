const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movie-api.json')

const app = express();

app.use(morgan('dev'));

app.get('/movie', (req, res) => {
   const movieGenre = req.query.genre
   const movieCountry = req.query.country
   const movieAvgVote = Number(req.query.avg_vote)
   debugger
   if (movieGenre) {
      const movieGenreSort = MOVIES.filter(movie => movie.genre === movieGenre)
      if (movieCountry){
         console.log('ran first');
         const movieCountrySort = movieGenreSort.filter(movie => movie.country === movieCountry)
         if (movieAvgVote) {
            const movieAvgVoteSort = movieCountrySort.filter(movie => movie.avg_vote === movieAvgVote)
            const sortedMovies = movieAvgVoteSort.map(movie => movie.film_title)
            res.send(`The movies matching this genre are: ${sortedMovies}`)
         }
         else {
            const sortedMovies = movieCountrySort.map(movie => movie.film_title)
            res.send(`The movies matching this genre are: ${sortedMovies}`)
         }
      }
      else if (!movieCountry) {
         console.log('ran second');
         const sortedMovies = movieGenreSort.map(movie => movie.film_title)
         res.send(`The movies matching this genre are: ${sortedMovies}`)
      }
   }
   else if (movieCountry){
      console.log('ran first');
      const movieCountrySort = MOVIES.filter(movie => movie.country === movieCountry)
      if (movieAvgVote) {
         const movieAvgVoteSort = movieCountrySort.filter(movie => movie.avg_vote === movieAvgVote)
         const sortedMovies = movieAvgVoteSort.map(movie => movie.film_title)
         res.send(`The movies matching this genre are: ${sortedMovies}`)
      }
      else {
         const sortedMovies = movieCountrySort.map(movie => movie.film_title)
         res.send(`The movies matching this genre are: ${sortedMovies}`)
      }
   }
   else if (movieAvgVote) {
      const movieAvgVoteSort = MOVIES.filter(movie => movie.avg_vote === movieAvgVote)
      const sortedMovies = movieAvgVoteSort.map(movie => movie.film_title)
      res.send(`The movies matching this genre are: ${sortedMovies}`)
   } 
   else {
      const rawMovies = MOVIES.map(movie => movie.film_title)
      res.send(`The movies matching this genre are: ${rawMovies}`)
   }
})

app.use((req,res) => {
   res.send('Hello World!')
})

const PORT = 8000

app.listen(PORT, () => {
   console.log(`server is listening on ${PORT}`)
})