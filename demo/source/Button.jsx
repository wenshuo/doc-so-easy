/**
 * @name button
 * @category react
 * @subcategory components
 * @title button
 * @description
 * This is a button react component.
 *
 * @examples
 *   @title size: small
 *   @type jsx
 *   @description
 *   small size button
 *   @code
 *   <UI.Button size="small" theme="primary">Small</UI.Button>
 *
 * @examples
 *   @title size: medium
 *   @type jsx
 *   @description
 *   Medium size button
 *   @code
 *   <UI.Button size="medium" theme="primary">Medium</UI.Button>
 *
 * @examples
 *   @title size: large
 *   @type jsx
 *   @description
 *   Large size button
 *   @code
 *   <UI.Button size="large" theme="primary">Large</UI.Button>
 *
 * @examples
 *   @title theme: go
 *   @type jsx
 *   @description
 *   Green button
 *   @code
 *   <UI.Button size="large" theme="go">Large</UI.Button>
 *
 * @properties
 *   @title size
 *   @type string
 *   @description
 *   button size
 *
 * @properties
 *   @title theme
 *   @type string
 *   @description
 *   button theme(primary or go)
 */

import React from 'react';
import cx from 'classnames';

export default function Button({ size, theme, children }) {
 const className = cx('btn', `btn_${size}`, { [`btn_${theme}`]: !!theme });
 return (<button className={className}>{children}</button>);
};
