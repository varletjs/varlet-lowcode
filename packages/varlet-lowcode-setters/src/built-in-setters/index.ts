import InputSetter from './input-setter/index'
import RadioSetter from './radio-setter/index'
import SwitchSetter from './switch-setter/index'
import SelectSetter from './select-setter/index'
import SliderSetter from './slider-setter'
import CounterSetter from './counter-setters'

const Component = [
  {
    component: InputSetter,
    name: 'InputSetter',
    value: '',
  },
  {
    component: RadioSetter,
    name: 'RadioSetter',
    value: '',
  },
  {
    component: SwitchSetter,
    name: 'SwitchSetter',
    value: '',
  },
  {
    component: SelectSetter,
    name: 'SelectSetter',
    value: '',
  },
  {
    component: CounterSetter,
    name: 'CounterSetter',
    value: 0,
  },
]
export default Component
export { SwitchSetter, InputSetter, RadioSetter, SelectSetter, SliderSetter, CounterSetter }
