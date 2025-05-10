// This is taken npm install sweetalert2. That shows beautiful alert 
import Swal from "sweetalert2";

const successAlert=(title)=>{
    const alert = Swal.fire({
        position: "center",
        icon: "success",
        title: title,
        showConfirmButton: false,
        timer: 1500
      });
      return alert
}

export default successAlert