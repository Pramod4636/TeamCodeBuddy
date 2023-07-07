const { accountSid, authToken  } = require('../config')

const shareWhatsApp = (req, res) => {
    console.log(accountSid,authToken);
    const client = require('twilio')(accountSid, authToken);
     console.log(req.body);
    client.messages
            .create({
                from: 'whatsapp:+18148134393',
                body: req.body.code,
                to: `whatsapp:${req.body.phone}`
            })
            .then(() => {
                res.status(200).json("Sent to whatsapp")
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            })
}

module.exports = { shareWhatsApp }