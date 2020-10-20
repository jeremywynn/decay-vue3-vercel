<template>
  <div class="decay-item-image">
    <div v-if="item.imageId" class="image-holder">
      <h1>Truthy!</h1>
        <input type="file" ref="fileInput" accept="image/*" />
        <button @click="addImage">Upload</button>
    </div>
    <div v-else>
      <h1>Falsy!</h1>
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
    /*
    const FileUpload = (img, file) => {
      const reader = new FileReader();  
      this.ctrl = createThrobber(img);
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      
      const self = this;
      this.xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
              const percentage = Math.round((e.loaded * 100) / e.total);
              self.ctrl.update(percentage);
            }
          }, false);
      
      xhr.upload.addEventListener("load", function(e){
              self.ctrl.update(100);
              const canvas = self.ctrl.ctx.canvas;
              canvas.parentNode.removeChild(canvas);
          }, false);
      xhr.open("POST", "http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
      xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
      reader.onload = function(evt) {
        xhr.send(evt.target.result);
      };
      reader.readAsBinaryString(file);
    }
    */
    // var cl = new cloudinary.Cloudinary({cloud_name: "decay", secure: true});
    const addImage = async() => {
      // console.log(`adding image for ${props.item._id}!`)
      const newImage = fileInput.value.files
      const formData = new FormData()
      formData.append('image', newImage[0], props.item_id)
      // formData.append('id', )
      // console.log(newImage)
      // Load Image as a blob and convert to dataURL4
      /*
      // const reader = new FileReader()
      reader.addEventListener("load", function () {
        // convert image file to base64 string
        console.log(reader.result)
        // if (reader.result) {
        //   const response = await fetch('/api/addItemImage', {
        //     method: 'POST',
        //     body: formData
        //   })
        //   if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`)
        //   } else {
        //     console.log(response)
        //   }
        // }
      }, false);
      if (newImage) {
        reader.readAsDataURL(newImage[0])
      }
      */
      // console.log(reader.readAsDataURL(newImage[0]))

      // Send File to Azure Function
      // const response = await fetch('/api/addItemImage', {
      //   method: 'POST',
      //   body: formData
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // } else {
      //   console.log(response)
      // }
      
      /*
      const blob = newImage[0]
      console.log(blob.type)
      */
    }
    const fileInput = ref(null)
    onMounted(() => {

    })
    return { addImage, fileInput }
  }
}
</script>

<style lang="postcss">

</style>