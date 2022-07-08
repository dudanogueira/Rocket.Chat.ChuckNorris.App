import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { SearchContextualBlocks } from '../ui/Blocks';
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";
import { shuffle } from "utils";

export class ChuckNorrisCommand implements ISlashCommand {
    public command = 'chucknorris'; // [1]
    public i18nParamsExample = 'ChuckNorris_Params';
    public i18nDescription = 'ChuckNorris_Description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        // get trigger id and user
        const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender()
        const room = context.getRoom()
        const block = modify.getCreator().getBlockBuilder();
        // get the subcommand and the params
        const [subcommand, ...params] = context.getArguments();
        // no subcommand, send a random joke
        if (!subcommand) {
            const response = await http.get(
                "https://api.chucknorris.io/jokes/random"
            )
            const message = response.data["value"];
            const ReturnJoke = modify
                .getCreator()
                .startMessage()
                .setRoom(room)
                .setText(message);
            //await this.sendMessage(context, modify, message);
            await modify.getCreator().finish(ReturnJoke);
            // we have a subcommand!
        } else {
            switch (subcommand) {
                case 'categories':
                    const builder = await modify.getCreator().startMessage().setRoom(room);
                    block.addSectionBlock({
                        text: block.newPlainTextObject("Choose a category below 👇 "),
                    });
                    // get categories
                    const categories = await http.get(
                        "https://api.chucknorris.io/jokes/categories"
                    )

                    const elements: any[] = [];
                    categories.data.forEach(element => {
                        elements.push(
                            block.newButtonElement({
                                actionId: "ChuckNorrisCategorySelect",
                                text: block.newPlainTextObject(element),
                                value: element,
                                style: ButtonStyle.PRIMARY,
                            })
                        )
                    });
                    shuffle(elements);
                    block.addActionsBlock({
                        blockId: "subreddits",
                        elements: elements
                    });

                    builder.setBlocks(block);
                    // Notifier not applicable to LiveChat Rooms
                    if (room.type !== "l") {
                        await modify
                            .getNotifier()
                            .notifyUser(user, builder.getMessage());
                    } else {
                        await modify.getCreator().finish(builder);
                    }
                    break;

                case 'search':
                    var term = '';
                    var result = null;
                    if (params.length) {
                        const term = params.join(" ");
                        // initiate contextual bar

                        const result = await http.get(
                            "https://api.chucknorris.io/jokes/search?query=" + term
                        )
                        // if (response.data.result.length > 0) {
                        //     // get random
                        //     // TODO: add modal to select joke
                        //     const message = response.data.result[Math.floor(Math.random() * response.data.result.length)]["value"];
                        //     await this.sendMessage(context, modify, message); // [3]    
                        // } else {
                        //     await this.sendMessage(context, modify, `No Jokes found for term ${term} :(`); // [3]
                        // }
                        var contextualbarBlocks = SearchContextualBlocks(modify, term, result);
                        await modify.getUiController().openContextualBarView(contextualbarBlocks, { triggerId }, user);
                    } else {
                        //var contextualbarBlocks = SearchContextualBlocks(modify, term);
                        // no search term, warn user
                        block.addSectionBlock({
                            text: block.newMarkdownTextObject("No term to search. try: `/chucknorris search Rocket`"),
                        })
                        const builder = await modify.getCreator().startMessage().setRoom(room);
                        builder.setBlocks(block);
                        await modify
                            .getNotifier()
                            .notifyUser(user, builder.getMessage());
                    }
                    break;

                default: // [7]
                    throw new Error('Error!');
            }
        }

    }
    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();

        messageStructure
            .setSender(sender)
            .setRoom(room)
            .setText(message);

        await modify.getCreator().finish(messageStructure);
    }
}