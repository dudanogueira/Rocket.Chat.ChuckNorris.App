import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { ChuckNorrisCommand } from './slashcommands/ChuckNorrisCommand';

export class ChuckNorrisApp extends App {
    public appLogger: ILogger
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger()
        
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await this.extendConfiguration(configurationExtend);
        this.appLogger.debug('Hello, World!')
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(new ChuckNorrisCommand()); // [2]
    }
    
}
