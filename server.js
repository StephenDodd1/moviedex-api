const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movie-api.json')
require('dotenv').config()

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(function validateBearerToken(req, res, next) {
   debugger
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
   if (movieGenre) {
      const movieGenreSort = MOVIES.filter(movie => movie.genre === movieGenre)
      if (movieCountry){
         const movieCountrySort = movieGenreSort.filter(movie => movie.country === movieCountry)
         if (movieAvgVote) {
            const movieAvgVoteSort = movieCountrySort.filter(movie => movie.avg_vote === movieAvgVote)
            const sortedMovies = movieAvgVoteSort.map(movie => movie)
            res.json(sortedMovies)
         }
         else {
            const sortedMovies = movieCountrySort.map(movie => movie)
            res.json(sortedMovies)         
         }
      }
      else if (!movieCountry) {
         const sortedMovies = movieGenreSort.map(movie => movie)
         res.json(sortedMovies)    
      }  
   }
   else if (movieCountry){
      const movieCountrySort = MOVIES.filter(movie => movie.country === movieCountry)
      if (movieAvgVote) {
         const movieAvgVoteSort = movieCountrySort.filter(movie => movie.avg_vote === movieAvgVote)
         const sortedMovies = movieAvgVoteSort.map(movie => movie)
         res.json(sortedMovies) 
      }
      else {
         const sortedMovies = movieCountrySort.map(movie => movie)
         res.json(sortedMovies) 
      }
   }
   else if (movieAvgVote) {
      const movieAvgVoteSort = MOVIES.filter(movie => movie.avg_vote === movieAvgVote)
      const sortedMovies = movieAvgVoteSort.map(movie => movie)
      res.json(sortedMovies) 
   } 
   else {
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