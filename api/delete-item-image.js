const { Stitch, UserApiKeyCredential } = require('mongodb-stitch-server-sdk')

let client
if (Stitch.hasAppClient(process.env.MONGODB_STITCH_APP_ID)) {
  client = Stitch.getAppClient(process.env.MONGODB_STITCH_APP_ID)
} else {
  client = Stitch.initializeDefaultAppClient(process.env.MONGODB_STITCH_APP_ID)
}
const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY)

module.exports = async(req, res) => {
  try {
    if (req.url === '/api/delete-item-image' && req.method.toLowerCase() === 'delete') {
      const { body } = req
      if (body.key && body.id) {
        // console.log('if statement works!')
        // console.log(body.key)
        const payload = [body.key, body.id]
        // console.log(payload)
        await client.auth.loginWithCredential(credential)
        const response = await client.callFunction('deleteItemImage', payload)
        console.log(`response from Mongo:`)
        console.log(response)
        res.json(response)
      } else {
        // Throw error
      }
    }
  } catch (err) {
    res.status(500)
    res.send(err)
  }
}

