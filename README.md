# Alanode Express Boiler
An extensive boilerplate for NodeJS and Express, with Prisma ORM. Offering Authentication, Authorization, Validation, Error Handling, Logging, and Environmental Configuration.


# Node.js, Express, and Prisma Boilerplate

This is a boilerplate project for Node.js, Express, and Prisma, designed to help you quickly get up and running with building modern web applications.  
I wanted to share my knowledge and expertise by open sourcing parts of a project that I have been working on. 

NodeJS + Express doesn't give you a whole lot go on as a framework. I therefore came up with some extensive boilerplate that I personally use when 
working on a new project.

This boilerplate provides a solid foundation for building scalable and maintainable backend applications using
technologies such as Node.js, Express, and Prisma.

## Features

- **Express Server**: 
The boilerplate includes a pre-configured Express server with a modular folder structure that makes it easy to add new routes and middleware for handling various HTTP requests.

- **Prisma ORM**: 
Prisma is a powerful Object-Relational Mapping (ORM) tool that allows you to interact with your database using a type-safe and intuitive query language. This boilerplate includes Prisma setup with pre-configured models, migrations, and seed data for quickly setting up your database.

- **Authentication and Authorization**: 
The boilerplate includes a basic authentication and authorization system using Passport.js and JWT for securing routes and protecting resources. It provides a simple and extensible authentication flow for registering users, logging in, and authenticating API requests.

- **Error Handling**: 
The boilerplate includes error handling middleware to gracefully handle errors and provide meaningful error responses to clients. It also includes custom error classes for different types of errors, making it easy to extend and customize error handling logic.

- **Validation and Sanitization**: 
The boilerplate includes validation which helps in validating and sanitizing incoming request data, ensuring that only valid data is processed by the application.

- **Environmental Configuration**: 
The boilerplate includes a configuration setup that allows you to define and manage different configurations for different environments (such as development, production, and testing) using environment variables. This makes it easy to manage sensitive data like API keys and database credentials across different environments.

- **Logging**:
The boilerplate includes logging middleware using popular libraries like Morgan and Winston, which helps in logging HTTP requests and other application events for debugging and monitoring purposes.

- **Docker**: 
I've added Dockerfile to run the application on a server. I will be creating a document that explains how to set up Dokku in a nice way so you can make sure your code is running correctly and utilizes roling releases (ie., zero downtime).

## Getting Started

To use this boilerplate for your new project, follow these steps:

**1. Clone the repository to your local machine.**

~~~
git clone https://github.com/icyrizard/alanode-boiler.git
~~~

**2. Initialize the database for local development.**

> Make sure you have docker installed, and have `make` on your machine, or run the commands from the makefile

~~~
make dbup
~~~

> This creates a new database using the following as username and password:
> ~~~
> POSTGRES_DB: alanode
> POSTGRES_USER: alanode
> POSTGRES_PASSWORD: alanode
> ~~~

**3. Run the install and migration creation.**

This will install the packages from the package.json, init prisma, create a migrations (but doesn't migrate yet!).

~~~
npm run init
~~~

4. Run the migrations.

~~~
npm run migrate:dev
~~~

5. Run the project.

~~~
npm run dev
~~~

6. Customize the boilerplate to fit your project requirements. You can add new routes, middleware, models, and services as needed.

## Testing
Make sure to up the database and add a database called 'test'. We just assume this table is there to make it easier to run the tests
and keep it in sync amongst the developers.

~~~
$ make dbup
$ make test-watch
~~~

## Contributing

I welcome contributions to this boilerplate project! If you have any suggestions, bug reports, or improvements, feel free to open an issue or submit a pull request. Let's collaborate and make this boilerplate even better together!

## License

This boilerplate is open source and available under the [MIT License](LICENSE).

## Acknowledgements

I would like to express my gratitude to the open source community and the creators of Node.js, Express and other libraries



