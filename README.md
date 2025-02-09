# banking-app-cqrs-event

Banking app - TypeScript DDD, CQRS, Event Sourcing.

**Note:** This project is a experimental project that leverages the concepts of `CQRS` and `Event Sourcing`. However, the events as written in this project are the results of the `Strategic Design` and this project can be used during the `Tactical Design` phase.

### Business Scenario

The business scenario in this project is a banking application. Let's imagine we are building a platform that allows users to do their banking transactions. So below is the requirement

1. The user can create a bank account
2. The user can disable an existing account
3. The user can deposit money in his account
4. The user can transfer money in his account
5. The user can withdraw money in his account
6. The user can view his account details
7. The user can view all the transactions of his account
8. The user can view a specific transaction detail

### AccountService

Purpose:
Manages account-specific operations such as creating a bank account, disabling an account, and querying account details.

Key Components:
`Domain`:
Contains the bank account aggregate, commands (like createAccount and disableAccount), events (e.g., accountCreated, accountDisabled), and value objects such as account number.
`Application`:
Implements command handlers to process incoming commands and a query handler to fetch account details.
`Infrastructure`:
Uses MongoDB for event storage and read models. Messaging components (commandBus, eventBus) facilitate inter-service communication if needed.
`Interfaces`:
Exposes an Express-based API (via controllers) and manages dependency injection using InversifyJS.

### TransactionService

Purpose:
Manages transaction-related operations including deposits, transfers, withdrawals, disabling an account (if that operation affects transactions), and retrieving transaction histories and details.

Key Components:
`Domain`:
CHouses the transaction aggregate (or aggregates), commands (such as deposit, transfer, withdraw, and even disableAccount if that command needs to trigger transactional side-effects), events (e.g., moneyDeposited, moneyTransferred, moneyWithdrawn), and a value object for money.
`Application`:
Contains command handlers for processing transactions, event handlers that update the read model after transaction events occur, and query handlers for retrieving transaction data.
`Infrastructure`:
Similar to the AccountService, it uses MongoDB for persistence and RabbitMQ for message dispatching.
`Interfaces`:
Offers an API layer for handling client requests and uses an IoC container for wiring up dependencies.

### Foreword from the author

This API project utilizes information from multiple sources to create the fine-tuned API product with the following objectives

1. To build a maintainable enterprise grade application
2. To build the application that follows `SOLID`, and `Clean Architecture` principles as much as possible
3. To build an application that benefits most of the stakeholders in an organization
4. To decouple the read and the write side of the application.
5. To build the CQRS and Event Sourcing system. `CQRS`: Commands (Create, Update, Delete) modify the state, while queries would be used to read the state. `Event Sourcing` : Events are used to track changes to the Organization entity and are persisted in an event store.
6. To build the application that is Event-Driven: The actions (Create, Update, Delete) are triggered by events.
7. To build the application that is based on `Immutability`: Every function returns a new object (i.e., Organization), ensuring immutability.

### Architecture

This project uses DDD with Onion Architecture as illustrated in below images

Below image illustrates the more detailed architecture

![](assets/architecture.png)

In CQRS & Event Sourcing systems, the main idea is to implement different data models for read and write sides of the application.

The workflow is that the write side sends the `commands` to the `command handlers` through `commandBus` to alter the information. The succeeded commands will then generate resulting `events` which are then stored in the `event store`. Finally, the `event handlers` subscribe to events and generate the denormalized data ready for the query. Please note that the events could also be handled by multiple event handlers. Some of them may handle notification tasks.

The only source of truth of Event Sourcing systems is the `event store` while the data in the read store is simply a derivative of the events generated from the write side. This means we can use totally different data structure between the read and the write sides and we can replay the events from the event store from the whenever we want the regenerate the denormalized data in whatever shapes we want.

In this application, we use `MongoDB` as an event store and `MongoDB` as the read store.

The commands are sent by the frontend to the `commandBus` which then selects appropriate `command handlers` for the commands. The command handlers then prepare the `Aggregate Root` and apply the business logic suitable for them. If the commands succee d, they result in events which will then be sent to the `eventBus` to the `event handlers`. In this example, the eventBus is implemented using `RabbitMQ`.

To read more about CQRS and Event Sourcing. Please check [this link](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

In order to demonstrate the use case with inter-service communication. Two separate microservices for job and application is created. So a job microservice manages job (create, update, archive) and application microservice manages the user application.

The pattern in `Event-Driven Architecture` called `Event-Carried State Transfer` is used between job and application microservices. When the job is created, the `JobCreated` event is embedded with the job information as a payload so the application microservice uses this information to replicate the job information for local query. Thus, whenever the application microservice needs the job information, it does not make a direct RPC / REST call to the job microservice at all.

### Technologies

1. Node.js
2. TypeScript
3. MongoDB with MongoDB native driver as an event store
4. InversifyJS as an IoC container
5. Express (via Inversify Express Utils) as an API framework
6. MongoDB with MongoDB as a read store for application microservice
7. RabbitMQ as a message broker / event bus

## Components

This project follows the standard CQRS & Event Sourcing applications available on GitHub. Highly inspired by Greg Young's SimpleCQRS project (written in ASP.NET C#).

Below is the list of components in this project
