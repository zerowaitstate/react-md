import * as React from 'react';
import { Props } from '../index';

export interface SharedPortalProps {
  renderNode?: Object;
  lastChild?: boolean;
  transitionName?: string;
  transitionEnterTimeout?: number;
  transitionLeaveTimeout?: number;
}

export interface PortalProps extends Props, SharedPortalProps {
  visible: boolean;
  children?: React.ReactElement<any>;
  component?: string;
  onOpen?: Function;
  onClose?: Function;
}

declare const Portal: React.ComponentClass<PortalProps>;
export default Portal;
