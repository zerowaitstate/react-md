import React from 'react';

import { DatePicker, TextField, SelectField, Button, SelectionControlGroup, SelectionControl } from 'react-md';

import OrientationExamples from './OrientationExamples';
import OrientationExamplesRaw from '!!raw!./OrientationExamples';

import InlineExamples from './InlineExamples';
import InlineExamplesRaw from '!!raw!./InlineExamples';

import LocaleExamples from './LocaleExamples';
import LocaleExamplesRaw from '!!raw!./LocaleExamples';

import MinMaxExamples from './MinMaxExamples';
import MinMaxExamplesRaw from '!!raw!./MinMaxExamples';

import ControlledExample from './ControlledExample';
import ControlledExampleRaw from '!!raw!./ControlledExample';

import FullyControlledExample from './FullyControlledExample';
import FullyControlledExampleRaw from '!!raw!./FullyControlledExample';

const items = ['', 'Woop', 'Shoop'];

const Test = () => (
  <form id="something" onSubmit={(e) => e.preventDefault()} className="md-grid">
    <DatePicker id="form-pcker-1" label="Something" className="md-cell md-cell--12" />
    <TextField id="some-text-field" label="Text Here" className="md-cell md-cell--12" />
    <SelectField id="some-select-field" label="Wooop" menuItems={items} className="md-cell md-cell--12" position={SelectField.Positions.BELOW} />
    <input type="radio" value="a" name="radio" />
    <input type="radio" value="b" name="radio" />
    <input type="radio" value="c" name="radio" />
    <input type="checkbox" value="woop" id="checkbox" name="checkbox" />
    <select id="some-navtive-select" name="native-select">
      <option value="" />
      <option value="something">Something</option>
    </select>
    <SelectionControlGroup id="control-radios" name="control-radios" type="radio" controls={[{ label: '', value: '' }, { label: 'What', value: 'a' }, { label: 'Who', value: 'b' }]} />
    <SelectionControl id="somme-checkbox" name="some-checkbox" type="checkbox" value="fjkds" />
    <Button id="reset" type="reset" label="Reset" secondary flat />
    <Button id="submit-btn" type="submit" label="Submit" primary flat />
  </form>
);

export default [{
  title: 'Wop',
  code: '',
  children: <Test />,
}, {
  title: 'Orientation Examples',
  description: `
Date pickers will attempt to follow the correct display mode of the current
screen size through the media queries. You can also force a display mode if
you want.

> Forcing a display mode is not enabled by default since it is recommended to
always allow the orientation to determine the display mode. However it can be
enabled by setting \`$md-picker-include-forceful-classes: true\`.
`,
  code: OrientationExamplesRaw,
  children: <OrientationExamples />,
}, {
  title: 'Inline and Custom Format Examples',
  description: 'A Date Picker can also appear inline or use custom format options.',
  code: InlineExamplesRaw,
  children: <InlineExamples />,
}, {
  title: 'Different Locales Examples',
  description: `
Date pickers will also use the browser's locale by default to format the time.
You can also manually force a locale.
`,
  code: LocaleExamplesRaw,
  children: <LocaleExamples />,
}, {
  title: 'Min/Max Dates and AutoOk Examples',
  description: `
A date picker can have min and/or max dates as well as automatically close
on date pick. The user will be unable to select a date before the min date
or after the max date.
`,
  code: MinMaxExamplesRaw,
  children: <MinMaxExamples />,
}, {
  title: 'Controlled Example',
  description: `
A date picker can be controlled as well. The \`onChange\` function will only
be triggered when the user hits the OK button.
  `,
  code: ControlledExampleRaw,
  children: <ControlledExample />,
}, {
  title: 'Fully Controlled Example',
  description: `
The date picker can be controlled by it's visiblity and value props, but I don't see too many
use cases for this. It's there though!
  `,
  code: FullyControlledExampleRaw,
  children: <FullyControlledExample />,
}];

