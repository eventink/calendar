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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mapSelf = require('rc-util/lib/Children/mapSelf');

var _mapSelf2 = _interopRequireDefault(_mapSelf);

var _MonthPanel = require('../month/MonthPanel');

var _MonthPanel2 = _interopRequireDefault(_MonthPanel);

var _YearPanel = require('../year/YearPanel');

var _YearPanel2 = _interopRequireDefault(_YearPanel);

var _DecadePanel = require('../decade/DecadePanel');

var _DecadePanel2 = _interopRequireDefault(_DecadePanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function goMonth(direction) {
  var next = this.props.displayedValue.clone();
  next.add(direction, 'months');
  this.props.setDisplayedValue(next);
}

function goYear(direction) {
  var next = this.props.displayedValue.clone();
  next.add(direction, 'years');
  this.props.setDisplayedValue(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

var CalendarHeader = function (_React$Component) {
  (0, _inherits3['default'])(CalendarHeader, _React$Component);

  function CalendarHeader(props) {
    (0, _classCallCheck3['default'])(this, CalendarHeader);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    _this.nextMonth = goMonth.bind(_this, 1);
    _this.previousMonth = goMonth.bind(_this, -1);
    _this.nextYear = goYear.bind(_this, 1);
    _this.previousYear = goYear.bind(_this, -1);

    _this.state = { yearPanelReferer: null };
    return _this;
  }

  CalendarHeader.prototype.render = function render() {
    var _this2 = this;

    var props = this.props;
    var prefixCls = props.prefixCls,
        locale = props.locale,
        mode = props.mode,
        value = props.value,
        displayedValue = props.displayedValue,
        showTimePicker = props.showTimePicker,
        enableNext = props.enableNext,
        enablePrev = props.enablePrev,
        disabledMonth = props.disabledMonth,
        renderFooter = props.renderFooter,
        disablePreviousMonth = props.disablePreviousMonth,
        disablePreviousYear = props.disablePreviousYear,
        prevMonthIcon = props.prevMonthIcon,
        nextMonthIcon = props.nextMonthIcon,
        prevYearIcon = props.prevYearIcon,
        nextYearIcon = props.nextYearIcon;


    var panel = null;
    if (mode === 'month') {
      panel = _react2['default'].createElement(_MonthPanel2['default'], {
        locale: locale,
        value: value,
        defaultValue: value,
        displayedValue: displayedValue,
        rootPrefixCls: prefixCls,
        onSelect: this.onMonthSelect,
        onYearPanelShow: function onYearPanelShow() {
          return _this2.showYearPanel('month');
        },
        disabledDate: disabledMonth,
        cellRender: props.monthCellRender,
        contentRender: props.monthCellContentRender,
        renderFooter: renderFooter,
        changeYear: this.changeYear,
        setDisplayedValue: props.setDisplayedValue
      });
    }
    if (mode === 'year') {
      panel = _react2['default'].createElement(_YearPanel2['default'], {
        locale: locale,
        defaultValue: value,
        displayedValue: displayedValue,
        rootPrefixCls: prefixCls,
        onSelect: this.onYearSelect,
        onDecadePanelShow: this.showDecadePanel,
        renderFooter: renderFooter,
        setDisplayedValue: props.setDisplayedValue
      });
    }
    if (mode === 'decade') {
      panel = _react2['default'].createElement(_DecadePanel2['default'], {
        locale: locale,
        defaultValue: value,
        displayedValue: displayedValue,
        rootPrefixCls: prefixCls,
        onSelect: this.onDecadeSelect,
        renderFooter: renderFooter,
        setDisplayedValue: props.setDisplayedValue
      });
    }

    return _react2['default'].createElement(
      'div',
      { className: prefixCls + '-header' },
      _react2['default'].createElement(
        'div',
        { style: { position: 'relative' } },
        showIf(enablePrev && !showTimePicker, disablePreviousYear ? _react2['default'].createElement(
          'span',
          { className: prefixCls + '-prev-year-btn disabled' },
          prevYearIcon
        ) : _react2['default'].createElement(
          'a',
          {
            className: prefixCls + '-prev-year-btn',
            role: 'button',
            onClick: this.previousYear,
            title: locale.previousYear
          },
          prevYearIcon
        )),
        showIf(enablePrev && !showTimePicker, disablePreviousMonth ? _react2['default'].createElement(
          'span',
          { className: prefixCls + '-prev-month-btn disabled' },
          prevMonthIcon
        ) : _react2['default'].createElement(
          'a',
          {
            className: prefixCls + '-prev-month-btn',
            role: 'button',
            onClick: this.previousMonth,
            title: locale.previousMonth
          },
          prevMonthIcon
        )),
        this.monthYearElement(showTimePicker),
        showIf(enableNext && !showTimePicker, _react2['default'].createElement(
          'a',
          {
            className: prefixCls + '-next-month-btn',
            onClick: this.nextMonth,
            title: locale.nextMonth
          },
          nextMonthIcon
        )),
        showIf(enableNext && !showTimePicker, _react2['default'].createElement(
          'a',
          {
            className: prefixCls + '-next-year-btn',
            onClick: this.nextYear,
            title: locale.nextYear
          },
          nextYearIcon
        ))
      ),
      panel
    );
  };

  return CalendarHeader;
}(_react2['default'].Component);

CalendarHeader.propTypes = {
  prefixCls: _propTypes2['default'].string,
  value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  displayedValue: _propTypes2['default'].object,
  onValueChange: _propTypes2['default'].func,
  showTimePicker: _propTypes2['default'].bool,
  onPanelChange: _propTypes2['default'].func,
  locale: _propTypes2['default'].object,
  enablePrev: _propTypes2['default'].any,
  enableNext: _propTypes2['default'].any,
  disabledMonth: _propTypes2['default'].func,
  renderFooter: _propTypes2['default'].func,
  onMonthSelect: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].bool]),
  disablePreviousMonth: _propTypes2['default'].bool,
  disablePreviousYear: _propTypes2['default'].bool,
  prevMonthIcon: _propTypes2['default'].node,
  nextMonthIcon: _propTypes2['default'].node,
  prevYearIcon: _propTypes2['default'].node,
  nextYearIcon: _propTypes2['default'].node,
  multiple: _propTypes2['default'].bool,
  setDisplayedValue: _propTypes2['default'].func
};
CalendarHeader.defaultProps = {
  enableNext: 1,
  enablePrev: 1,
  onPanelChange: function onPanelChange() {},
  onValueChange: function onValueChange() {}
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onMonthSelect = function (value) {
    _this3.props.onPanelChange(value, 'date');
    if (_this3.props.onMonthSelect) {
      _this3.props.onMonthSelect(value);
    } else {
      _this3.props.setDisplayedValue(value);
    }
  };

  this.onYearSelect = function (value) {
    var referer = _this3.state.yearPanelReferer;
    _this3.setState({ yearPanelReferer: null });
    _this3.props.onPanelChange(value, referer);
    _this3.props.setDisplayedValue(value);
  };

  this.onDecadeSelect = function (value) {
    _this3.props.onPanelChange(value, 'year');
    _this3.props.setDisplayedValue(value);
  };

  this.changeYear = function (direction) {
    if (direction > 0) {
      _this3.nextYear();
    } else {
      _this3.previousYear();
    }
  };

  this.monthYearElement = function (showTimePicker) {
    var props = _this3.props;
    var prefixCls = props.prefixCls;
    var locale = props.locale;
    var displayedValue = props.displayedValue;
    var localeData = displayedValue.localeData();
    var monthBeforeYear = locale.monthBeforeYear;
    var selectClassName = prefixCls + '-' + (monthBeforeYear ? 'my-select' : 'ym-select');
    var timeClassName = showTimePicker ? ' ' + prefixCls + '-time-status' : '';

    if (props.onMonthSelect) {
      return _react2['default'].createElement(
        'a',
        {
          className: prefixCls + '-month-select',
          onClick: function onClick() {
            props.onMonthSelect(displayedValue);
          },
          onMouseEnter: function onMouseEnter() {
            props.onMonthMouseEnter(displayedValue);
          },
          onMouseLeave: props.onMonthMouseLeave
        },
        localeData.months(displayedValue),
        ' ',
        displayedValue.format(locale.yearFormat)
      );
    }

    var year = _react2['default'].createElement(
      'a',
      {
        className: prefixCls + '-year-select' + timeClassName,
        role: 'button',
        onClick: showTimePicker ? null : function () {
          return _this3.showYearPanel('date');
        },
        title: showTimePicker ? null : locale.yearSelect
      },
      displayedValue.format(locale.yearFormat)
    );
    var month = _react2['default'].createElement(
      'a',
      {
        className: prefixCls + '-month-select' + timeClassName,
        role: 'button',
        onClick: showTimePicker ? null : _this3.showMonthPanel,
        title: showTimePicker ? null : locale.monthSelect
      },
      locale.monthFormat ? displayedValue.format(locale.monthFormat) : localeData.monthsShort(displayedValue)
    );
    var day = void 0;
    if (showTimePicker) {
      day = _react2['default'].createElement(
        'a',
        {
          className: prefixCls + '-day-select' + timeClassName,
          role: 'button'
        },
        displayedValue.format(locale.dayFormat)
      );
    }
    var my = [];
    if (monthBeforeYear) {
      my = [month, day, year];
    } else {
      my = [year, month, day];
    }
    return _react2['default'].createElement(
      'span',
      { className: selectClassName },
      (0, _mapSelf2['default'])(my)
    );
  };

  this.showMonthPanel = function () {
    // null means that users' interaction doesn't change value
    _this3.props.onPanelChange(null, 'month');
  };

  this.showYearPanel = function (referer) {
    _this3.setState({ yearPanelReferer: referer });
    _this3.props.onPanelChange(null, 'year');
  };

  this.showDecadePanel = function () {
    _this3.props.onPanelChange(null, 'decade');
  };
};

exports['default'] = CalendarHeader;
module.exports = exports['default'];