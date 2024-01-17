
async function updateuser(userid){
        const  categoryinp=document.getElementById("cat_name");
        const desc_inp=document.getElementById("desc");
        url = `http://localhost:3000/admin/categories/update-cat?id=${userid}`;
        
}