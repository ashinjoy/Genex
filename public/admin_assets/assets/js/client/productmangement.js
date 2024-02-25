        window.onload=async ()=>{
            let productBody=document.getElementById('card-bodyProduct')
            console.log(productBody)
            const url=`/admin/defaultproductlist-pagination`
             const res=await fetch(url)
             const proDetail=await res.json()
             console.log('order',proDetail)
             productBody.innerHTML=''
             proDetail.forEach((product)=>{
                injectData(product)
             })
        }

        async function orderPagination (page){
            const productBody=document.getElementById('card-bodyProduct')
            console.log(productBody)
            const url=`/admin/defaultproductlist-pagination?page=${page}`
             const res=await fetch(url)
             const proDetail=await res.json()
             console.log('order',proDetail)
             productBody.innerHTML=''
             proDetail.forEach((product)=>{
                injectData(product)
             })
        }

        


        function injectData(product){

            let productBody=document.getElementById('card-bodyProduct')
           
            // Create article element with class "itemlist"
            const article = document.createElement('article');
            article.classList.add('itemlist');
            
            // Create div element with class "row" and "align-items-center"
            const row = document.createElement('div');
            row.classList.add('row', 'align-items-center');
            
            // Create div element with class "col" for checkbox column
            const colCheck = document.createElement('div');
            colCheck.classList.add('col', 'col-check', 'flex-grow-0');
            
            // Create checkbox input element
            const checkbox = document.createElement('input');
            checkbox.classList.add('form-check-input');
            checkbox.setAttribute('type', 'checkbox');
            
            // Append checkbox input to div with class "col-check"
            colCheck.appendChild(checkbox);
            
            // Create div element with class "col-lg-4", "col-sm-4", "col-8", "flex-grow-1", and "col-name"
            const colName = document.createElement('div');
            colName.classList.add('col-lg-4', 'col-sm-4', 'col-8', 'flex-grow-1', 'col-name');
            
            // Create anchor element with class "itemside"
            const anchor = document.createElement('a');
            anchor.classList.add('itemside');
            anchor.setAttribute('href', '#');
            
            // Create div element with class "left"
            const left = document.createElement('div');
            left.classList.add('left');
            
            // Create image element with class "img-sm", "img-thumbnail", and set src attribute dynamically
            const img = document.createElement('img');
            img.classList.add('img-sm', 'img-thumbnail');
            img.setAttribute('src', '/assets/' + product.img[0]);
            img.setAttribute('alt', 'Item');
            img.setAttribute('width', '100px');
            img.setAttribute('height', '70px');
            
            // Append image to div with class "left"
            left.appendChild(img);
            
            // Create div element with class "info"
            const info = document.createElement('div');
            info.classList.add('info');
            
            // Create h6 element with class "mb-0" and set text content dynamically
            const h6 = document.createElement('h6');
            h6.classList.add('mb-0');
            h6.textContent = product.name;
            
            // Append h6 to div with class "info"
            info.appendChild(h6);
            
            // Append div with class "left" and div with class "info" to anchor element
            anchor.appendChild(left);
            anchor.appendChild(info);
            
            // Append anchor element to div with class "col-name"
            colName.appendChild(anchor);
            
            // Append all columns to div with class "row"
            row.appendChild(colCheck);
            row.appendChild(colName);
            
            // Create div elements for columns with class "col-lg-2", "col-sm-2", "col-4"
            const colPrice = document.createElement('div');
            colPrice.classList.add('col-lg-2', 'col-sm-2', 'col-4', 'col-price');
            colPrice.innerHTML = '<span>RS. ' + product.salesprice + '</span>';
            
            const colStatusActive = document.createElement('div');
            colStatusActive.classList.add('col-lg-2', 'col-sm-2', 'col-4', 'col-status');
            colStatusActive.innerHTML = '<span class="badge rounded-pill alert-success">Active</span>';

            const colStatusblocked = document.createElement('div');
            colStatusblocked.classList.add('col-lg-2', 'col-sm-2', 'col-4', 'col-status');
            colStatusblocked.innerHTML = '<span class="badge rounded-pill alert-danger">Inactive</span>'
            
            const colAction = document.createElement('div');
            colAction.classList.add('col-lg-2', 'col-sm-2', 'col-4', 'col-action', 'text-end');
            
            // Create edit button
            const editButton = document.createElement('a');
            editButton.setAttribute('href', '/admin/products/editproduct?id=' + product._id);
            editButton.classList.add('btn', 'btn-sm', 'font-sm', 'rounded', 'btn-brand');
            editButton.innerHTML = '<i class="material-icons md-edit"></i> Edit';
            
            // Create block/unblock button
            const blockButton = document.createElement('button');
            blockButton.setAttribute('type', 'button');
            blockButton.classList.add('btn', 'btn-sm', 'btn-block', 'rounded', 'font-sm');
            blockButton.textContent = 'Block';
                blockButton.addEventListener('click', function() {
                    blockproduct(product._id);
                });
            
                const unblockButton = document.createElement('button');
                unblockButton.setAttribute('type', 'button');
                unblockButton.classList.add('btn', 'btn-sm', 'btn-brand', 'rounded', 'font-sm');
                unblockButton.textContent = 'Unblock';
                unblockButton.addEventListener('click', function() {
                    unblockproduct(product._id);
                });
                
            
            
            // Append buttons to div with class "col-action"
            
            colAction.appendChild(editButton);
            if(product.is_active == true){
                colAction.appendChild(blockButton);
            
            }
            else{
                colAction.appendChild(unblockButton);
            
            }
            
            // Append columns to div with class "row"
            row.appendChild(colPrice);
            if(product.is_active == true){
                row.appendChild(colStatusActive);

            }
            else{
                row.appendChild(colStatusblocked);

            }
            row.appendChild(colAction);
            
            //ADD offer
            
                // const AddOffer = document.createElement('button');
                // blockButton.setAttribute('type', 'button');
                // blockButton.textContent = 'Add Offer';
                
         
                // const removeOffer = document.createElement('button');
                // blockButton.setAttribute('type', 'button');
               
                // blockButton.textContent = 'Remove Offer';
               
                //  if(product.offerPrice > 0){
                //  row.appendChild(AddOffer)
                // }
                // else{
                //  row.appendChild(removeOffer)

                // }
               
            // Append row to article
            article.appendChild(row);
            
            // Append article to the document body or any other desired parent element
            
            productBody.appendChild(article);
            
                    }
            

async function blockproduct(productid){
    try{
        console.log('enetered the function blovk')
        url=`http://localhost:3000/admin/products/blockproduct?id=${productid}`
        const response=await fetch(url)
        if(response.ok){
            const data=await response.json()
            await Swal.fire({icon:'success',
            title:'Blocked Successfully'
             })
            
                window.location.reload()

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
           
            await Swal.fire({icon:'success',
            title:'Unblocked Successfully'
             })
            
                window.location.reload()
            
        } else {
          console.error(`Error:${response.status}`);
        }
    }

 catch (err) {
console.error(err);
}
}
