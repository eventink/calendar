'use strict';

exports.__esModule = true;
exports.calendarMixinWrapper = exports.calendarMixinDefaultProps = exports.calendarMixinPropTypes = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.getNowByCurrentStateValue = getNowByCurrentStateValue;

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

function getNowByCurrentStateValue(displayedValue, multiple) {
  var ret = void 0;
  if (displayedValue) {
    ret = (0, _index.getTodayTime)(displayedValue);
  } else {
    ret = (0, _moment2['default'])();
  }
  return multiple ? [ret] : ret;
}

var calendarMixinPropTypes = exports.calendarMixinPropTypes = {
  value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  defaultValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  onKeyDown: _propTypes2['default'].func
};

var calendarMixinDefaultProps = exports.calendarMixinDefaultProps = {
  onKeyDown: noop
};

var calendarMixinWrapper = exports.calendarMixinWrapper = function calendarMixinWrapper(ComposeComponent) {
  var _class, _temp2;

  return _temp2 = _class = function (_ComposeComponent) {
    (0, _inherits3['default'])(_class, _ComposeComponent);

    function _class() {
      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, _ComposeComponent.call.apply(_ComposeComponent, [this].concat(args))), _this), _this.onSelect = function (value, cause) {
        var newValue = value;

        if (value) {
          if (_this.props.multiple) {
            newValue = _this.updateMultiSelectValue(value);
          } else {
            _this.setValue(value);
          }

          _this.setDisplayedValue(value);
        }

        _this.setSelectedValue(newValue, cause);
      }, _this.renderRoot = function (newProps) {
        var _className;

        var props = _this.props;
        var prefixCls = props.prefixCls;

        var className = (_className = {}, _className[prefixCls] = 1, _className[prefixCls + '-hidden'] = !props.visible, _className[props.className] = !!props.className, _className[newProps.className] = !!newProps.className, _className);

        return _react2['default'].createElement(
          'div',
          {
            ref: _this.saveRoot,
            className: '' + (0, _classnames2['default'])(className),
            style: _this.props.style,
            tabIndex: '0',
            onKeyDown: _this.onKeyDown,
            onBlur: _this.onBlur
          },
          newProps.children
        );
      }, _this.setSelectedValue = function (selectedValue, cause) {
        // if (this.isAllowedDate(selectedValue)) {
        if (!('selectedValue' in _this.props)) {
          _this.setState({
            selectedValue: selectedValue
          });
        }
        if (_this.props.onSelect) {
          _this.props.onSelect(selectedValue, cause);
        }
        // }
      }, _this.setValue = function (value) {
        var originalValue = _this.state.value;
        if (!('value' in _this.props)) {
          _this.setState({
            value: value
          });
        }
        if (originalValue && value && !originalValue.isSame(value) || !originalValue && value || originalValue && !value) {
          _this.props.onChange(value);
        }
      }, _this.setDisplayedValue = function (value) {
        _this.setState({
          displayedValue: value
        });
      }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    _class.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      // Use origin function if provided
      if (ComposeComponent.getDerivedStateFromProps) {
        return ComposeComponent.getDerivedStateFromProps(nextProps, prevState);
      }

      var selectedValue = nextProps.selectedValue;

      var newState = {};

      if (!prevState.displayedValue) {
        var value = nextProps.value || nextProps.defaultValue || getNowByCurrentStateValue(prevState.displayedValue, nextProps.multiple);

        if (nextProps.multiple) {
          newState.displayedValue = value[0];
        } else {
          newState.displayedValue = value;
        }
      }

      if ('selectedValue' in nextProps) {
        newState.selectedValue = selectedValue;
      } else if ('defaultSelectedValue' in nextProps) {
        newState.selectedValue = nextProps.defaultSelectedValue;
      }

      if ('value' in nextProps) {
        newState.value = nextProps.value;
      }

      return newState;
    };

    _class.prototype.sortValues = function sortValues(values) {
      if (values && values.length) {
        values.sort(function (a, b) {
          return a - b;
        });
      }
    };

    _class.prototype.updateMultiSelectValue = function updateMultiSelectValue(value) {
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
    };

    _class.prototype.addOrRemoveMultipleValues = function addOrRemoveMultipleValues(values) {
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
    };

    _class.prototype.isAllowedDate = function isAllowedDate(value, multiple) {
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
    };

    return _class;
  }(ComposeComponent), _class.displayName = 'CalendarMixinWrapper', _class.defaultProps = ComposeComponent.defaultProps, _temp2;
};