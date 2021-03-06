import {ICommandHandler} from '../Commands/ICommandHandler';
import {CommandHandlerFactory} from '../Resources/CommandHandlerFactory';
import {IResource} from '../Resources/IResource';
import {ResourceManager} from '../Resources/ResourceManager';
import {Commands} from '../../Commands';

// https://github.com/CadetEditor/CoreEditor-as/blob/master/coreAppEx/src/core/appEx/managers/CommandManager.as
export class CommandManager {

    private _ResourceManager: ResourceManager;
    private _CommandHandlerFactories: CommandHandlerFactory<ICommandHandler>[] = [];

    constructor(resourceManager: ResourceManager) {
        this._ResourceManager = resourceManager;
        this._ResourceManager.ResourceAdded.on((resource: IResource<any>) => {
            this._OnResourceAdded(resource);
        }, this);
    }

    private _OnResourceAdded(resource: IResource<any>){
        if (CommandHandlerFactory.prototype.isPrototypeOf(resource)){
            this._CommandHandlerFactories.push(<CommandHandlerFactory<ICommandHandler>>resource);
        }
    }

    public ExecuteCommand(command: Commands, parameters?: any): Promise<any> {
        // todo: use metric to determine best CommandHandlerFactory to use.
        var commandHandlerFactories: CommandHandlerFactory<ICommandHandler>[] = this._GetCommandHandlerFactories(command);

        if (!commandHandlerFactories.length) return;

        var commandHandler: ICommandHandler = commandHandlerFactories[0].GetInstance();

        return commandHandler.Execute(parameters);
    }

    private _GetCommandHandlerFactories(command: Commands): CommandHandlerFactory<ICommandHandler>[]{
        return this._CommandHandlerFactories.filter((item:CommandHandlerFactory<ICommandHandler>) => {
            return item.Command == command;
        }, this);
    }
}