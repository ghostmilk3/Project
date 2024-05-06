import sendgridMail from '@sendgrid/mail'
import config from '../config.js'

const { sendgridKey, defaultEmail } = config

sendgridMail.setApiKey(sendgridKey)

export const sendMail = function (toEmail, subject, content, fromEmail = defaultEmail) {
  return sendgridMail.send({
    to: toEmail,
    from: fromEmail,
    subject,
    html: content
  })
}
