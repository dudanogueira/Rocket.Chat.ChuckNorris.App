import { BlockElementType, IButtonElement, IPlainTextInputElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import {
    IHttpResponse,
    IModify,
} from '@rocket.chat/apps-engine/definition/accessors';

export function SearchContextualBlocks(modify: IModify, term: string, result: IHttpResponse): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    // blocks.addActionsBlock({
    //     elements: [
    //         {
    //             type: BlockElementType.PLAIN_TEXT_INPUT,
    //             initialValue: term,
    //         } as IPlainTextInputElement,
    //         {
    //             type: BlockElementType.BUTTON,
    //             text: {
    //                 type: TextObjectType.PLAINTEXT,
    //                 text: 'Search',
    //             },
    //             actionId: 'search',
    //         } as IButtonElement

    //     ],
    // });

    blocks.addInputBlock({
        blockId: "searchInput",
        label: { text: "Chuck Search", type: TextObjectType.PLAINTEXT },
        element: blocks.newPlainTextInputElement({
            actionId: "searchInput",
            placeholder: { text: '', type: TextObjectType.PLAINTEXT },
            initialValue: term,
        }),
    });
    

    if (result.data.total == 0) {
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(`No Joke found. Try a new search`),
        })
    } else {
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(`Showing *${result.data.total}* jokes for term _${term}_`),
        })
        blocks.addDividerBlock();
    }

    result.data.result.forEach(element => {

        blocks.addSectionBlock({
            text: blocks.newPlainTextObject(element["value"]),
            accessory: { // [5]
                type: BlockElementType.BUTTON,
                actionId: 'ChuckNorrisSearchSelect',
                text: blocks.newPlainTextObject('Select'),
                value: element["value"],
            },
        });
        blocks.addDividerBlock();
    });


    return { // [6]
        id: term || 'searchbar',
        title: blocks.newPlainTextObject('Searching for Jokes'),
        submit: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: 'Search'
            }
        }),
		close: blocks.newButtonElement({
			text: {
				type: TextObjectType.PLAINTEXT,
				text: 'Dismiss',
			},
		}),
        blocks: blocks.getBlocks(),
    };
}    