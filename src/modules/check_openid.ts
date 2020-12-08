// check_openid.js

const axios = require('axios')
const getNewToken = require('./getNewToken')

const makeLogNew = (uid, inviter_uid) => {

  return new Promise((resolve, reject) => {

    const sql = `
      INSERT INTO Log
        (type_id, uid, target_uid, points, msg_text)
      VALUES
        ($1, $2, $3, $4, $5)
    `
    const val = [26, uid, inviter_uid, 200, '拉新人奖励']

    global.client.query(sql, val)
      .then((res2) => {
        if (res2.rows.length > 0) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      })
      .catch(err2 => {
        logger.error('EB22 err award invitee' + JSON.stringify(err2))
        resolve(false)
      })
  })
}

/**
 * 创建新用户。
 */
const create_user = (data: any) => {
  return new Promise((resolve, reject) => {
    const cates = [1, 2, 3, 7, 13, 15]

    //get_token()
    getNewToken()
      .then(token => {
        const sql = `
          INSERT INTO Wusers
            (openid, access_token, refresh_token, token, token_expired_at, categories)
          VALUES
            ($1, $2, $3, $4, NOW() + INTERVAL '6900 seconds', $5)
          RETURNING id
        `
        const values = [
          data.openid,
          data.access_token,
          data.refresh_token,
          token,
          cates,
        ]

        global.client.query(sql, values)
          .then(res2 => {
            console.log('Insert a new user successfully!')
            const id = res2.rows[0].id
            resolve({token, id})
          })
          .catch(err => {
            console.log('Insert failed', err)
            reject(false)
          })
      })
      .catch(err => {
        reject(false)
      })
  })
}

/**
 * 检查用户是否存在。
 */
const check_base = (data: any) => {
  return new Promise( async (resolve, reject) => {
    const sql = `
      SELECT
            id,
            role,
            nickname,
            status,
            token,
            cash,
            openid_wy,
            nickname,
            avatar
      FROM Wusers
      WHERE openid = $1
      ORDER BY status DESC
    `
    const val = [data.openid]

    try {
      const pool = await global.pgPool.connect()
      const res = await pool.query(sql, val)
      pool.release()
      if (res.rows.length > 0) {
        resolve({
          'id': res.rows[0].id,
          'role': res.rows[0].role,
          'token': res.rows[0].token,
          'status': res.rows[0].status,
          'nickname': res.rows[0].nickname,
          'cash': res.rows[0].cash,
          'openid_wy': res.rows[0].openid_wy,
          'avatar': res.rows[0].avatar ? res.rows[0].avatar : false,
        })
      } else {
        const res2 = await create_user(data)
        if (res2) {
          resolve({
            'id': res2.id,
            'role': 0,
            'token': res2.token,
            'status': 0,
            'nickname': '',
            'openid_wy': '',
            'cash': '0.20',
          })
        } else {
          reject(false)
        }
      }
    } catch (err: any) {
      reject(false)
    }
  })
}

const check_openid = (data: any): any => {
  return check_base(data)
}

export { check_openid as checkOpenId }
