
## Installation ⬇️

1. Clone the project
  ```sh
    git clone https://github.com/SubhradeepSS/code_collaborator
  ```
2. Create accounts in [CockroachDB](https://www.cockroachlabs.com/), [Twilio](https://www.twilio.com/) and [auth0](https://auth0.com/)

3. Navigate to the **```server```** folder from project root by
  ```sh
  cd server
  ```
  * create a ```config.js``` file and enter your credentials
    ```sh
    module.exports = {
        accountSid: "<YOUR TWILIO ACCOUNT SID>",
        authToken: "<YOUR TWILIO AUTHTOKEN>",
        username: "<YOUR COCKROACHDB USERNAME>",
        password: "<YOUR COCKROACHDB CLUSTER PASSWORD>",
        host: "<YOUR COCKROACHDB HOST>",
        port: <PORT NO FOR COCKROACHDB>,
        database: "<YOUR COCKROACHDB CLUSTER NAME>.<COCKROACHDB DATABASE NAME>",
        cert_path: "<LOCAL PATH FOR CERTIFICATE DOWNLOADED FROM COCKROACHDB>"
    }
    ```
 * Install all npm packages
    ```sh
    npm i
    ```
 * Run local dev server
    ```sh
    npm run dev
    ```
4. Navigate to **```socket```** folder from root of project by
  ```sh
  cd socket
  ```
  * Install packages
      ```sh
      npm i
      ```
  * Run dev server
      ```sh
      npm build
      npm run dev2
      ```
5. Navigate to **```frontend```** from root of project by
  ```sh
  cd frontend
  ```
  * Install packages
    ```sh
    npm i
    ```
  * Run local server
    ```sh
    npm build
    npm run dev
    ```

6. Open http://localhost:3000/ and the project will open

