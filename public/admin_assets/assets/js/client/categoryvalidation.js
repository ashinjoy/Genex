const categoryname = document.getElementById("cat_name");
const catimage = document.getElementById("catimg");
const description = document.getElementById("desc");
const nameerror = document.getElementById("error1");
const imgerror = document.getElementById("error2");
const desc_error = document.getElementById("error3");
const catform = document.getElementById("catform");

function validatecatname() {
  const catvalue = categoryname.value;
  const namepattern = /^[a-z A-Z]+$/;
  if (catvalue.trim() === "") {
    nameerror.style.display = "block";
    nameerror.innerHTML = "please enter category name in the field";
  } else if (!namepattern.test(catvalue)) {
    nameerror.style.display = "block";
    nameerror.innerHTML = "please enter valid category name in the field";
  } else {
    nameerror.style.display = "none";
    nameerror.innerHTML = "";
  }
}
function validteImg() {

  if (catimage.files.length === 0 ||!catimage.files) {
    imgerror.style.display = "block";
    imgerror.innerHTML = "Please select an image";
  } 
   else if(catimage.files.length == 1){
    console.log("hi")
    var selectedImg = catimage.files[0];
    var selectedImgType = selectedImg.type;

  const validImgMimetypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
   if (!validImgMimetypes.includes(selectedImgType)) {
        imgerror.style.display = "block";
        imgerror.innerHTML = "Only supports /jpeg, /png, /gif, /webp formats";
    }
    else {
        imgerror.style.display = "none";
        imgerror.innerHTML = "";
      }
  } 
  else{
    imgerror.style.display = "none";
    imgerror.innerHTML = "";
  }
 
}

function validate_description() {
  const desc = description.value;
  if (desc.trim() === "") {
    desc_error.style.display = "block";
    desc_error.innerHTML = "please enter the description";
  } else {
    desc_error.style.display = "none";
    desc.innerHTML = "";
  }
}

categoryname.addEventListener("blur", validatecatname);
description.addEventListener("blur", validate_description);
catimage.addEventListener("change", validteImg);
catform.addEventListener("submit", (event) => {
  validatecatname();
  validteImg();
  validate_description();
  if (nameerror.innerHTML  || desc_error.innerHTML) {
    event.preventDefault();
  }
});
