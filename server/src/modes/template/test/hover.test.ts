/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { parseHTMLDocument } from "../parser/htmlParser";
import { doHover } from "../services/htmlHover";
import { hoverDSL } from "../../test-util/hover-test-util";
import { allTagProviders } from "../tagProviders";

const html = hoverDSL({
  docUri: "test://test/test.html",
  langId: "vue-html",
  doHover(document, position) {
    const htmlAST = parseHTMLDocument(document);
    return doHover(document, position, htmlAST, allTagProviders);
  }
});

suite("HTML Hover", () => {
  test("Attribute", function() {
    // prettier-ignore
    html`<div a|ria-atomic="true"></div>`
      .hasNothing();
    // prettier-ignore
    html`<component inli|ne-template></component>`
      .hasHoverAt('treat inner content as its template rather than distributed content', 11);
    // prettier-ignore
    html`<div :v|-if="true"></div>`
      .hasHoverAt('Conditionally renders the element based on the truthy\\-ness of the expression value\\.', 5);
  });
});
