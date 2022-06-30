import { BlockElementType, IButtonElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import {
    IModify,
} from '@rocket.chat/apps-engine/definition/accessors';

export function SearchContextualBlocks(modify: IModify, viewId?: string,): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    blocks.addActionsBlock({
        elements: [{
            type: BlockElementType.BUTTON,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: 'Search',
            },
            actionId: 'search',
        } as IButtonElement,
        ],
    });
    return { // [6]
        id: viewId || 'searchbar',
        title: blocks.newPlainTextObject('Searching for Jokes'),
        submit: blocks.newButtonElement({
            text: blocks.newPlainTextObject('Submit'),
        }),
        blocks: blocks.getBlocks(),
    };
}    