import React from 'react';
import S from '@sanity/desk-tool/structure-builder';

export default function SideBar() {
    // S.list will be the Sanity studio sidebar name by default is Content
    return S.list().title(`Slick's Slices`).items([
        // create a new sub item
        S.listItem()
            .title('Home Page')
            .icon(() => <strong>🔥</strong>)
            .child(
                S.editor()
                    .schemaType('storeSettings')
                    // make a new doc id, so we don't have a random string of numbers
                    .documentId('downtown')
            ),
            // add in the rest of our document items
            // but filter out storeSettings from sidebar too
            ...S.documentTypeListItems().filter(item => item.getId() !== 'storeSettings'),
    ])
}