# intent_detection
Service that classifies user messages, manages conversation flows and maintains context. The service handle general interactions, FAQ requests, and responses to suicide risk.

## Scripts
This section provides an overview of the available commands for running, testing, and maintaining the application using the Makefile and npm scripts.

#### make scrips
The Makefile simplifies interactions with Docker and some utility tasks.

```sh

# Build and run the application using Docker Compose
make run-dev

# Stop Docker Compose services and remove associated volumes
make stop-dev

# View live application logs from Docker Compose
make application-logs

# Run lint checks on the codebase using ESLint
make lint

# Automatically fix linting issues
make lint-fix

# Format the code using Prettier
make format

# Run the test suite once
make test

# Run tests in watch mode for active development
make test-wa

```

#### npm scrips
The `package.json` contains various npm scripts for running the application, testing, linting, and formatting. To use these scripts, you need to run npm install first to install the dependencies.


```sh
# Install project dependencies
npm install

# Start the development server using nodemon
npm run dev

# Build the application for production (TypeScript compilation)
npm run build

# Run the test suite once with Jest
npm run test

# Run Jest in watch mode (automatically rerun tests when files change)
npm run test:wa

# Lint the codebase using ESLint
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format the codebase using Prettier
npm run format

```


## Authentication
This project uses [JWT](https://jwt.io/) (JSON Web Tokens) for authentication. To successfully authenticate, your JWT token must include the following payload:

```json
{
  "uid": 123
}
```
The uid field is mandatory and should represent the unique identifier for the authenticated user.

When making requests to the API, include the JWT token in the Authorization header as follows:

```sh
Authorization: <your-jwt-token>
```

Ensure that your JWT is signed with the correct secret key and included in the request headers to access protected routes.

* jwt secret key is equal to `very_secret_key` and you can modify it in `docker-compose.yaml` for application and `.env.test` file for test cases


## Api Documents

please load api documentation to your Postman app `./docs/intent-detection.postman_collection.json`

## More Details
each service layer has specific directory

- Routes (src/routes/):

    The routing layer defines the API endpoints and connects them with the corresponding controller functions. This keeps route definitions separate from business logic.

- Controllers (src/controllers/):

    The controllers contain the logic for handling requests and responses, interacting with services and models, and defining the application's flow based on user interactions.

- Middlewares (src/middlewares/):

    This directory contains middleware functions that run before the controller logic is executed. For example, userAuthMiddleware ensures the user is authenticated before accessing certain routes.

- Configs (src/configs/):

    Configurations such as database connections, environment setup, and other system-wide settings live in this folder. For example, redisConfig manages Redis interactions.

- Service Layer (src/services/):

    The service layer contains specific business logic that works independently of controllers. Each service has its own dedicated directory, focusing on specific parts of the application (e.g., IntentService, UserService, etc.). The services handle the heavy lifting of processing data and communicating with external resources (like databases or APIs).

- Utils (src/utils/):

    Utility functions and helper methods, like validators or common functions shared across the application, are organized here.

## Key Concepts

- Separation of Concerns: 
    Each layer of the application handles its own specific responsibility, ensuring better maintainability and scalability.

- Service-Oriented Architecture: 
    The service layer is dedicated to handling reusable logic, allowing the controllers to remain lightweight and focused on orchestrating application flow.


## src/services/intent.ts
The main logic revolves around detecting user intent from a message, then generating an appropriate response based on the current flow. It uses an NLP library (compromise) to process the input text, detect keywords, and map them to predefined responses. The IntentHandler manages the flow and intent detection, while helper classes (like handleFAQ, handleSuicideRisk, etc.) provide specific responses based on the detected intent.

