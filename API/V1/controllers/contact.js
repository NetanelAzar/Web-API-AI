var nodemailer = require('nodemailer');

module.exports = {
    getContact:(req,res)=>{
        const fullName = req.user; // משתמש במידע המזוהה עם המשתמש מהמידלוור
          return res.status(200).render("contact", { layout: "main", title: "contact",username: fullName,profileImage: req.session.profileImage  });
          
        },

        sendMailContact: (req, res) => {
            const { name, email, message } = req.body;
          
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
          
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'New Contact Form Submission',
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  res.status(500).send('Failed to send email');
              } else {
                  console.log('Email sent: ' + info.response);
                  return res.redirect('/contact');
              }
          });
          
          },
}

