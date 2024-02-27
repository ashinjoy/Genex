const product = document.getElementById("product_name");
const pdesc = document.getElementById("desc");
const preg_price = document.getElementById("regprice");
const psale_price = document.getElementById("saleprice");
const psmall = document.getElementById("small_size");
const pmedium = document.getElementById("medium_size");
const plarge = document.getElementById("large_size");
const pimg = document.getElementById("fileInput");

const producterror = document.getElementById("error1");
const desc_error = document.getElementById("error2");
const regprice_error = document.getElementById("error3");
const saleprice_error = document.getElementById("error4");
const small_error = document.getElementById("error5");
const medium_error = document.getElementById("error6");
const large_error = document.getElementById("error7");
const image_error = document.getElementById("error8");
const pricecompare =document.getElementById("compare_err")
const productform = document.getElementById("prod_form");
 
function validate_productname() {
  console.log('entered')
  const product_value = product.value.trim();
 const namepattern = /^[a-zA-Z\s]+$/;
  if (product_value ==  "") {  
    producterror.style.display = "block";
    producterror.innerHTML = "Please enter the product name";
  } else if (!namepattern.test(product_value)) {
    producterror.style.display = "block";
    producterror.innerHTML = "Please enter valid product name";
  } else {
    producterror.style.display = "none";
    producterror.innerHTML = "";
  }
}

function validate_description() {
  const desc = pdesc.value;
  if (desc.trim() === "") {
    desc_error.style.display = "block";
    desc_error.innerHTML = "please enter the description";
  } else {
    desc_error.style.display = "none";
    desc_error.innerHTML = "";
  }
}



function validate_saleprice() {
  const saleprice = psale_price.value.trim();


  const sale = parseFloat(saleprice);
  if (sale < 0) {
    saleprice_error.style.display = "block";
    saleprice_error.innerHTML = "Enter a valid price";
  } else if (saleprice === "") {
    saleprice_error.style.display = "block";
    saleprice_error.innerHTML = "Please enter a price";
  }
     
   else {
    saleprice_error.style.display = "none";
    saleprice_error.innerHTML = "";
  }
}       
function validteImg() {
// console.log(pimg.files.length)
//   if (pimg.files.length === 0 ||!pimg.files) {
//     image_error.style.display = "block";
//     image_error.innerHTML = "Please select an image";
//   } 
    if(pimg.files.length >= 1){
    console.log("hi")      
    for(i=0;i<4;i++){

      var selectedImg = pimg.files[i];
      var selectedImgType = selectedImg.type;
  
    const validImgMimetypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
     if (!validImgMimetypes.includes(selectedImgType)) {
          image_error.style.display = "block";
          image_error.innerHTML = "Only supports /jpeg, /png, /gif, /webp formats";
      }
      else {
        console.log('sucess')
          image_error.style.display = "none";
          image_error.innerHTML = "";
        }
    }

  } 
  else{
    image_error.style.display = "none";
    image_error.innerHTML = "";
  }
 
}


function validate_smallquantity(){
    console.log(psmall)
    const qtysmall=psmall.value.trim()
    console.log(qtysmall)
    const sqty=parseFloat(qtysmall)
    if(sqty<0||qtysmall.length>4)
    {
        small_error.style.display="block"
        small_error.innerHTML="Enter valid quantity"

    }
else if(qtysmall === ""){
    small_error.style.display="block"
        small_error.innerHTML="Enter quantity"
}
    else{
        small_error.style.display="none"
        small_error.innerHTML=""
    }
}

function validate_mediumquantity(){
    const qtymedium=pmedium.value.trim()
    console.log(qtymedium)

    const mqty=parseFloat(qtymedium)
    console.log(qtymedium)
    if(mqty<0||qtymedium.length>4)
    {
        medium_error.style.display="block"
        medium_error.innerHTML="Enter valid quantity"

    }
    else if(qtymedium === ""){
        medium_error.style.display="block"
        medium_error.innerHTML="Enter quantity"
    }
    else{
        medium_error.style.display="none"
        medium_error.innerHTML=""
    }
}

function validate_largequantity(){
    const qtylarge=plarge.value
    const lqty=parseFloat(qtylarge)
    if(lqty<0||qtylarge.length>4)
    {
        large_error.style.display="block"
        large_error.innerHTML="Enter valid quantity"  

    }
    else if(qtylarge === ""){
        large_error.style.display="block"
        large_error.innerHTML="Enter quantity"
    }
    else{
        large_error.style.display="none"
        large_error.innerHTML=""
    }
}
product.addEventListener("blur",validate_productname) 
pdesc.addEventListener("blur",validate_description) 
psale_price.addEventListener("blur", validate_saleprice);
psmall.addEventListener("blur", validate_smallquantity);
pmedium.addEventListener("blur", validate_mediumquantity);
plarge.addEventListener("blur", validate_largequantity);
pimg.addEventListener("blur",validteImg)
productform.addEventListener("submit",function(event){
    validate_productname(),
    validate_description(),
    validate_saleprice(),
    validate_smallquantity(),        
    validate_mediumquantity(),
    validate_largequantity()
    validteImg()
console.log('going to eteer')
console.log(producterror.innerHTML)
    if(producterror.innerHTML || desc_error.innerHTML|| saleprice_error.innerHTML||small_error.innerHTML ||medium_error.innerHTML ||large_error.innerHTML||image_error.innerHTML)
    {
        event.preventDefault()
    }
    
})