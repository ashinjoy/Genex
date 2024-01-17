function previewImage(e) { 
  console.log("entered the fn")
  const fileInput = document.getElementById("fileInput");
  console.log(fileInput)
  const imagePreview = document.getElementById("image-preview");
  console.log(imagePreview)
  const files = fileInput.files;
  imagePreview.innerHTML = "";

for(const file of files){ 
  const reader = new FileReader();
  reader.onload = function (e) {
    let image = document.createElement("img");
    console.log(image)
    image.classList.add("image-preview");
    image.src = e.target.result;
    console.log(image.src)
    imagePreview.appendChild(image);
  };
  reader.readAsDataURL(file)

}
  
}
