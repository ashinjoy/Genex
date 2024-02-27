const sendotp=document.getElementById("sendOtpBtn")
const userid=document.getElementById("userid")
const userinp_val=userid.value
const timer=document.getElementById("timer")

let allowClick=true
sendotp.addEventListener("click",async()=>{
    try{
        if(allowClick){
            console.log("allowclick changed")
            allowClick=false
            sendmail()
            setTimeout(()=>{
                allowClick=true
            },60000)
        }
    }
    catch(err){
        console.error(err)
    }
    
})


async function sendmail(){
    try{
        sendotp.innerHTML="Resend OTP"
        timerstart()
        const  url=`/generate-otp?id=${userinp_val}`
        const response=await fetch(url)
        const data=await response.json()
        console.log(data)
    }
    catch(err){
        console.error(err)
    }
  
}

  let seconds=60
  function showtime(){
    timer.style.display="block"
    timer.innerHTML=`OTP Expires in ${seconds}sec`

  }

  function timerstart(){
    showtime()
    if(seconds>0){
        seconds--
        setTimeout(timerstart,1000)
    }
    else{
        timer.style.display="block"
    timer.innerHTML=`OTP has been expired`
    seconds=seconds+60;

    }
  }