import nock from 'nock'
import { sendMail } from '../../src/services/sendgrid.js'

it('sends mail', async () => {
  nock('https://api.sendgrid.com')
    .filteringRequestBody(() => '*')
    .post('/v3/mail/send', '*')
    .reply(202)

  const response = await sendMail('test', 'Test', '<h1>Just Testing</h1>')

  expect(response[0].statusCode).toBe(202)
})
