

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
//   const today=new Date()
//   console.log(today)
//   const endingMonth=new Date(today)
//   endingMonth.setHours(0,0,0,0)
//   console.log("ending",endingMonth)
//   const startingMonth=new Date(today)
//   startingMonth.setMonth(endingMonth.getMonth()-11)
//   startingMonth.setHours(0,0,0,0)
//   console.log("startingDate",startingMonth)
// let month=[]
//  for(i=0;i<12;i++){
//   let monthNumber =new Date(startingMonth)
//   monthNumber.setMonth(startingMonth.getMonth()+i)
//   monthNumber.setHours(0,0,0,0)
//   const monthName=monthNumber.toLocaleString('default',{month:'long'})
//   month.push({monthlyData:monthName,monthNumber})
//  }
//  console.log("month",month)
//   return month
const monthDatefilter=[]
const today=new Date()
const monthStarting=new Date(today)
monthStarting.setDate(1)
monthStarting.setUTCHours(0)
monthStarting.setUTCMinutes(0)
monthStarting.setUTCSeconds(0)
console.log(monthStarting)
for(i=1;i<=12;i++)
{
  const month=new Date(monthStarting)
  month.setMonth(month.getMonth()-(12-i))
  const monthName=month.toLocaleString('default',{month:'long'})
  monthDatefilter.push({month:month,monthName})
  

}
// console.log(monthDatefilter)
// console.log(month1)
return monthDatefilter
  
}

function yearlyData(){
const today=new Date()
const startingDate=new Date(today)
startingDate.setMonth(0)
startingDate.setDate(1)
startingDate.setUTCHours(0)
startingDate.setUTCMinutes(0)
startingDate.setUTCSeconds(0)
console.log(startingDate)
const endingDate=new Date(today)
return {endingDate:endingDate,startingDate:startingDate}

}
function monthsale(){
const today=new Date()
const startingDate=new Date(today)
startingDate.setDate(1)
startingDate.setUTCHours(0)
startingDate.setUTCMinutes(0)
startingDate.setUTCSeconds(0)
console.log(startingDate)
const endingDate=new Date(today)
return {endingDate:endingDate,startingDate:startingDate}
}

module.exports={weeklyData,monthlyData,yearlyData,monthsale}
