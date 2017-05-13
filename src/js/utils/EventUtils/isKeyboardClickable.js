import { SPACE, ENTER } from '../../constants/keyCodes';

export default function isKeyboardClickable(event, isInForm) {
  const key = event.which || event.keyCode;
  if (typeof isInForm === 'undefined') {
    isInForm = event.target.form;
  }

  if (key === SPACE) {
    event.preventDefault();

    return true;
  }

  return !isInForm && key === ENTER;
}
