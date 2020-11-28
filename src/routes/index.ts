import express, { Request, Response } from 'express'

const router = express.Router()

/**
 * Homepage
 */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: '大蓝书' })
})

module.exports = router
