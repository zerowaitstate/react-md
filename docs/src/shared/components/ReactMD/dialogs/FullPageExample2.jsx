/* eslint-disable react/prop-types,react/no-multi-comp */
import React, { PureComponent } from 'react';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import LoremIpsum from 'components/LoremIpsum';

class Test extends PureComponent {
  render() {
    return (
      <Dialog
        id="dialog-2"
        visible
        title="Dialog 2"
        onHide={() => {}}
        actions={<Button label="Close" flat />}
      >
        <LoremIpsum count={1} />
      </Dialog>
    );
  }
}

export default class FullPageExample2 extends PureComponent {
  state = { visible: false, visible2: false };

  close2 = () => {
    this.setState({ visible2: false });
  };
  render() {
    const { visible } = this.state;
    return (
      <div>
        <Button label="Open Full Page Dialog 1" onClick={() => this.setState({ visible: true })} raised primary />
        <Dialog
          id="dialog"
          aria-labelledby="dialog-title"
          visible={visible}
          fullPage
          closeOnEsc={false}
        >
          <Toolbar
            fixed
            colored
            nav={<Button icon onClick={() => this.setState({ visible: false })}>arrow_back</Button>}
            title={<h2 id="dialog-title">Full Page Dialog</h2>}
            actions={<Button flat label="Open Dialog" onClick={() => this.setState({ visible2: true })} />}
          />
          <section className="md-toolbar-relative md-grid">
            <LoremIpsum count={20} className="md-text-container md-cell md-cell--12" />
            <Test />
          </section>
        </Dialog>
      </div>
    );
  }
}
