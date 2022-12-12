// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'akeijw8b6i'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-lfuexov4t5p14sn5.us.auth0.com',            // Auth0 domain
  clientId: 'GWdXTiBQIJQrBvCVnFvUQZ6LunkKzQUo',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
