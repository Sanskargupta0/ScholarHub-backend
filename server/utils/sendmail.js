const nademailer = require("nodemailer");
const { google } = require("googleapis");

const ClientId = process.env.ClientId;
const ClientSecret = process.env.ClientSecret;
const RedirectUrl = process.env.RedirectUrl;
const RefreshToken = process.env.RefreshToken;

const oAuth2Client = new google.auth.OAuth2(
  ClientId,
  ClientSecret,
  RedirectUrl
);

oAuth2Client.setCredentials({ refresh_token: RefreshToken });

async function sendMail(to, template, name, otp) {
  try {
    const date = new Date().toLocaleDateString();
    const accessToken = await oAuth2Client.getAccessToken();
    if (template == "user") {
      subject = "User Email Verification OTP for ScholarHub";
      text = `
      Your OTP

Hey ${name},
${date}

Thank you for choosing ScholarHub. Use the following OTP to complete the procedure to verify your email address. OTP is valid for 1 hour, and you will get 3 attempts. Do not share this code with others, including ScholarHub employees.

OTP: ${otp}

Need help? Ask at ScholarHubOfficial.help@gmail.com

ScholarHub
Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
Copyright © 2024. All rights reserved.

      `;
      html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ScholarHub</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
        background-repeat: no-repeat;
        background-size: 729px 235px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td style="    align-items: center;
              display: flex;
              font-size: 50px;
              font-weight: bold;
              color: #1db398;">
                <img
                  alt=""
                  src="https://i.postimg.cc/nzdqchTZ/logo.png"
                  height="100px"
                />
                <span style="padding-top: 10px;">
                  cholarHub
                </span>
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
                  >${date}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 60px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for choosing ScholarHub . Use the following OTP
              to complete the procedure to Verify your email address. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">1 hour, You will get 3 attempt</span>.
              Do not share this code with others, including ScholarHub
              employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              ${otp}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:ScholarHubOfficial.help@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >ScholarHubOfficial.help@gmail.com</a
          >
          
          
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          ScholarHub 
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
        </p>

        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2024 . All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>`;
    } else if (template == "reset") {
      subject = "Your Password Reset OTP for ScholarHub";
      text = `
Your Password Reset OTP

Hello ${name},
${date}

Thank you for choosing ScholarHub. To reset your password, 
please use the following One-Time Password (OTP). 
The OTP is valid for 1 hour, and you have 3 attempts
to complete the verification.
Please do not share this code with others,
including ScholarHub employees.

Password Reset OTP: ${otp}

If you didn't request a password reset, please ignore this email.

Need help? Contact us at ScholarHubOfficial.help@gmail.com.

Best regards,
ScholarHub Team
      `;
      html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ScholarHub</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
  <div
  style="
    max-width: 680px;
    margin: 0 auto;
    padding: 45px 30px 60px;
    background: #f4f7ff;
    background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
    background-repeat: no-repeat;
    background-size: 729px 235px;
    background-position: top center;
    font-size: 14px;
    color: #434343;
  "
>
  <header>
    <table style="width: 100%;">
      <tbody>
        <tr style="height: 0;">
          <td style="    align-items: center;
          display: flex;
          font-size: 50px;
          font-weight: bold;
          color: #1db398;">
            <img
              alt=""
              src="https://i.postimg.cc/nzdqchTZ/logo.png"
              height="100px"
            />
            <span style="padding-top: 10px;">
              cholarHub
            </span>
          </td>
          <td style="text-align: right;">
            <span
              style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
              >${date}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 60px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Password Reset OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hello ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for choosing ScholarHub. To reset your password, please use the following OTP to complete the verification. The OTP is valid for
              <span style="font-weight: 600; color: #1f1f1f;">1 hour, and you have 3 attempts</span>. Do not share this code with others, including ScholarHub employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              ${otp}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:ScholarHubOfficial.help@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >ScholarHubOfficial.help@gmail.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          ScholarHub
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
        </p>

        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2024. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>

      `;
    } else if (template == "login") {
      subject = "Registration Successful for ScholarHub";
      text = `
Welcome to ScholarHub!

Hey ${name},

Congratulations! Your registration with ScholarHub was successful. Now you can enjoy using our platform to the fullest.

Your Temporary Password: ${otp}

We recommend changing your password after your first login for security reasons.

Need help? Ask at ScholarHubOfficial.help@gmail.com

ScholarHub
Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
Copyright © 2024. All rights reserved.
      `;
      html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Welcome to ScholarHub!</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
  <div
  style="
    max-width: 680px;
    margin: 0 auto;
    padding: 45px 30px 60px;
    background: #f4f7ff;
    background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
    background-repeat: no-repeat;
    background-size: 729px 235px;
    background-position: top center;
    font-size: 14px;
    color: #434343;
  "
>
  <header>
    <table style="width: 100%;">
      <tbody>
        <tr style="height: 0;">
          <td style="    align-items: center;
          display: flex;
          font-size: 50px;
          font-weight: bold;
          color: #1db398;">
            <img
              alt=""
              src="https://i.postimg.cc/nzdqchTZ/logo.png"
              height="100px"
            />
            <span style="padding-top: 10px;">
              cholarHub
            </span>
          </td>
          <td style="text-align: right;">
            <span
              style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
              >${date}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 60px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Welcome to ScholarHub!
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Congratulations! Your registration with ScholarHub was successful. Now you can enjoy using our platform to the fullest.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 20px;
                font-weight: 600;
                color: #1f1f1f;
              "
            >
              Your Temporary Password: <span style="color: #ba3d4f;">${otp}</span>
            </p>
            <p
              style="
                margin: 0;
                margin-top: 20px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              We recommend changing your password after your first login for security reasons.
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:ScholarHubOfficial.help@gmail.com"
            style="color: #499fb6; text-decoration: none"
            >ScholarHubOfficial.help@gmail.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          ScholarHub
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343">
          Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
        </p>

        <p style="margin: 0; margin-top: 16px; color: #434343">
          Copyright © 2024. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
      `;
    } else if (template == "disable") {
      subject = "Your ScholarHub Account Has Been Disabled";
      text = `
      Account Disabled Notice
  
  Hey ${name},
  ${date}
  
  We're writing to inform you that your ScholarHub account has been disabled due to a violation of our terms of service or suspicious activity.
  
  If you believe this is a mistake or you need assistance, please contact us at ScholarHubOfficial.help@gmail.com for further clarification.
  
  ScholarHub
  Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
  Copyright © 2024. All rights reserved.
      `;
      html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>ScholarHub</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
    <div
    style="
      max-width: 680px;
      margin: 0 auto;
      padding: 45px 30px 60px;
      background: #f4f7ff;
      background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
      background-repeat: no-repeat;
      background-size: 729px 235px;
      background-position: top center;
      font-size: 14px;
      color: #434343;
    "
  >
    <header>
      <table style="width: 100%;">
        <tbody>
          <tr style="height: 0;">
            <td style="    align-items: center;
            display: flex;
            font-size: 50px;
            font-weight: bold;
            color: #1db398;">
              <img
                alt=""
                src="https://i.postimg.cc/nzdqchTZ/logo.png"
                height="100px"
              />
              <span style="padding-top: 10px;">
                cholarHub
              </span>
            </td>
            <td style="text-align: right;">
              <span
                style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
                >${date}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 60px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your Account Has Been Disabled
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey ${name},
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                We regret to inform you that your ScholarHub account has been disabled due to a violation of our terms of service or suspicious activity.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                If you believe this was done in error or need help, please reach out to us at 
                <span style="font-weight: 600; color: #1f1f1f;">
                  ScholarHubOfficial.help@gmail.com
                </span>
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Ask at
            <a
              href="mailto:ScholarHubOfficial.help@gmail.com"
              style="color: #499fb6; text-decoration: none;"
              >ScholarHubOfficial.help@gmail.com</a
            >
            
            
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            ScholarHub 
          </p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">
            Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
          </p>
  
          <p style="margin: 0; margin-top: 16px; color: #434343;">
            Copyright © 2024. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>`;
    } else if (template == "enable") {
      subject = "Your ScholarHub Account Has Been Reactivated";
      text = `
      Account Reactivation Notice
  
  Hey ${name},
  ${date}
  
  Good news! Your ScholarHub account has been successfully reactivated. You can now log back in and resume using our services.
  
  If you have any questions or experience any issues, feel free to reach out to us at ScholarHubOfficial.help@gmail.com.
  
  ScholarHub
  Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
  Copyright © 2024. All rights reserved.
      `;
      html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>ScholarHub</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
    <div
    style="
      max-width: 680px;
      margin: 0 auto;
      padding: 45px 30px 60px;
      background: #f4f7ff;
      background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
      background-repeat: no-repeat;
      background-size: 729px 235px;
      background-position: top center;
      font-size: 14px;
      color: #434343;
    "
  >
    <header>
      <table style="width: 100%;">
        <tbody>
          <tr style="height: 0;">
            <td style="    align-items: center;
            display: flex;
            font-size: 50px;
            font-weight: bold;
            color: #1db398;">
              <img
                alt=""
                src="https://i.postimg.cc/nzdqchTZ/logo.png"
                height="100px"
              />
              <span style="padding-top: 10px;">
                cholarHub
              </span>
            </td>
            <td style="text-align: right;">
              <span
                style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
                >${date}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 60px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your Account Has Been Reactivated
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey ${name},
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                We're happy to let you know that your ScholarHub account has been reactivated. You can now log back in and resume using all the services provided by ScholarHub.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                If you have any questions or need assistance, feel free to contact us at 
                <span style="font-weight: 600; color: #1f1f1f;">
                  ScholarHubOfficial.help@gmail.com
                </span>.
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Ask at
            <a
              href="mailto:ScholarHubOfficial.help@gmail.com"
              style="color: #499fb6; text-decoration: none;"
              >ScholarHubOfficial.help@gmail.com</a
            >
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            ScholarHub 
          </p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">
            Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
          </p>
  
          <p style="margin: 0; margin-top: 16px; color: #434343;">
            Copyright © 2024. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>`;
    } else if (template == "delete") {
      subject = "Your ScholarHub Account Has Been Deleted";
      text = `
      Account Deletion Notice
  
  Hey ${name},
  ${date}
  
  We regret to inform you that your ScholarHub account has been deleted by an administrator due to a violation of our terms of service or after a request for deletion.
  
  All your data has been permanently removed from our system, and you will no longer have access to your account.
  
  If you believe this action was taken in error or need further clarification, please contact us at ScholarHubOfficial.help@gmail.com.
  
  ScholarHub
  Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
  Copyright © 2024. All rights reserved.
      `;
      html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>ScholarHub</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
    <div
    style="
      max-width: 680px;
      margin: 0 auto;
      padding: 45px 30px 60px;
      background: #f4f7ff;
      background-image: url(https://img.freepik.com/premium-photo/creative-beautiful-illustration-happy-teachers-day-background_1118862-15398.jpg);
      background-repeat: no-repeat;
      background-size: 729px 235px;
      background-position: top center;
      font-size: 14px;
      color: #434343;
    "
  >
    <header>
      <table style="width: 100%;">
        <tbody>
          <tr style="height: 0;">
            <td style="    align-items: center;
            display: flex;
            font-size: 50px;
            font-weight: bold;
            color: #1db398;">
              <img
                alt=""
                src="https://i.postimg.cc/nzdqchTZ/logo.png"
                height="100px"
              />
              <span style="padding-top: 10px;">
                cholarHub
              </span>
            </td>
            <td style="text-align: right;">
              <span
                style="font-size: 16px; line-height: 30px;  font-weight: bolder;"
                >${date}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 60px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your Account Has Been Deleted
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey ${name},
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                We regret to inform you that your ScholarHub account has been deleted by an administrator. This may have occurred due to a violation of our terms of service or after a request for deletion.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                All your data has been permanently removed from our system, and you will no longer have access to your account.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                If you believe this was done in error or need further clarification, feel free to reach out to us at 
                <span style="font-weight: 600; color: #1f1f1f;">
                  ScholarHubOfficial.help@gmail.com
                </span>.
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Ask at
            <a
              href="mailto:ScholarHubOfficial.help@gmail.com"
              style="color: #499fb6; text-decoration: none;"
              >ScholarHubOfficial.help@gmail.com</a
            >
            
            
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            ScholarHub 
          </p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">
            Sitapur, Hardoi Bypass Rd, Lucknow, Uttar Pradesh 226013.
          </p>
  
          <p style="margin: 0; margin-top: 16px; color: #434343;">
            Copyright © 2024. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>`;
    } else {
      console.log("Invalid template");
    }

    const transport = nademailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ScholarHubOfficial.help@gmail.com",
        clientId: ClientId,
        clientSecret: ClientSecret,
        refreshToken: RefreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "ScholarHub📔<ScholarHubOfficial.help@gmail.com>",
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;
