
function weeklyData(){
    const today=new Date()
console.log  ( today.setDate(today.getDate()-7))
  today.setHours(0,0,0,0)
  
    
}

module.exports={weeklyData}
