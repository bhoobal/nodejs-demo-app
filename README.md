## Retrieve Users API

You can retrieve all saved user details using the GET /users endpoint.

### How to test the GET /users endpoint

Use curl or your browser:

```sh
curl http://localhost:3000/users
```

This will return a JSON array of all users stored in `users.json`.
# nodejs-demo-app
A demo Node.js application

## Add User API

This app provides a POST endpoint to add user details (name, dob, sex) and save them to a JSON file.

### How to test the POST /users endpoint

1. Start the app:
	 - Locally: `node index.js`
	 - Or using Docker (with data persistence):

```sh
docker run -it -p 3000:3000 -v $(pwd)/data:/usr/src/app/data nodejsdemo:1.1
```

This will mount your local `data` folder to the container, so changes to `users.json` are persistent.

2. Use curl or Postman to send a POST request:

```sh
curl -X POST http://localhost:3000/users \
	-H "Content-Type: application/json" \
	-d '{"name":"John Doe","dob":"1990-01-01","sex":"M"}'
```

If successful, you will receive a confirmation message and the user will be saved in `data/users.json`.