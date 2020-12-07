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
    await client.auth.loginWithCredential(credential)
    const items = await client.callFunction('getItemsNew')
    res.json(items)
  } catch (error) {
    res.status(500)
    res.send(error)
  }
}