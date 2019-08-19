'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var cachedSelectionStart = void 0;
var cachedSelectionEnd = void 0;
var dateInputInstance = void 0;

var DateInput = function (_React$Component) {
  (0, _inherits3['default'])(DateInput, _React$Component);

  function DateInput(props) {
    (0, _classCallCheck3['default'])(this, DateInput);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _this.onClear = function () {
      _this.setState({
        str: ''
      });
      _this.props.onClear(null);
    };

    _this.onInputChange = function (event) {
      if (_this.props.multiple) return;

      var str = event.target.value;
      var _this$props = _this.props,
          disabledDate = _this$props.disabledDate,
          format = _this$props.format,
          onChange = _this$props.onChange,
          selectedValue = _this$props.selectedValue;

      // 没有内容，合法并直接退出

      if (!str) {
        onChange(null);
        _this.setState({
          invalid: false,
          str: str
        });
        return;
      }

      // 不合法直接退出
      var parsed = (0, _moment2['default'])(str, format, true);
      if (!parsed.isValid()) {
        _this.setState({
          invalid: true,
          str: str
        });
        return;
      }

      var value = _this.props.value.clone();
      value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

      if (!value || disabledDate && disabledDate(value)) {
        _this.setState({
          invalid: true,
          str: str
        });
        return;
      }

      if (selectedValue !== value || selectedValue && value && !selectedValue.isSame(value)) {
        _this.setState({
          invalid: false,
          str: str
        });
        onChange(value);
      }
    };

    _this.onFocus = function () {
      _this.setState({ hasFocus: true });
    };

    _this.onBlur = function () {
      _this.setState(function (prevState, prevProps) {
        return {
          hasFocus: false,
          str: (0, _util.formatDate)(prevProps.value, prevProps.format)
        };
      });
    };

    _this.onKeyDown = function (event) {
      var keyCode = event.keyCode;
      var _this$props2 = _this.props,
          onSelect = _this$props2.onSelect,
          value = _this$props2.value,
          disabledDate = _this$props2.disabledDate;

      if (keyCode === _KeyCode2['default'].ENTER && onSelect) {
        var validateDate = !disabledDate || !disabledDate(value);
        if (validateDate) {
          onSelect(value.clone());
        }
        event.preventDefault();
      }
    };

    _this.getRootDOMNode = function () {
      return _reactDom2['default'].findDOMNode(_this);
    };

    _this.focus = function () {
      if (dateInputInstance) {
        dateInputInstance.focus();
      }
    };

    _this.saveDateInput = function (dateInput) {
      dateInputInstance = dateInput;
    };

    _this.state = {
      str: DateInput.formatStr(_this.props),
      invalid: false,
      hasFocus: false
    };
    return _this;
  }

  DateInput.prototype.componentDidUpdate = function componentDidUpdate() {
    if (dateInputInstance && this.state.hasFocus && !this.state.invalid && !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)) {
      dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
    }
  };

  DateInput.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, state) {
    var newState = {};

    if (dateInputInstance) {
      cachedSelectionStart = dateInputInstance.selectionStart;
      cachedSelectionEnd = dateInputInstance.selectionEnd;
    }
    // when popup show, click body will call this, bug!
    if (!state.hasFocus) {
      newState = {
        str: DateInput.formatStr(nextProps),
        invalid: false
      };
    }

    return newState;
  };

  DateInput.getInstance = function getInstance() {
    return dateInputInstance;
  };

  DateInput.formatStr = function formatStr(props) {
    var str = void 0;

    var selectedValue = props.selectedValue,
        multiple = props.multiple,
        format = props.format;


    if (multiple) {
      str = selectedValue && selectedValue.length && selectedValue.map(function (singleValue) {
        return (0, _util.formatDate)(singleValue, format);
      }).join(', ') || '';
    } else {
      str = (0, _util.formatDate)(selectedValue, format);
    }

    return str;
  };

  DateInput.prototype.render = function render() {
    var props = this.props;
    var _state = this.state,
        invalid = _state.invalid,
        str = _state.str;
    var locale = props.locale,
        prefixCls = props.prefixCls,
        placeholder = props.placeholder,
        clearIcon = props.clearIcon,
        inputMode = props.inputMode;

    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return _react2['default'].createElement(
      'div',
      { className: prefixCls + '-input-wrap' },
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-date-input-wrap' },
        _react2['default'].createElement('input', {
          ref: this.saveDateInput,
          className: prefixCls + '-input ' + invalidClass,
          value: str,
          disabled: props.disabled,
          placeholder: placeholder,
          onChange: this.onInputChange,
          onKeyDown: this.onKeyDown,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          inputMode: inputMode
        })
      ),
      props.showClear ? _react2['default'].createElement(
        'a',
        {
          role: 'button',
          title: locale.clear,
          onClick: this.onClear
        },
        clearIcon || _react2['default'].createElement('span', { className: prefixCls + '-clear-btn' })
      ) : null
    );
  };

  return DateInput;
}(_react2['default'].Component);

DateInput.propTypes = {
  prefixCls: _propTypes2['default'].string,
  timePicker: _propTypes2['default'].object,
  value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  disabledTime: _propTypes2['default'].any,
  format: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].arrayOf(_propTypes2['default'].string)]),
  locale: _propTypes2['default'].object,
  disabledDate: _propTypes2['default'].func,
  onChange: _propTypes2['default'].func,
  onClear: _propTypes2['default'].func.isRequired,
  placeholder: _propTypes2['default'].string,
  onSelect: _propTypes2['default'].func,
  selectedValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  clearIcon: _propTypes2['default'].node,
  inputMode: _propTypes2['default'].string,
  multiple: _propTypes2['default'].bool
};


(0, _reactLifecyclesCompat.polyfill)(DateInput);

exports['default'] = DateInput;
module.exports = exports['default'];