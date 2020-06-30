const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movie-api.json');
require('dotenv').config()

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(function validateBearerToken(req, res, next) {
   const bearerToken = req.get('Authorization').split(' ')[1];
   const apiToken = process.env.API_TOKEN;
   console.log(apiToken, bearerToken)
   if(!apiToken || bearerToken !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
   }
   next()
   })

//logic to apply filters
app.get('/movie', (req, res) => {
   const movieGenre = req.query.genre
   const movieCountry = req.query.country
   const movieAvgVote = Number(req.query.avg_vote)
   console.log(movieGenre, movieCountry, movieAvgVote)
   if (movieGenre) {
      const movieGenreSort = MOVIES.filter(movie => movie.genre.toLowerCase().includes(movieGenre.toLowerCase()))
      if (movieCountry) {
         const movieCountrySort = movieGenreSort.filter(movie => movie.country.toLowerCase().includes(movieCountry.toLowerCase()))
         if (movieAvgVote) {
            const movieAvgVoteSort = movieCountrySort.filter(movie => Number(movie.avg_vote) >= movieAvgVote)
            const sortedMovies = movieAvgVoteSort.map(movie => movie)
            if(sortedMovies.length !== 0){
               res.json(sortedMovies) 
            }
            else res.send('There were 0 matches for this search')         }
         else {
            const sortedMovies = movieCountrySort.map(movie => movie)
            if(sortedMovies.length !== 0){
               res.json(sortedMovies) 
            }
            else res.send('There were 0 matches for this search')         }
      }
      else if (!movieCountry && movieAvgVote) {
         const movieAvgVoteSort = movieGenreSort.filter(movie => Number(movie.avg_vote) >= movieAvgVote)
            const sortedMovies = movieAvgVoteSort.map(movie => movie)
            if(sortedMovies.length !== 0){
               res.json(sortedMovies) 
            }
            else res.send('There were 0 matches for this search')      }
      else {
         const sortedMovies = movieGenreSort.map(movie => movie)
         if(sortedMovies.length !== 0){
            res.json(sortedMovies) 
         }
         else res.send('There were 0 matches for this search')      }  
   }
   else if (movieCountry){
      const movieCountrySort = MOVIES.filter(movie => movie.country.toLowerCase().includes(movieCountry.toLowerCase()))
      if (movieAvgVote) {
         const movieAvgVoteSort = movieCountrySort.filter(movie => Number(movie.avg_vote) >= movieAvgVote)
         const sortedMovies = movieAvgVoteSort.map(movie => movie)
         if(sortedMovies.length !== 0){
            res.json(sortedMovies) 
         }
         else res.send('There were 0 matches for this search')      }
      else {
         const sortedMovies = movieCountrySort.map(movie => movie)
         if(sortedMovies.length !== 0){
            res.json(sortedMovies) 
         }
         else res.send('There were 0 matches for this search')      }
   }
   else if (movieAvgVote) {
      const movieAvgVoteSort = MOVIES.filter(movie => Number(movie.avg_vote) >= movieAvgVote)
      const sortedMovies = movieAvgVoteSort.map(movie => movie)
      if(sortedMovies.length !== 0){
         res.json(sortedMovies) 
      }
      else res.send('There were 0 matches for this search')
   } 
   else if (!movieGenre) {
      const rawMovies = MOVIES.map(movie => movie)
      res.json(rawMovies) 
   }  
});

app.use((error, req, res, next) => {
   let response
   if (process.env.NODE_ENV === 'production') {
     response = { error: { message: 'server error' }}
   } else {
     response = { error }
   }
   res.status(500).json(response)
 })

const PORT = process.env.PORT || 8000

app.listen(PORT)