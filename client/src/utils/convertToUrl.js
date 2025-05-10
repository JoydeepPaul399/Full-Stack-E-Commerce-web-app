export const convertToUrl= (name)=>{
    let url= ""
    if(name){
        url= name.toString().replaceAll(" ", "-").replaceAll(",", "-").replaceAll("&", "-")
    }


    return url
}

