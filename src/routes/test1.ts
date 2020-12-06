
import express from 'express'
const test11Router = express.Router();

test11Router.get('/', (req: any, res: any, next: any) => {
  console.log('iii')
  res.send('iiii')
})

module.exports = test11Router
