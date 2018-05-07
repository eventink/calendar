'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

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

var CalendarHeader = (0, _createReactClass2['default'])({
  displayName: 'CalendarHeader',

  propTypes: {
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
    disablePreviousMonth: _propTypes2['default'].bool,
    disablePreviousYear: _propTypes2['default'].bool,
    prevMonthIcon: _propTypes2['default'].node,
    nextMonthIcon: _propTypes2['default'].node,
    prevYearIcon: _propTypes2['default'].node,
    nextYearIcon: _propTypes2['default'].node,
    multiple: _propTypes2['default'].bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      enableNext: 1,
      enablePrev: 1,
      onPanelChange: function onPanelChange() {},
      onValueChange: function onValueChange() {}
    };
  },
  getInitialState: function getInitialState() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return { yearPanelReferer: null };
  },
  onMonthSelect: function onMonthSelect(value) {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.setDisplayedValue(value);
    }
  },
  onYearSelect: function onYearSelect(value) {
    var referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    this.props.onPanelChange(value, referer);
    this.props.setDisplayedValue(value);
  },
  onDecadeSelect: function onDecadeSelect(value) {
    this.props.onPanelChange(value, 'year');
    this.props.setDisplayedValue(value);
  },
  monthYearElement: function monthYearElement(showTimePicker) {
    var _this = this;

    var props = this.props;
    var prefixCls = props.prefixCls;
    var locale = props.locale;
    var displayedValue = props.displayedValue;
    var localeData = displayedValue.localeData();
    var monthBeforeYear = locale.monthBeforeYear;
    var selectClassName = prefixCls + '-' + (monthBeforeYear ? 'my-select' : 'ym-select');

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
        className: prefixCls + '-year-select',
        role: 'button',
        onClick: showTimePicker ? null : function () {
          return _this.showYearPanel('date');
        },
        title: locale.yearSelect
      },
      displayedValue.format(locale.yearFormat)
    );
    var month = _react2['default'].createElement(
      'a',
      {
        className: prefixCls + '-month-select',
        role: 'button',
        onClick: showTimePicker ? null : this.showMonthPanel,
        title: locale.monthSelect
      },
      locale.monthFormat ? displayedValue.format(locale.monthFormat) : localeData.monthsShort(displayedValue)
    );
    var day = void 0;
    if (showTimePicker) {
      day = _react2['default'].createElement(
        'a',
        {
          className: prefixCls + '-day-select',
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
  },
  showMonthPanel: function showMonthPanel() {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  },
  showYearPanel: function showYearPanel(referer) {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  },
  showDecadePanel: function showDecadePanel() {
    this.props.onPanelChange(null, 'decade');
  },
  render: function render() {
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
  }
});

exports['default'] = CalendarHeader;
module.exports = exports['default'];