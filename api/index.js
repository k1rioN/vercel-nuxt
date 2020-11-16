'use strict';
const faunadb = require('faunadb');
const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
var cors = require('cors')

app.use(cors())

const q = faunadb.query;
const client = new faunadb.Client({ secret: 'fnAD5_no-RACBfEBngVhP0ZFtlQM1RDOqINAqU71' });
const {
  Map,
  Paginate,
  Collection,
  Lambda,
  Get,
  Var,
  Index,
  Match,
  Update,
  Ref,
  Delete,
  Create
} = q;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/importactor', function(req,res) {
  let rawdata = fs.readFileSync('film.imdb.json');
  let student = JSON.parse(rawdata);
  console.log(student);
  client
  .query(
    Map(
        student,
      Lambda(
        'post_title',
        Create(
          Collection('films'),
          { data: { title: Var('post_title') } },
        )
      ),
    )
  )
  res.send("Post done!")
})

app.get("/api/filmlist", function(req,res) {
  client
  .query(Map(
    Paginate(
      Match(
        Index("1")
        )
        ),
        Lambda("Title", Get(Var("Title")))
        ))
    .then(result => {
      res.send(result)
    })
    console.log("ко мне обратились")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
