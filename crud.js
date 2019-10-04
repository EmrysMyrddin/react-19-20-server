const uuid = require('uuid')

const crud = (app, getUserData) => entity => {
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

module.exports = crud