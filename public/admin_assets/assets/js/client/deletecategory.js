async function deletecategory (userid){
    try{
        const result=await Swal.fire({
            title:"Are You Sure",
            icon:"warning",
            iconColor:"red",
            showCancelButton:true,
            confirmButtonText:"confirm",
            cancelButtonText:"cancel",
        
        })
        
        if(result.isConfirmed){
            url = `http://localhost:3000/admin/categories/delete-category?id=${userid}`;
            const response=await fetch(url)
            if(response.ok){
              const response=await  Swal.fire({
                    title:"Category Deleted Successfully",
                    icon:"success"
                })
                window.location.reload()
            }
            else{
                Swal.fire({
                    title:"Unexpected Error Occured",
                    icon:"error"
                })
        
            }
        
        }
        else{
            console.log("cancel deletion")
        }
        
    }
    catch(err){
Swal.fire({
    title:"error",
    text:"There Was some unexpected Error in process",
    icon:"error"
})
    }
}
