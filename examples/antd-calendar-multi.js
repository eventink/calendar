/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-calendar/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/src/Picker';
import zhCN from 'rc-calendar/src/locale/zh_CN';
import enUS from 'rc-calendar/src/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function disabledDate(current) {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.valueOf() < date.valueOf();  // can not select days before today
}

function formatStr(value, strFormat) {
  let str;

  str = value && value.length && value.map((singleValue) => {
    return singleValue.format(strFormat) || '';
  }).join(', ') || '';

  return str;
}

class Demo extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.array,
    defaultCalendarValue: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      showDateInput: true,
      disabled: false,
      value: props.defaultValue,
    };

    this.nextDatePickerValue = null;
  }

  onChange = (value) => {
    this.nextDatePickerValue = value;
  }

  onOpenChange = (status) => {
    if (status === false) {
      if (this.nextDatePickerValue) {
        console.log('DatePicker change: ', formatStr(this.nextDatePickerValue, format));

        this.setState({
          value: this.nextDatePickerValue,
        });
      }
    }
  }

  onShowDateInputChange = (e) => {
    this.setState({
      showDateInput: e.target.checked,
    });
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  render() {
    console.log('render');
    const state = this.state;
    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="please input"
      formatter={format}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput}
      disabledDate={disabledDate}
      multiple
      selectWeeks
      selectMonths
    />);
    return (<div style={{ width: 400, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={state.showDateInput}
            onChange={this.onShowDateInputChange}
          />
          showDateInput
        </label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input
            checked={state.disabled}
            onChange={this.toggleDisabled}
            type="checkbox"
          />
          disabled
        </label>
      </div>
      <div style={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
        lineHeight: 1.5,
        marginBottom: 22,
      }}
      >
        <DatePicker
          animation="slide-up"
          disabled={state.disabled}
          calendar={calendar}
          value={state.value}
          onChange={this.onChange}
          onOpenChange={this.onOpenChange}
        >
          {
            ({ value }) => {
              return (
                <span tabIndex="0">
                <input
                  placeholder="please select"
                  style={{ width: 250 }}
                  disabled={state.disabled}
                  readOnly
                  tabIndex="-1"
                  className="ant-calendar-picker-input ant-input"
                  value={formatStr(value, format)}
                />
                </span>
              );
            }
          }
        </DatePicker>
      </div>
    </div>);
  }
}

function onStandaloneSelect(value) {
  console.log('onStandaloneSelect', value);
  console.log(formatStr(value, format));
}

function onStandaloneChange(value) {
  console.log('onStandaloneChange', value);
  console.log(formatStr(value, format));
}


ReactDOM.render((<div
  style={{
    zIndex: 1000,
    position: 'relative',
    width: 900,
    margin: '20px auto',
  }}
>
  <div>
    <div style={{ margin: 10 }}>
      <Calendar
        showWeekNumber={false}
        locale={cn ? zhCN : enUS}
        defaultValue={[now]}
        showToday
        formatter={format}
        showOk={false}
        onChange={onStandaloneChange}
        disabledDate={disabledDate}
        onSelect={onStandaloneSelect}
        multiple
        selectWeeks
        selectMonths
      />
    </div>
    <div style={{ float: 'left', width: 300 }}>
      <Demo defaultValue={[now]} />
    </div>
    <div style={{ float: 'right', width: 300 }}>
      <Demo defaultCalendarValue={[defaultCalendarValue]} />
    </div>
    <div style={{ clear: 'both' }}></div>
  </div>
</div>), document.getElementById('__react-content'));
