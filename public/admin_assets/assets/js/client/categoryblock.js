
async function blockcategory(userid){
    try{
        console.log("entered blockcategory")
        url = `http://localhost:3000/admin/categories/block-cat?id=${userid}`;
        const response=await fetch(url)
        if(response.ok){
          Swal.fire({
            title:"Bloocked Succesfully",
            icon:"success"
          }).then(()=>{
            window.location.reload()

          })
        }
    }
   catch(err){
    console.error(err)
   }
    
}



async function unblockcategory(userid){
    try{
        console.log("entered unblockcategory")
        url = `http://localhost:3000/admin/categories/unblock-cat?id=${userid}`;
        const response=await fetch(url)
        if(response.ok){
           Swal.fire({
                title:"Unblocked succesfully",      
                icon:"success"
            }).then(()=>{
            window.location.reload()
            })
           
        }
    }
   catch(err){
    console.error(err)
   }
    
}