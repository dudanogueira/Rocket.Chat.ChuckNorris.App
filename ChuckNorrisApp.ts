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
import { ISectionBlock, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { ChuckNorrisCommand } from './slashcommands/ChuckNorrisCommand';
import { SearchContextualBlocks } from './ui/Blocks';
import { settings } from './config/Settings';
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
        configuration.slashCommands.provideSlashCommand(new ChuckNorrisCommand());
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const data = context.getInteractionData();
        const { room } = context.getInteractionData();
        const { actionId } = data;

        switch (actionId) {
            case "ChuckNorrisCategorySelect": {
                try {
                    const ChuckNorrisResponse = await http.get(
                        `https://api.chucknorris.io/jokes/random?category=${data.value}`
                    );

                    const jokeSender = await modify
                        .getCreator()
                        .startMessage()
                        .setText(ChuckNorrisResponse.data["value"])

                    if (room) {
                        jokeSender.setRoom(room);
                    }

                    await modify.getCreator().finish(jokeSender);

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

            case "ChuckNorrisSearchSelect": {

                try {

                    const jokeSender = await modify
                        .getCreator()
                        .startMessage()
                        .setText(`${data.value}`)

                    if (room) {
                        jokeSender.setRoom(room);
                    }
                    await modify.getCreator().finish(jokeSender);
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

            case "ChuckNorrisSearchNew": {
                const data = context.getInteractionData();
                console.log("AQUI! ", data)
                console.log("AQUI! ", context)
            }
        }

        return {
            success: false,
        };
    }


}
