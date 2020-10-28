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
    if (req.url === '/api/add-item-image' && req.method.toLowerCase() === 'post') {
      const { body } = req
      if (body.file && body.item && body.fileType && body.fileName) {
        // Data URL security concerns???
        // Send file to MongoDB to process for S3
        const base64EncodedImage = body.file.split(',')[1]
        const fileExtension = body.fileName.split('.').pop()
        const fileName = body.item + '.' + fileExtension
        console.log(fileName)
        const fileType = body.fileType
        const id = body.item
        const userId = 'jeremy'
        const payload = [base64EncodedImage, userId, id, fileName, fileType]
        await client.auth.loginWithCredential(credential)
        const response = await client.callFunction('addItemImage', payload)
        console.log(response)
        res.json(response)
      } else {
        // Throw error
      }
    }
    // res.send('works!')
  } catch (err) {
    res.status(500)
    res.send(err)
  }
}

