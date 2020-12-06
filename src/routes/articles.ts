// reading.js

import express from 'express'
const articlesRouter = express.Router();

const axios = require('axios')

/**
 * 最近1小时阅读量
 */
const lastHourReadings = (uid: any) => {

  return new Promise( async (resolve: any, reject: any) => {

    const sql = `
      SELECT id
      FROM Log
      WHERE type_id = 3
        AND uid = $1
        AND created_at > NOW() - INTERVAL '1 hours'
    `
    const val = [uid]

  // try pool!
      const pool = await global.pgPool.connect()

      try {
        const res = await pool.query(sql, val)
        console.log('!!!! ', res)
      } catch (err: any) {
        console.log('数据库错了！！！！')
      }
      pool.release()
  })
}

/**
 * reading
 */
articlesRouter.get('/', async (req: any, res: any, next: any) => {
  const readingdata = {
    site_prefix: '',
    articles: [],
    articles_exist: 0,
    my_categories: '',
    json_articles: '',
    status: 0,
    token: 0,
    role: 1,
    allcategories: [],
    last_hour_readings: 0,
  }

  //const aaa = await lastHourReadings(30)

  const cookie = req.cookies.gzhzj
  const iid = req.query.iid ? req.query.iid : '0' // 邀请码

  /*
  if (cookie && cookie.length > 20) {
    console.log('')
    console.log('COOKIE: In here')
  } else {
    console.log('')
    console.log('Not !! In here')
  }
    console.log('')
   */

  // 判断是否在微信内
  let ua = ''
  if (req.headers['user-agent']) { // user-agent 可能为 undefined，啥情况？
    ua = req.headers['user-agent'].toLowerCase()
  }

  if (cookie && cookie.length > 20) {
    axios.get('https://businessonwechat.com/gzh/api_reading?token=' + cookie)
      .then((res2: any) => {
        res.render('reading_new', res2.data.readingdata)
      })
      .catch(function(err: any) {
        res.render('reading_new', readingdata)
      })
  } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //res.writeHead(301, { Location: 'https://businessonwechat.com/gzh/login?dest=togzhzj&iid=' + iid })
    res.writeHead(301, { Location: 'https://businessonwechat.com/gzh/login?dest=dlsarticles' })
    res.end()
  } else { // 新用户，在非微信中访问
    //logger.error('reading: 新用户访问: no token, no cookie, not in wechat')
    axios.get('https://businessonwechat.com/gzh/api_reading_new_user')
      .then((res3: any) => {
        if (res3.data.message === 'ok') {
          res.cookie('gzhzj', res3.data.readingdata.token, {maxAge:900000})
          res.render('reading_new', res3.data.readingdata)
        }
        else {
          //logger.error('Error 300120, token 已经消耗完了！')
          res.send('Error 300120')
        }
      })
      .catch(function(err3: Error) {
        //logger.error('new user error! ' + err3)
        res.send('Error 300121')
      })
  }
})

export { articlesRouter }
