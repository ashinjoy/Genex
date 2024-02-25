
let orderBody=document.getElementById('ordtableBody')

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

const pageurl=`/admin/defaultpagination?page=1`
const response = await fetch(pageurl)
const orderdata=await response.json()
console.log(orderdata)
 orderBody.innerHTML=''
orderdata.forEach(orderdata => {
    injectData(orderdata)
});


const monthurl='/admin/monthly-report'
const report=await fetch(monthurl)
console.log(report)
const monthlysales = await report.json() 
console.log('monthlysales',monthlysales)
console.log(monthlysales[1].filteredOrders)
// let label=[]
// for(i=0;i<12;i++){
// const labelstorage=  detail[0].

// }

const monthNameLabel=monthlysales[0].filtered_Datedata.map(month=>month.monthName)
 const data2=monthlysales[1].filteredOrders.map(totalorder =>totalorder.length > 0 ? totalorder[0].orderTotal : 0)

console.log("labels",monthNameLabel)
console.log(data2)


const chart1 = new Chart(
  document.getElementById('myChart2'),
  {
    type: 'doughnut',
    data: {
      labels: monthNameLabel,
      datasets: [
        {
          label: 'Total Orders per Month',
          data: data2
        }
      ]
    }
  }
);


}

async function pagination(index){
  const pageurl=`/admin/pagination?page=${index}`
  const response = await fetch(pageurl)
  const orderdata=await response.json()
  console.log(orderdata)
 orderBody.innerHTML=''
  orderdata.forEach(orderdata => {
      injectData(orderdata)
  });
}



function injectData(orders){

  const row =document.createElement('tr')
  //checkbox
  
  
  const checkboxCell = document.createElement('td');
  checkboxCell.classList.add('text-center');
  const checkboxDiv = document.createElement('div');
  checkboxDiv.classList.add('form-check');
  const checkboxInput = document.createElement('input');
  checkboxInput.classList.add('form-check-input');
  checkboxInput.setAttribute('type', 'checkbox');
  checkboxInput.id = 'transactionCheck02';
  const checkboxLabel = document.createElement('label');
  checkboxLabel.classList.add('form-check-label');
  checkboxLabel.setAttribute('for', 'transactionCheck02');
  checkboxDiv.appendChild(checkboxInput);
  checkboxDiv.appendChild(checkboxLabel);
  checkboxCell.appendChild(checkboxDiv);
  row.appendChild(checkboxCell);
  
  // orderid cell
  const orderIdCell=document.createElement('td')
  const orderlink=document.createElement('a')
  orderlink.classList.add('fw-bold')
  orderlink.id='orderid'
  orderlink.innerHTML=orders._id
  orderIdCell.appendChild(orderlink)
  row.appendChild(orderIdCell)
  
  // customername cell
  const customerNameCell=document.createElement('td')
  customerNameCell.textContent=orders.userdetails[0].uname
  row.appendChild(customerNameCell)
  
  // date cell
  const dateCell=document.createElement('td')
  dateCell.innerHTML=orders.createdAt
  row.appendChild(dateCell)
  
  // totalCell cell
  const totalCell=document.createElement('td')
  totalCell.innerHTML=orders.totalprice
  row.appendChild(totalCell)
  
  
  
  // payment status
  const paymentCell=document.createElement('td')
  const status=document.createElement('span')
  status.classList.add('badge', 'badge-pill', 'badge-soft-success')
  status.innerHTML=orders.products.status
  paymentCell.appendChild(status)
  row.appendChild(paymentCell)
  // payment method
  
  const paymentMethodCell=document.createElement('td')
  paymentMethodCell.innerHTML=orders.paymentMethod
  
  row.appendChild(paymentMethodCell)
  // // button cell
  
  const viewDetailCell=document.createElement('a')
  viewDetailCell.classList.add('btn', 'btn-xs')
  viewDetailCell.innerHTML='View Detail'
  row.appendChild(viewDetailCell)
  
  orderBody.appendChild(row)
  
  }

// document.getElementById("month").addEventListener("click",monthlydata)

async function monthlydata(){
//   url='/admin/monthly-report'
//   const res=await fetch(url)
//   console.log(res)
//   const detail = await res.json() 
//   console.log(detail)
//   console.log(detail[1].filteredOrders)
//   // let label=[]
//   // for(i=0;i<12;i++){
//   // const labelstorage=  detail[0].

//   // }
  
//   const monthNameLabel=detail[0].filtered_Datedata.map(month=>month.monthName)
//    const data=detail[1].filteredOrders.map(totalorder =>totalorder.length > 0 ? totalorder[0].orderTotal : 0)
  
// console.log("labels",monthNameLabel)
// console.log(data)


// const chart = new Chart(
//     document.getElementById('myChart2'),
//     {
//       type: 'doughnut',
//       data: {
//         labels: monthNameLabel,
//         datasets: [
//           {
//             label: 'Total Orders per Month',
//             data: data
//           }
//         ]
//       }
//     }
//   );
}

