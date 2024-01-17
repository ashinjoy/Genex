async function blockproduct(productid){
    try{
        url=`http://localhost:3000/admin/products/blockproduct?id=${productid}`
        const response=await fetch(url)
        if(response.ok){
            const data=await response.json()
            window.location.reload();
        } else {
          console.error(`Error:${response.status}`);
        }
    }

 catch (err) {
console.error(err);
}
}


async function unblockproduct(productid){
    try{
        url=`http://localhost:3000/admin/products/unblockproduct?id=${productid}`
        const response=await fetch(url)
        if(response.ok){
            const data=await response.json()
            window.location.reload();
        } else {
          console.error(`Error:${response.status}`);
        }
    }

 catch (err) {
console.error(err);
}
}
