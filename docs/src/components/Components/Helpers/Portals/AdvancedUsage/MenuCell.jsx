import React from 'react';
import PropTypes from 'prop-types';
import AccessibleFakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import DropdownMenu from 'react-md/lib/Menus/DropdownMenu';
import SVGIcon from 'react-md/lib/SVGIcons';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';

import arrowDropDown from 'icons/arrow_drop_down.svg';
import Cell from './Cell';

const anchor = {
  x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
  y: DropdownMenu.VerticalAnchors.CENTER,
};

const MenuCell = ({ id, style, className, children }) => (
  <Cell id={`${id}-cell`} style={style} className={className} header>
    <DropdownMenu
      id={id}
      portal
      fullWidth
      anchor={anchor}
      repositionOnScroll={false}
      fixedTo={document.querySelectorAll('.ReactVirtualized__Grid')[1]}
      menuItems={['Item 1', 'Item 2', 'Item 3', 'Item 4']}
      listClassName="virtualized__cell__list"
    >
      <AccessibleFakeButton component={IconSeparator} label={children}>
        <SVGIcon use={arrowDropDown.url} inherit />
      </AccessibleFakeButton>
    </DropdownMenu>
  </Cell>
);

MenuCell.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MenuCell;
