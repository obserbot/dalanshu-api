// reading.js

const express = require('express');
const articlesRouter = express.Router();

const axios = require('axios')

/**
 * 最近1小时阅读量
 */
const lastHourReadings = (uid) => {

  return new Promise((resolve, reject) => {

    const sql = `
      SELECT
        id
      FROM
        Log
      WHERE
        type_id = 3
      AND
        uid = $1
      AND
        created_at > NOW() - INTERVAL '1 hours'
    `
    const val = [uid]

    global.client.query(sql, val)
      .then(res => {
        resolve(res.rows.length)
      })
      .catch(err => {
        resolve(0)
      })
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

  const cookie = req.cookies.gzhzj
  const iid = req.query.iid ? req.query.iid : '0' // 邀请码

  // 判断是否在微信内
  let ua = ''
  if (req.headers['user-agent']) { // user-agent 可能为 undefined，啥情况？
    ua = req.headers['user-agent'].toLowerCase()
  }

  // 1. cookie
  // 2. no cookie, businessonwechat login -> token (to set cookie) -> cookie
  // 3. token. Its purpose is only to set cookie.
  if (req.query.token && req.query.token.length > 10) {
    //res.cookie('gzhzj', req.query.token, {maxAge:900000})
    //res.redirect(process.env.URL_BASE)
    axios.get('https://businessonwechat.com/gzh/api_reading?token=' + req.query.token)
      .then(res3 => {
        const pd = res3.data.readingdata
        res.render('reading_new', pd)
        //res.render('reading_new', res3.data.readingdata)
      })
      .catch(err => {
        res.render('reading_new', readingdata)
      })
  } else if (cookie && cookie.length > 20) {
    axios.get('https://businessonwechat.com/gzh/api_reading?token=' + cookie)
      .then(res2 => {
        res.render('reading_new', res2.data.readingdata)
      })
      .catch(err => {
        res.render('reading_new', readingdata)
      })
  } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //res.writeHead(301, { Location: 'https://businessonwechat.com/gzh/login?dest=togzhzj&iid=' + iid })
    res.writeHead(301, { Location: 'https://businessonwechat.com/gzh/login?dest=dlsarticles' })
    res.end()
  } else { // 新用户，在非微信中访问
    //logger.error('reading: 新用户访问: no token, no cookie, not in wechat')
    axios.get('https://businessonwechat.com/gzh/api_reading_new_user')
      .then(res3 => {
        if (res3.data.message === 'ok') {
          res.cookie('gzhzj', res3.data.readingdata.token, {maxAge:900000})
          res.render('reading_new', res3.data.readingdata)
        }
        else {
          //logger.error('Error 300120, token 已经消耗完了！')
          res.send('Error 300120')
        }
      })
      .catch(err3 => {
        //logger.error('new user error! ' + err3)
        res.send('Error 300121')
      })
  }
})

//export default articlesRouter
module.exports = articlesRouter
