/* eslint-disable arrow-body-style */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, MultiGrid } from 'react-virtualized';

import './_styles.scss';
import Cell from './Cell';
import MenuCell from './MenuCell';

export default class AdvancedUsage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  cellRenderer = ({ key, columnIndex, rowIndex, style }) => {
    const Component = rowIndex === 0 ? MenuCell : Cell;
    return (
      <Component
        key={key}
        id={`cel-${rowIndex}-${columnIndex}`}
        style={style}
      >
        {`Cell (${rowIndex} - ${columnIndex})`}
      </Component>
    );
  };

  render() {
    return (
      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <MultiGrid
              cellRenderer={this.cellRenderer}
              height={400}
              width={width}
              columnCount={50}
              columnWidth={120}
              rowCount={120}
              rowHeight={48}
              fixedRowCount={1}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
