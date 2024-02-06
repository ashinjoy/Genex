

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

