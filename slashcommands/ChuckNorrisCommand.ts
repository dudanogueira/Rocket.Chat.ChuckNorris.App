import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class ChuckNorrisCommand implements ISlashCommand {
    public command = 'chucknorris'; // [1]
    public i18nParamsExample = '';
    public i18nDescription = 'Get a Chuck Norris joke';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand] = context.getArguments(); // [2]

        const response = await http.get(
            "https://api.chucknorris.io/jokes/random"   
        )
        const message = response.data["value"];
        await this.sendMessage(context, modify, message); // [3]
    }

    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender(); // [1]
        const room = context.getRoom(); // [2]

        messageStructure
        .setSender(sender)
        .setRoom(room)
        .setText(message); // [3]

        await modify.getCreator().finish(messageStructure); // [4]
    }
}