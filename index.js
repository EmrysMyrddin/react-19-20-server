const express = require('express')
const morgan = require('morgan')
const uuid = require('uuid')
const cors = require('cors')
const makeCrud = require('./crud')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const data = {}

const crud = makeCrud(app, (req) => {
  const { user } = req.params
  if (!data[user]) {
    const ingredients = [
      { id: uuid(), name: 'Tomates' },
      { id: uuid(), name: 'Oignons' },
      { id: uuid(), name: 'Lentilles' },
      { id: uuid(), name: 'Patates' },
      { id: uuid(), name: 'Champignons' },
    ]
    data[user] = {
      recettes: [
        { name: "Recette 1", description: 'Description de le recette 1', id: uuid(), note: 4, ingredients: [{...ingredients[0], qte: 1}, {...ingredients[1], qte: 2}] },
        { name: "Recette 2", description: 'Description de le recette 2', id: uuid(), note: 2, ingredients: [{...ingredients[2], qte: 3}, {...ingredients[1], qte: 1}] },
        { name: "Recette 3", description: 'Description de le recette 3', id: uuid(), note: 4.5, ingredients: [{...ingredients[3], qte: 5}, {...ingredients[0], qte: 3}] },
      ],
      ingredients,
      listes: []
    }
  }
  return data[user]
})

crud('recettes')
crud('ingredients')
crud('listes')

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.info(`listening on port ${port}`)
})