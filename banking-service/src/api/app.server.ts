// src/server.ts
import express from 'express';
import createRoutes from './app.routes';
import { CommandDispatcher } from '@cqrs-es/handlers/command.dispatcher';
import { QueryDispatcher } from '@cqrs-es/handlers/query.dispatcher';
import { BankAccountRepository } from '@infrastructure/account.repository';
import { InMemoryEventBus } from '@cqrs-es/infrastructure/inmemory.event.bus';
import { BankAccountProjection } from '@projections/account.projection';

// Import command handler implementations
import { OpenAccountHandler } from '@commands/open.account.handler';
import { CloseAccountHandler } from '@commands/close.account.handler';
import { WithdrawFundsHandler } from '@commands/withdraw.funds.handler';
import { TransferFundsHandler } from '@commands/transfer.funds.handler';

// Import query handler implementation
import { GetAllTransactionsQueryHandler } from '@queries/get.alltransactions.handler';

/**
 * Sets up the core infrastructure components (repository, event bus, projection)
 * and subscribes the projection to domain events.
 */
function setupInfrastructure() {
  const repository = new BankAccountRepository();
  const eventBus = new InMemoryEventBus();
  const projection = new BankAccountProjection();

  // Subscribe the projection to domain events.
  const eventTypes = [
    'AccountOpened',
    'AccountClosed',
    'FundsWithdrawn',
    'FundsDeposited',
    'FundsTransferred',
  ];
  eventTypes.forEach((eventType) => {
    eventBus.subscribe(eventType, (event) => projection.handleEvent(event));
  });

  return { repository, eventBus, projection };
}

/**
 * Creates and configures the command and query dispatchers,
 * registering the appropriate handlers for each command and query.
 */
function createDispatchers() {
  const { repository, eventBus, projection } = setupInfrastructure();

  const commandDispatcher = new CommandDispatcher();
  const queryDispatcher = new QueryDispatcher();

  // Register command handlers with the dispatcher.
  commandDispatcher.register('OpenAccountCommand', new OpenAccountHandler(repository, eventBus));
  commandDispatcher.register('CloseAccountCommand', new CloseAccountHandler(repository, eventBus));
  commandDispatcher.register('WithdrawFundsCommand', new WithdrawFundsHandler(repository, eventBus));
  commandDispatcher.register('TransferFundsCommand', new TransferFundsHandler(repository, eventBus));

  // Register query handler(s) with the query dispatcher.
  queryDispatcher.register('GetAllTransactionsQuery', new GetAllTransactionsQueryHandler(projection));

  return { commandDispatcher, queryDispatcher };
}

const { commandDispatcher, queryDispatcher } = createDispatchers();

// Create and configure the Express application.
const app = express();
app.use(express.json());
app.use('/', createRoutes(commandDispatcher, queryDispatcher));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
