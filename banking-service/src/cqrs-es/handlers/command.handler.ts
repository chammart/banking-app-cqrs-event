// src/domain/handlers/command.handler.ts
import { AppCommand } from '@cqrs-es/domain/app.command';

export interface ICommandHandler<T extends AppCommand<any>> {
  handle(command: T): void;
}
