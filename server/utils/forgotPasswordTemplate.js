const forgotPasswordTemplate = (name, otp) => {
    return `
        <div>
            <p>Dear ${name}</p> <!-- Corrected closing tag for <p> -->
            <br/>
            <p>You have requested to reset your password. Please use the following OTP to reset your password:</p>
            <div style="background-color: yellow; padding: 10px; font-size: 20px;">
                ${otp}
            </div>
            <p>This OTP is valid for an hour only.</p>
            <br/>
            <br/>
            <p>Thanks</p>
            <p>Binkeyit</p>
        </div> <!-- Corrected closing tag for <div> -->
    `;
};

export default forgotPasswordTemplate;
