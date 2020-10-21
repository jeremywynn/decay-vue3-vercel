const { Stitch, UserApiKeyCredential } = require('mongodb-stitch-server-sdk')
const formidable = require('formidable')

let client
if (Stitch.hasAppClient(process.env.MONGODB_STITCH_APP_ID)) {
  client = Stitch.getAppClient(process.env.MONGODB_STITCH_APP_ID)
} else {
  client = Stitch.initializeDefaultAppClient(process.env.MONGODB_STITCH_APP_ID)
}
const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY)

module.exports = async(req, res) => {
  try {
    // await client.auth.loginWithCredential(credential)
    // console.log(req.url)
    // const categories = await client.callFunction('addItemImage')
    // res.json(categories)
    if (req.url === '/api/add-item-image' && req.method.toLowerCase() === 'post') {
      // console.log('add-item-image function invoked!')
      const { body } = req
      // console.log(body.file)
      if (body.file && body.item && body.fileType && body.fileName) {
        // Data URL security concerns???
        // Send file to MongoDB to process for S3
        
        const base64EncodedImage = body.file.split(',')[1]
        // const base64EncodedImage = body.file
        // console.log('processed image below:')
        // console.log(base64EncodedImage)
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
      } else {
        // Throw error
      }
      res.send('works!')
      // res.json(body.payload)
      // console.log('parsing a file upload')
      // parse a file upload
      /*
      const form = formidable({ multiples: true });
  
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('inside parse!')
        console.log('fields:', fields)
        console.log('files:', files)
        res.json({ fields, files })
      });
  
      return;
      */
    }
    // res.send('works!')
  } catch (err) {
    res.status(500)
    res.send(err)
  }
}

