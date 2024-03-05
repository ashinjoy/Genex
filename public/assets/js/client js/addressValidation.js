
 
 const nametag=document.getElementById("name");
 const streettag=document.getElementById("street");
 const landmarktag=document.getElementById("landmark");
 const pincodetag=document.getElementById("pincode");  
 const citytag=document.getElementById("city")
 const statetag=document.getElementById("state")
 const phonetag=document.getElementById("phone")
 const emailtag=document.getElementById("email")
 const countrytag=document.getElementById("country") 
 const addressform=document.getElementById("addform")
   
 const nameerror=document.getElementById("error1")
 const streeterror=document.getElementById("error2")
 const landmarkerror=document.getElementById("error3")
 const pincodeerror=document.getElementById("error4")
 const cityerror=document.getElementById("error5")
 const stateerror=document.getElementById("error6")
 const phoneerror=document.getElementById("error7")
 const emailerror=document.getElementById("error8")  
 const countryerror=document.getElementById("error9")



function namevalidate(){
const name=nametag.value
var namepattern=/^[A-Z a-z]+$/
   
if(name.trim() === ""){
  nameerror.style.display="block";
  nameerror.innerHTML="Please enter a valid name"
}
else if(name.length<=1)
{
  nameerror.style.display="block";
  nameerror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(name)){
  nameerror.style.display="block"
  nameerror.innerHTML="Name should only conatin Alphabets only"
}

else {
  nameerror.style.display="none";
  nameerror.innerHTML=""
}

}

function streetvalidate(){
const streets=streettag.value
var namepattern=/^[A-Z a-z]+$/

if(streets.trim() === ""){
  streeterror.style.display="block";
  streeterror.innerHTML="Please enter a valid name"
}
else if(streets.length<=1)
{
  streeterror.style.display="block";
  streeterror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(streets)){
  streeterror.style.display="block"
  streeterror.innerHTML="Name should only conatin Alphabets only"
}

else {
  streeterror.style.display="none";
  streeterror.innerHTML=""
}

}

function landmarkvalidate(){
const landmark=landmarktag.value
var namepattern=/^[A-Z a-z]+$/    

if(landmark.trim() === ""){
  landmarkerror.style.display="block";
  landmarkerror.innerHTML="Please enter a valid name"
}
else if(landmark.length<=1)
{
  landmarkerror.style.display="block";
  landmarkerror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(landmark)){
  landmarkerror.style.display="block"
  landmarkerror.innerHTML="Name should only conatin Alphabets only"
}

else {
  landmarkerror.style.display="none";
  landmarkerror.innerHTML=""
}

}


function cityvalidate(){
const city=citytag.value
var namepattern=/^[A-Z a-z]+$/

if(city.trim() === ""){
  cityerror.style.display="block";
  cityerror.innerHTML="Please enter a valid name"
}
else if(city.length<=1)
{
  cityerror.style.display="block";
  cityerror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(city)){
  cityerror.style.display="block"
  cityerror.innerHTML="Name should only conatin Alphabets only"
}

else {
  cityerror.style.display="none";
  cityerror.innerHTML=""
}

}





function pincodevalidate(){
  const pincode=pincodetag.value;
  const phonepattern=/\d/
  if(pincode.trim()==""){
    pincodeerror.style.display="block";
    pincodeerror.innerHTML="Please enter a valid pincode"

  }
  
  else if(pincode.length>6||pincode.length<6||!phonepattern.test(pincode))
  {
    pincodeerror.style.display="block";
    pincodeerror.innerHTML="Please enter a valid pincode"

  }
  else {
    pincodeerror.style.display="none";
    pincodeerror.innerHTML=""

  }
}


function emailvalidate(){
  const emailpattern=/^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/
  const email=emailtag.value
  if(!emailpattern.test(email)){
    emailerror.style.display="block";
    emailerror.innerHTML="Enter valid email"

  }
  else if(email.trim()==""){
    emailerror.style.display="block";
    emailerror.innerHTML="Please enter your email"

  }
  else{
    emailerror.style.display= "none";
    emailerror.innerHTML=""
    
  }
}

function phonevalidate(){
  const phone=phonetag.value;
  const phonepattern=/\d/
  if(phone.trim()==""){
    phoneerror.style.display="block";
    phoneerror.innerHTML="Please enter a valid phonenumber"

  }
  
  else if(phone.length>10||phone.length<10||!phonepattern.test(phone))
  {
    phoneerror.style.display="block";
    phoneerror.innerHTML="Please enter a valid phonenumber"

  }
  else {
    phoneerror.style.display="none";
    phoneerror.innerHTML=""

  }
}


function statevalidate(){
const state=statetag.value
var namepattern=/^[A-Z a-z]+$/

if(state.trim() === ""){ 
  stateerror.style.display="block";
  stateerror.innerHTML="Please enter a valid name"
}    
else if(state.length<=1)
{
  stateerror.style.display="block";
  stateerror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(state)){
  stateerror.style.display="block"
  stateerror.innerHTML="Name should only conatin Alphabets only"
}

else {
  stateerror.style.display="none";
  stateerror.innerHTML=""
}

}
       
function countryvalidate(){
const country=countrytag.value 
var namepattern=/^[A-Z a-z]+$/

if(country.trim() === ""){
  countryerror.style.display="block";
  countryerror.innerHTML="Please enter a valid name"
}
else if(country.length<=1)
{
  countryerror.style.display="block";
  countryerror.innerHTML="name should contain more than a letter"
}
else if(!namepattern.test(country)){
  countryerror.style.display="block"
  countryerror.innerHTML="Name should only conatin Alphabets only"
}

else {
  countryerror.style.display="none";
  countryerror.innerHTML=""
}

}




nametag.addEventListener("blur",namevalidate);
streettag.addEventListener("blur",streetvalidate);
landmarktag.addEventListener("blur",landmarkvalidate);
pincodetag.addEventListener("blur",pincodevalidate);
citytag.addEventListener("blur",cityvalidate);
statetag.addEventListener("blur",statevalidate);
phonetag.addEventListener("blur",phonevalidate);
emailtag.addEventListener("blur",emailvalidate);
countrytag.addEventListener("blur",countryvalidate);




addressform.addEventListener("submit",(event)=>{
  namevalidate()
  streetvalidate()
  landmarkvalidate()
  pincodevalidate()
  cityvalidate()
  statevalidate
  emailvalidate()
  phonevalidate()
  countryvalidate()
  if(nameerror.innerHTML||streeterror.innerHTML||landmarkerror.innerHTML||pincodeerror.innerHTML||cityerror.innerHTML||stateerror.innerHTML||emailerror.innerHTML|| phoneerror.innerHTML||countryerror.innerHTML){
    event.preventDefault()
  }
})
