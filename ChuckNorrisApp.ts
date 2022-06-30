import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
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

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const data = context.getInteractionData();

        const { actionId } = data;

        switch (actionId) {
            case "ChuckNorrisSelect": {
                try {
                    const  ChuckNorrisResponse  = await http.get(
                        `https://api.chucknorris.io/jokes/random?category=${data.value}`
                    );

                    const { room } = context.getInteractionData();

                    const memeSender = await modify
                        .getCreator()
                        .startMessage()
                        .setText(ChuckNorrisResponse.data["value"])

                    if (room) {
                        memeSender.setRoom(room);
                    }

                    await modify.getCreator().finish(memeSender);

                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
        }

        return {
            success: false,
        };
    }    
}
