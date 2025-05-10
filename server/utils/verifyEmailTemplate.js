const verifyEmailTemplate= ({name, url})=>{
    return `
        <p>${name} </p>
        <p>Thank You for registering Binkeyit</p>
        <a href=${url} style="color:white; background-color: blue; margin-top: 10px; ">
            Verify Email
        </a>
        `
};

export default verifyEmailTemplate;