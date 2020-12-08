// baseredirect.ts
// Get token by openid. Then set cookie and redirect to reading page.

import { checkOpenId } from '../modules/check_openid'
import express from 'express'
const baseredirectRouter = express.Router()
const axios = require('axios')

baseredirectRouter.get('/', (req: any, res: any, next: any) => {
  if (req.query.code && req.query.code.length > 10) { // Callback from WeChat.
    const appid = process.env.OFFICIAL_appid
    const secret = process.env.OFFICIAL_secret
    const state = 'base'

    axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${req.query.code}&grant_type=authorization_code`)
      .then( async (res1: any) => {
        if (res1.data.openid && res1.data.access_token && res1.data.refresh_token) {
          let res2
          let uid = 0
          let role = 0

          try {
            res2 = await checkOpenId(res1.data)
            uid = res2.id
            role = res2.role

            if (res2.status === 4 || res2.status === 5) { //黑名单
              console.log('黑名单！id: ' + uid)
              //logger.error('黑名单！status: ' + res2.status)
              console.log('黑名单！nickname: ' + res2.nickname)
              res.status(200).send('Error')
            } else {
              res.cookie('gzhzj', res2.token, {maxAge:900000})
              res.render('redirect', {})
            }
          } catch (err2: any) {
            res.status(200).send('Error 27')
          }
        } else {
          res.send('网络错误，请重试！')
        }
      })
      .catch((er: any) => {
        console.log('Fail rr23456, 可能是token用完了')
        res.send('Error 290021')
      })
  } else {
    res.send('Error 1001')
  }
})

export { baseredirectRouter }
