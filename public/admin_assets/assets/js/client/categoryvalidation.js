const categoryname=document.getElementById("cat_name");
const catimage=document.getElementById("catimg");
const description=document.getElementById("desc");
const nameerror=document.getElementById("error1");
const imgerror=document.getElementById("error2");
const desc_error=document.getElementById("error3");
const catform=document.getElementById("catform");

function validatecatname (){
 const catvalue = categoryname.value
const namepattern=/^[a-zA-Z]+$/
if(catvalue.trim() === ""){
    nameerror.style.display="block";
    nameerror.innerHTML="please enter category name in the field"
}
else if(!namepattern.test(catvalue)){
    nameerror.style.display="block";
    nameerror.innerHTML="please enter valid category name in the field"
}
else{
    nameerror.style.display="none";
    nameerror.innerHTML=""
}
}
function validteImg(){
    const img = catimage.files
    if(img.length === 0||!img){
        imgerror.style.display="block";
        imgerror.innerHTML="please choose a image"
    }
    else{
        imgerror.style.display="none";
        imgerror.innerHTML=""
    }
    }

function validate_description(){
    const desc=description.value;
    if(desc.trim() === ""){
        desc_error.style.display ="block";
        desc_error.innerHTML ="please enter the description"
    }
    else{
        desc_error.style.display ="none";
        desc.innerHTML=""
    }
}

categoryname.addEventListener("blur",validatecatname)
description.addEventListener("blur",validate_description)
catimage.addEventListener("change",validteImg)
catform.addEventListener("submit",(event)=>{
     validatecatname()
     validteImg()
     validate_description()
    if(nameerror.innerHTML||imgerror.innerHTML||desc_error.innerHTML){
        event.preventDefault()
    }

})




