// getNewToken.js

const getNewToken = () => {
  return new Promise( async (resolve: any, reject: any) => {
    const sql = `
      SELECT id, token
      FROM Tokens
      WHERE used = false
      LIMIT 1
    `

    try {
      const pool = await global.pgPool.connect()
      const res = await pool.query(sql)
      if (res.rows.length === 1) {
        const sql2 = `
            UPDATE Tokens
            SET used = true
            WHERE id = $1
          `
        const val2 = [res.rows[0].id]

        const res2 = await pool.query(sql2, val2)
        if (res) {
          resolve(res.rows[0].token)
        } else {
          resolve(false)
        }
      } else {
        console.log('Fail to get token err zero.')
        resolve(false)
      }
      pool.release()
    } catch (err: any) {
      console.log('db:: 2029', err)
      reject(false)
    }
  })
}

module.exports = getNewToken
