

window.onload=function weeklychart1(){

  const data = [
    { week: "week1", count: 10 },
    { week: "week", count: 20 },
    { week: "week", count: 15 },
    { week: "week", count: 25 },
    
  ];

const chart = new Chart(
    document.getElementById('myChart2'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.week),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
}
