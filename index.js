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
  if (!data[user]) data[user] = [
    { name: "Recette 1", description: 'Description de le recette 1', id: uuid(), note: 4 },
    { name: "Recette 2", description: 'Description de le recette 2', id: uuid(), note: 2 },
    { name: "Recette 3", description: 'Description de le recette 3', id: uuid(), note: 4.5 },
  ]
  return data[user]
}

app.get('/:user/recettes', (req, res) => {
  res.json(getUserData(req))
})

app.get('/:user/recettes/:id', (req, res) => {
  const { id } = req.params
  const recette = getUserData(req).find(recette => recette.id === id)
  if (!recette) res.sendStatus(404)
  res.json(recette)
})

app.post('/:user/recettes', (req, res) => {
  const recette = { ...req.body, id: uuid() }
  getUserData(req).push(recette)
  res.json(recette)
})

app.put('/:user/recettes/:id', (req, res) => {
  const { id } = req.params
  const oldRecette = getUserData(req).find(recette => recette.id === id)
  if (!oldRecette) res.sendStatus(404)
  Object.assign(oldRecette, req.body, { id })
  res.json(oldRecette)
})

app.delete('/:user/recettes/:id', (req, res) => {
  const { id } = req.params
  const index = getUserData(req).findIndex(recette => recette.id === id)
  if (index === -1) res.sendStatus(404)
  res.json(getUserData(req).splice(index, 1)[0])
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})