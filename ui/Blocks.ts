import { BlockElementType, ButtonStyle, IButtonElement, IPlainTextInputElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import {
    IHttpResponse,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { AppSetting } from '../config/Settings';

export function SearchContextualBlocks(modify: IModify, term: string, result?: IHttpResponse, removeExplicitJokes?:boolean): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    // blocks.addInputBlock({
    //     blockId: "searchInput",
    //     label: { text: "Chuck Search", type: TextObjectType.PLAINTEXT },
    //     element: blocks.newPlainTextInputElement({
    //         actionId: "searchInput",
    //         placeholder: { text: '', type: TextObjectType.PLAINTEXT },
    //         initialValue: term,
    //     }),
        
    // });

    // blocks.addActionsBlock({
    //     blockId: "search",
    //     elements: [
    //         blocks.newButtonElement({
    //             actionId: "ChuckNorrisSearchNew",
    //             text: blocks.newPlainTextObject("search"),
    //             value: "search",
    //             style: ButtonStyle.PRIMARY,
    //         }),
    //     ],
    // });


    // blocks.addSectionBlock({
    //     text: blocks.newMarkdownTextObject(``), // [4]
    //     accessory: { // [5]
    //         type: BlockElementType.BUTTON,
    //         actionId: 'ChuckNorrisSearchNew',
    //         text: blocks.newPlainTextObject('Search'),
    //         value: 'search block',
    //     },
    // });
    
    if(removeExplicitJokes){
        var jokes = result?.data.result.filter(j => !j.categories.includes("explicit"))
    }else{
        var jokes = result?.data.result;
    }


    if (jokes.length == 0) {
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(`No Joke found. Try a new search`),
        })
    } else {
        if (term){
            var showing_message = `Showing *${jokes.length }* jokes for term _${term}_`
        }else{
            var showing_message = 'Search for a term'
        }
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(showing_message),
        })
        blocks.addDividerBlock();
    }

    jokes.forEach(element => {

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
        // submit: blocks.newButtonElement({
        //     text: {
        //         type: TextObjectType.PLAINTEXT,
        //         text: 'Search'
        //     }
        // }),
		close: blocks.newButtonElement({
			text: {
				type: TextObjectType.PLAINTEXT,
				text: 'Dismiss',
			},
		}),
        blocks: blocks.getBlocks(),
    };
}    