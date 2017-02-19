/* eslint-disable no-console */
/* eslint max-len: ['error', 140] */
import fs from 'fs';
import path from 'path';
import react2dts from 'react-to-typescript-definitions';
import Bluebird from 'bluebird';

const readFile = Bluebird.promisify(fs.readFile);

import findExportedComponents from './findExportedComponents';

const fixes = {
  general: parsed => {
    // Fix style props
    parsed = parsed.replace(/(.*style\?: )Object/ig, '$1React.CSSProperties');

    // Fix mouse events
    parsed = parsed.replace(
      /(on((Click|Mouse(Down|Up|Enter|Move|Leave|Out|Over)))\?: ).*(?=;)/g,
      '$1React.MouseEventHandler<any>'
    );

    // Fix touch events
    parsed = parsed.replace(/(onTouch(Cancel|End|Move|Start)).*(?=;)/g, '$1React.TouchEventHandler<any>');

    // Fix keyboard events
    parsed = parsed.replace(/(onKey(Down|Up|Press)\?: ).*(?=;)/g, '$1React.KeyboardEventHandler<any>');

    // Fix focus events
    parsed = parsed.replace(/(on(Focus|Blur)\?: ).*(?=;)/g, '$1React.FormEventHandler<any>');

    // Fix ids
    parsed = parsed.replace(/(.*id)\?: any/ig, '$1: number | string');

    // Strip depreacted/uncommented
    parsed = parsed.replace(/(;\r?\n)(\s+[a-z].+(;\r?\n))+(\s+})/g, '$1$4');

    return parsed;
  },
  inputs: parsed => {
    parsed = parsed.replace(
      /(onChange\?: ).*(?=;)/g,
      '$1(value: number | string, e: React.FormEventHandler<React.ReactHTMLElement<HTMLInputElement>) => void'
    );

    return parsed;
  },
  Autocomplete: parsed => {
    parsed = fixes.inputs(parsed);
    // Fix custom prop-type for total
    parsed = parsed.replace(/(total\?: )any/, '$1number');

    // More accurate filter definition
    parsed = parsed.replace(
      /(filter\?: )\(\.\.\.args: any\[\]\)=>any/,
      '$1(haystack: any[], needle: string | number, dataLabel: string) => any[]'
    );

    // More accurate findInlineSuggestion definition
    parsed = parsed.replace(
      /(findInlineSuggestion\?: )\(\.\.\.args: any\[\]\)=>any/,
      '$1(haystack: any[], needle: string | number, dataLabel: string) => string | number'
    );

    // More accurate onAutocomplete
    parsed = parsed.replace(
      /(onAutocomplete).*(?=;)/,
      '$1(value: number | string, suggestionIndex: number, matches: any[]) => void'
    );

    parsed = parsed.replace(/(onMenu(Open|Close)\?: ).*(?=;)/g, '$1() => void');

    return parsed;
  },
  Avatar: parsed => parsed.replace('role?: any', 'role?: \'presentation\''),
  BottomNavigation: parsed => {
    parsed = parsed.replace('links?: any', 'links: Object[]');

    parsed = parsed.replace(
      /(onNavChange\?: ).*(?=;)/,
      '$1(activeIndex: number, e: React.MouseEventHandler<any>) => void'
    );

    parsed = parsed.replace('activeIndex?: any', 'activeIndex?: number');

    parsed = parsed.replace(/(onVisibilityChange\?: ).*(?=;)/, '$1(visible: boolean) => void');

    return parsed;
  },
  Button: parsed => {
    parsed = parsed.replace('label?: any', 'label?: string');
    parsed = parsed.replace('children?: any', 'children?: React.ReactNode');
    parsed = parsed.replace('type?: any', 'type?: \'button\' |\'submit\' | \'reset\' ');
    parsed = parsed.replace(/((fixed|mini)\?: )any/, '$1boolean');
    return parsed;
  },
  Card: parsed => {
    parsed = parsed.replace('expanded?: any', 'expanded? boolean');
    parsed = parsed.replace(
      /(onExpanderClick\?: ).*(?=;)/,
      '$1(expanded: boolean, e: React.MouseEventHandler<any>) => void'
    );

    return parsed;
  },
  DataTable: parsed => {
    parsed = parsed.replace('Id:', 'Id?:');
    parsed = parsed.replace(
      /(onRowToggle\?: )any/,
      '$1(rowIndex: number, checked: boolean, checkedRows: boolean) => void'
    );
    return parsed;
  },
  TableRow: parsed => {
    parsed = parsed.replace(
      /(onCheckboxClick\?: ).*(?=;)/,
      '$1(rowIndex: number, checked: boolean, e: React.FormEventHandler<HTMLInputElement>) => void'
    );
    return parsed;
  },
  EditDialogColumn: parsed => {
    parsed = fixes.inputs(parsed);
    parsed = parsed.replace('title?: any', 'title?: string');
    parsed = parsed.replace(/(on(Ok|Cancel)Click\?: ).*(?=;)/g, (_, match, type) => {
      const e = 'e: React.FormEventHandler<HTMLInputElement> | React.MouseEventHandler<HTMLButtonElement>';
      return `${match}: (${type === 'Ok' ? 'v' : 'oldV'}alue: number | string, ${e}) => void`;
    });
    parsed = parsed.replace(/(onOutsideClick\?: ).*(?=;)/, '$1(e: React.MouseEventHandler<any>)');

    return parsed;
  },
  TablePagination: parsed => {
    parsed = parsed.replace(/(onPagination\?: ).*(?=;)/, '$1(newStart: number, rowsPerPage: number, nextPage: number) => void');

    return parsed;
  },
  SelectFieldColumn: parsed => {
    parsed = parsed.replace(/(onMenuToggle\?: ).*(?=;)/, '$1(open: boolean, e: React.MouseEventHandler<any>) => void');

    return parsed;
  },
};

(async () => {
  const i = 8;
  const components = (await findExportedComponents()).slice(i, i + 1);

  components.forEach(({ exports, fullPath }) => {
    exports.forEach(async (component, ind) => {
      const cPath = path.join(fullPath, `${component}.js`);
      let parsed = '';
      if (component.match(/(Button|TableColumn)/)) {
        const code = (await readFile(cPath, 'utf-8'))
          .replace(/export.*/, '')
          .replace(/(class (Button|TableColumn))/, 'export default $1');
        parsed = react2dts.generateFromSource(component, code);
      } else {
        parsed = react2dts.generateFromFile(component, cPath);
      }
      parsed = fixes.general(parsed);
      if (fixes[component]) {
        parsed = fixes[component](parsed);
      }

      if (true) {
        console.log('parsed:', parsed);
      }
    });
  });
})();
