<template>
  <div class="decay-item-image">
    <div v-if="item.imageUrl" class="image-holder">
      <img :src="item.imageUrl" alt="" />
      <button @click="deleteImage">Delete Image</button>
    </div>
    <div v-else>
      <img v-if="uploadReady === true" src="" alt="" ref="itemImage" />
      <div class="file-input-region">
        <label>
          <span class="file-input-label">Upload</span>
          <input type="file" ref="fileInput" accept="image/*" class="file-input" capture @change="analyzeFile" />
        </label>
      </div>
      <button v-show="uploadReady === true" @click="addImage" :disabled="uploadReady === false">Upload</button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue"

export default {
  name: 'ItemImage',
  components: {
    
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const addImage = () => {
      // console.log(`adding image for ${props.item._id}!`)
      const reader = new FileReader()
      const newImage = fileInput.value.files
      let fileName
      let fileType
      // let file
      reader.addEventListener('load', async() => {
        // console.log(reader.result)
        // console.log(fileName)
        // console.log(fileType)
        const response = await fetch('/api/add-item-image', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            file: reader.result,
            fileName: fileName,
            fileType: fileType,
            item: props.item._id
          })
        })
        // console.log(`response from fetch:`)
        // console.log(response)
        // console.log(response.json())
        const imageUrl = await response.json()
        props.item.imageUrl = imageUrl
        // Do we need to set imageKey too?
      }, false);
      if (newImage[0]) {
        reader.readAsDataURL(newImage[0])
        fileName = newImage[0].name
        fileType = newImage[0].type
        // console.log(fileType)
      }
    }
    const analyzeFile = () => {
      if (fileInput.value.files[0]) {
        if (fileInput.value.files[0].size > 4194304) {
          // Reject
          // console.log('File is too large!!!')
          uploadReady.value = false
        } else {
          // Make Upload Button Usable
          // console.log('File meets requirements!')
          const reader = new FileReader()
          const newImage = fileInput.value.files
          reader.addEventListener('load', () => {
            itemImage.value.src = reader.result
          }, false);
          if (newImage[0]) {
            reader.readAsDataURL(newImage[0])
          }
          uploadReady.value = true
        }
      } else {
        console.log('No file was selected.')
        itemImage.value.src = ''
        uploadReady.value = false
      }
    }
    const deleteImage = async() => {
      console.log(`deleting image of key ${props.item.imageKey}!`)
      const response = await fetch('/api/delete-item-image', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: props.item._id,
          key: props.item.imageKey
        })
      })
      const result = await response.json()
      if (result.matchedCount) {
        props.item.imageKey = null
        props.item.imageUrl = null
      }
    }
    const fileInput = ref(null)
    const itemImage = ref(null)
    const uploadReady = ref(false)
    onMounted(() => {
      
    })
    return { addImage, analyzeFile, deleteImage, fileInput, itemImage, uploadReady }
  }
}
</script>

<style lang="postcss">
button:disabled {
  opacity: 0.5;
}
.file-input-region {
  position: relative;
}
.file-input {
  height: 100%;
  position: absolute;
  visibility: hidden;
  width: 100%;
}
.file-input-label {
  border: 1px solid var(--blue);
  cursor: pointer;
  display: block;
  padding: 0.25rem 0.5rem;
  text-align: center;
  width: 100%;
}
</style>