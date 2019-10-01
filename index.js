const express = require('express')
const morgan = require('morgan')
const uuid = require('uuid')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const data = {}

const getUserData = (req) => {
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
      ingredients
    }
  }
  return data[user]
}

const crud = entity => {
  app.get(`/:user/${entity}`, (req, res) => {
    res.json(getUserData(req)[entity])
  })

  app.get(`/:user/${entity}/:id`, (req, res) => {
    const { id } = req.params
    const recette = getUserData(req)[entity].find(recette => recette.id === id)
    if (!recette) res.sendStatus(404)
    res.json(recette)
  })

  app.post(`/:user/${entity}`, (req, res) => {
    const recette = { ...req.body, id: uuid() }
    getUserData(req)[entity].push(recette)
    res.json(recette)
  })

  app.put(`/:user/${entity}/:id`, (req, res) => {
    const { id } = req.params
    const oldRecette = getUserData(req)[entity].find(recette => recette.id === id)
    if (!oldRecette) res.sendStatus(404)
    Object.assign(oldRecette, req.body, { id })
    res.json(oldRecette)
  })

  app.delete(`/:user/${entity}/:id`, (req, res) => {
    const { id } = req.params
    const index = getUserData(req)[entity].findIndex(recette => recette.id === id)
    if (index === -1) res.sendStatus(404)
    res.json(getUserData(req)[entity].splice(index, 1)[0])
  })

}

crud('recettes')
crud('ingredients')


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})