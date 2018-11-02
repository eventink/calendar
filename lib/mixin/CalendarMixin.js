'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _index = require('../util/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function getNow() {
  return (0, _moment2['default'])();
}

function getNowByCurrentStateValue(displayedValue, multiple) {
  var ret = void 0;
  if (displayedValue) {
    ret = (0, _index.getTodayTime)(displayedValue);
  } else {
    ret = getNow();
  }
  return multiple ? [ret] : ret;
}

var CalendarMixin = {
  propTypes: {
    value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    defaultValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    onKeyDown: _propTypes2['default'].func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onKeyDown: noop
    };
  },
  getInitialState: function getInitialState() {
    var props = this.props;
    var value = props.value || props.defaultValue || (props.multiple ? [getNow()] : getNow());
    var displayedValue = void 0;

    if (props.multiple) {
      displayedValue = value[0];
    } else {
      displayedValue = value;
    }

    return {
      value: value,
      selectedValue: props.selectedValue || props.defaultSelectedValue,
      displayedValue: displayedValue
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var value = nextProps.value;
    var selectedValue = nextProps.selectedValue;

    if ('value' in nextProps) {
      value = value || nextProps.defaultValue || getNowByCurrentStateValue(this.state.displayedValue, this.props.multiple);
      this.setState({
        value: value
      });
    }
    if ('selectedValue' in nextProps) {
      this.setState({
        selectedValue: selectedValue
      });
    }
  },
  onSelect: function onSelect(value, cause) {
    var newValue = value;
    if (value) {
      if (this.props.multiple) {
        newValue = this.updateMultiSelectValue(value);
      } else {
        this.setValue(value);
      }

      this.setDisplayedValue(value);
    }
    this.setSelectedValue(newValue, cause);
  },
  renderRoot: function renderRoot(newProps) {
    var _className;

    var props = this.props;
    var prefixCls = props.prefixCls;

    var className = (_className = {}, _className[prefixCls] = 1, _className[prefixCls + '-hidden'] = !props.visible, _className[props.className] = !!props.className, _className[newProps.className] = !!newProps.className, _className);

    return _react2['default'].createElement(
      'div',
      {
        ref: this.saveRoot,
        className: '' + (0, _classnames2['default'])(className),
        style: this.props.style,
        tabIndex: '0',
        onKeyDown: this.onKeyDown
      },
      newProps.children
    );
  },
  setSelectedValue: function setSelectedValue(selectedValue, cause) {
    // if (this.isAllowedDate(selectedValue)) {
    if (!('selectedValue' in this.props)) {
      this.setState({
        selectedValue: selectedValue
      });
    }
    this.props.onSelect(selectedValue, cause);
    // }
  },
  setValue: function setValue(value) {
    var originalValue = this.state.value;
    if (!('value' in this.props)) {
      this.setState({
        value: value
      });
    }
    if (originalValue && value && !originalValue.isSame(value) || !originalValue && value || originalValue && !value) {
      this.props.onChange(value);
    }
  },
  setDisplayedValue: function setDisplayedValue(value) {
    this.setState({
      displayedValue: value
    });
  },
  sortValues: function sortValues(values) {
    if (values && values.length) {
      values.sort(function (a, b) {
        return a - b;
      });
    }
  },
  updateMultiSelectValue: function updateMultiSelectValue(value) {
    var originalValue = this.state.selectedValue || [];
    var newValue = originalValue.slice(0);
    var foundIndex = void 0;

    originalValue.forEach(function (singleValue, index) {
      if (singleValue.isSame(value, 'day')) {
        foundIndex = index;
      }
    });

    if (foundIndex !== undefined) {
      newValue.splice(foundIndex, 1);
    } else {
      newValue.push(value);
    }

    if (newValue.length) {
      this.sortValues(newValue);
    } else {
      newValue = null;
    }

    this.props.onChange(newValue);
    return newValue;
  },
  addOrRemoveMultipleValues: function addOrRemoveMultipleValues(values) {
    var originalValue = this.state.selectedValue || [];
    var newValue = originalValue.slice(0);

    if (values.add) {
      var originalDayStrings = originalValue.map(function (day) {
        return day.format('YYYYMMDD');
      });

      values.add.forEach(function (day) {
        var dayString = day.format('YYYYMMDD');
        if (!originalDayStrings.includes(dayString)) {
          newValue.push(day);
        }
      });
    }

    if (values.remove) {
      var removeDaysStrings = values.remove.map(function (day) {
        return day.format('YYYYMMDD');
      });

      newValue = newValue.filter(function (day) {
        return !removeDaysStrings.includes(day.format('YYYYMMDD'));
      });
    }

    if (newValue.length) {
      this.sortValues(newValue);
    } else {
      newValue = null;
    }

    this.props.onChange(newValue);
    return newValue;
  },
  isAllowedDate: function isAllowedDate(value, multiple) {
    var disabledDate = this.props.disabledDate;
    var disabledTime = this.props.disabledTime;

    if (multiple && value && value.length) {
      value.forEach(function (singleValue) {
        if (!(0, _index.isAllowedDate)(singleValue, disabledDate, disabledTime)) {
          return false;
        }
      });

      return true;
    }

    return (0, _index.isAllowedDate)(value, disabledDate, disabledTime);
  }
};

exports['default'] = CalendarMixin;
module.exports = exports['default'];