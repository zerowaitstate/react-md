import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const border = 'md-divider-border';
const Cell = ({ id, style, className, children, header }) => (
  <div
    id={id}
    style={style}
    className={cn('virtualized__cell', {
      'virtualized__cell--header': header,
    }, `${border} ${border}--bottom ${border}--right`, className)}
  >
    {children}
  </div>
);

Cell.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  header: PropTypes.bool,
};

export default Cell;
