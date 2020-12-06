// getNewToken.js

const getNewToken = () => {

  return new Promise((resolve: any, reject: any) => {

    const sql = `
      SELECT
        id,
        token
      FROM
        Tokens
      WHERE
        used = false
      LIMIT
        1
    `

    global.client.query(sql)
      .then(res => {
        if (res.rows.length === 1) {
          const sql2 = `
            UPDATE
              Tokens
            SET
              used = true
            WHERE
              id = $1
          `
          const val2 = [res.rows[0].id]

          global.client.query(sql2, val2)
            .then(res2 => {
              resolve(res.rows[0].token)
            })
            .catch(err => {
              //console.log('Error:', err)
              resolve(false)
            })
        }
        else {
          resolve(false)
        }
      })
      .catch(err => {
        //console.log('Fail to get token', err)
        resolve(false)
      })
  })
}

module.exports = getNewToken
