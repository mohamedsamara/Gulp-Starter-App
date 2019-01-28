/**
 *
 * actions.js
 * actions configuration
 */

import { bindActionCreators } from 'redux';

import * as todo from './containers/Todo/thunks';

export default function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...todo
    },
    dispatch
  );
}
