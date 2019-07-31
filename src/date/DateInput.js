import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/lib/KeyCode';
import { polyfill } from 'react-lifecycles-compat';
import moment from 'moment';
import { formatDate } from '../util';

let cachedSelectionStart;
let cachedSelectionEnd;
let dateInputInstance;

class DateInput extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    disabledTime: PropTypes.any,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
    selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    clearIcon: PropTypes.node,
    inputMode: PropTypes.string,
    multiple: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      str: this.formatStr(this.props),
      invalid: false,
      hasFocus: false,
    }
  }

  componentDidUpdate() {
    if (dateInputInstance && this.state.hasFocus && !this.state.invalid &&
      !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)) {
      dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
    }
  }

  formatStr(props) {
    let str;

    const {
      selectedValue,
      multiple,
      format,
    } = props;

    if (multiple) {
      str = selectedValue && selectedValue.length && selectedValue.map((singleValue) => {
        return formatDate(singleValue, format);
      }).join(', ') || '';
    } else {
      str = formatDate(selectedValue, format);
    }

    return str;
  }

  onClear = () => {
    this.setState({
      str: '',
    });
    this.props.onClear(null);
  }

  onInputChange = (event) => {
    if (this.props.multiple) return;

    const str = event.target.value;
    const { disabledDate, format, onChange, selectedValue } = this.props;

    // 没有内容，合法并直接退出
    if (!str) {
      onChange(null);
      this.setState({
        invalid: false,
        str,
      });
      return;
    }

    // 不合法直接退出
    const parsed = moment(str, format, true);
    if (!parsed.isValid()) {
      this.setState({
        invalid: true,
        str,
      });
      return;
    }

    const value = this.props.value.clone();
    value
      .year(parsed.year())
      .month(parsed.month())
      .date(parsed.date())
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(parsed.second());

    if (!value || (disabledDate && disabledDate(value))) {
      this.setState({
        invalid: true,
        str,
      });
      return;
    }

    if (selectedValue !== value || (
      selectedValue && value && !selectedValue.isSame(value)
    )) {
      this.setState({
        invalid: false,
        str,
      });
      onChange(value);
    }
  }

  onFocus = () => {
    this.setState({ hasFocus: true });
  }

  onBlur = () => {
    this.setState((prevState, prevProps) => ({
      hasFocus: false,
      str: formatDate(prevProps.value, prevProps.format),
    }));
  }

  onKeyDown = (event) => {
    const { keyCode } = event;
    const { onSelect, value, disabledDate } = this.props;
    if (keyCode === KeyCode.ENTER && onSelect) {
      const validateDate = !disabledDate || !disabledDate(value);
      if (validateDate) {
        onSelect(value.clone());
      }
      event.preventDefault();
    }
  };

  static getDerivedStateFromProps(nextProps, state) {
    let newState = {};

    if (dateInputInstance) {
      cachedSelectionStart = dateInputInstance.selectionStart;
      cachedSelectionEnd = dateInputInstance.selectionEnd;
    }
    // when popup show, click body will call this, bug!
    if (!state.hasFocus) {
      newState = {
        str: this.formatStr(nextProps),
        invalid: false,
      };
    }

    return newState;
  }

  static getInstance() {
    return dateInputInstance;
  }

  getRootDOMNode = () => {
    return ReactDOM.findDOMNode(this);
  }

  focus = () => {
    if (dateInputInstance) {
      dateInputInstance.focus();
    }
  }

  saveDateInput = (dateInput) => {
    dateInputInstance = dateInput;
  }

  render() {
    const props = this.props;
    const { invalid, str } = this.state;
    const { locale, prefixCls, placeholder, clearIcon, inputMode } = props;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <div className={`${prefixCls}-input-wrap`}>
        <div className={`${prefixCls}-date-input-wrap`}>
          <input
            ref={this.saveDateInput}
            className={`${prefixCls}-input ${invalidClass}`}
            value={str}
            disabled={props.disabled}
            placeholder={placeholder}
            onChange={this.onInputChange}
            onKeyDown={this.onKeyDown}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            inputMode={inputMode}
          />
        </div>
        {props.showClear ? (
          <a
            role="button"
            title={locale.clear}
            onClick={this.onClear}
          >
            {clearIcon || <span className={`${prefixCls}-clear-btn`} />}
          </a>
        ) : null}
      </div>
    );
  }
}

polyfill(DateInput);

export default DateInput;
