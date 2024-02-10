

window.onload=async function weeklychart1(){
      console.log("fetch");
  const url = '/admin/weekly-report'
  const res = await fetch(url)
  const detail=await res.json()
  console.log(detail)
  
  const data =detail

const chart = new Chart(
    document.getElementById('myChart'),
    {
      type: 'line',
      data: {
        labels: data.map(row => row.week),
        datasets: [
          {
            label: 'Total Orders per week',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
}

document.getElementById("month").addEventListener("click",monthlydata)

async function monthlydata(){
  url='/admin/monthly-report'
  const res=await fetch(url)
  console.log(res)
  const detail = await res.json() 
  console.log(detail)
  console.log(detail[1].filteredOrders)
  // let label=[]
  // for(i=0;i<12;i++){
  // const labelstorage=  detail[0].

  // }
  
  const monthNameLabel=detail[0].filtered_Datedata.map(month=>month.monthName)
   const data=detail[1].filteredOrders.map(totalorder =>totalorder.length > 0 ? totalorder[0].orderTotal : 0)
  
console.log("labels",monthNameLabel)
console.log(data)


const chart = new Chart(
    document.getElementById('myChart2'),
    {
      type: 'doughnut',
      data: {
        labels: monthNameLabel,
        datasets: [
          {
            label: 'Total Orders per Month',
            data: data
          }
        ]
      }
    }
  );
}
