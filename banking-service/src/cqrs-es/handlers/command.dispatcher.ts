// src/cqrs-es/command.dispatcher.ts
import { AppCommand } from '@cqrs-es/domain/app.command';
import { ICommandHandler } from '@cqrs-es/handlers/command.handler';

export class CommandDispatcher {
  private useCases = new Map<string, ICommandHandler<AppCommand<any>>>();

  register<T extends AppCommand<any>>(commandType: string, useCase: ICommandHandler<T>): void {
    this.useCases.set(commandType, useCase as ICommandHandler<AppCommand<any>>);
  }

  async dispatch(command: AppCommand<any>): Promise<void> {
    const useCase = this.useCases.get(command.type);
    if (!useCase) {
      throw new Error(`No use case registered for command type: ${command.type}`);
    }
    await useCase.handle(command);
  }
}
