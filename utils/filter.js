
function weeklyData(){
   const today=new Date()
   console.log("kkkkk")
   const fourthWeek=new Date(today)
   fourthWeek.setDate(today.getDate()-7)
   fourthWeek.setHours(0,0,0,0)
    
  

    const thirdWeek=new Date(today)
    thirdWeek.setDate(today.getDate()-14)
    thirdWeek.setHours(0,0,0,0)
   
   

    const secondWeek=new Date(today)
    secondWeek.setDate(today.getDate()-21)
    secondWeek.setHours(0,0,0,0)
   

    const firstWeek=new Date(today)
    firstWeek.setDate(today.getDate()-28)
    firstWeek.setHours(0,0,0,0)
    
   
    return {
      firstWeek:firstWeek,
      secondWeek:secondWeek,
      thirdWeek:thirdWeek,
      fourthWeek:fourthWeek,
      fifthWeek:today
    }
  
    
}

function monthlyData(){
  const today=new Date(today)
  
}

module.exports={weeklyData,monthlyData}
