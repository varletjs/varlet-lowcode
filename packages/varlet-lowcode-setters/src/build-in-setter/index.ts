import InputSetter from './input-setter/index'
import RadioSetter from './radio-setter/index'
import SwitchSetter from './switch-setter/index'
import SelectSetter from './select-setter/index'

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
]
export default Component
export { SwitchSetter, InputSetter, RadioSetter, SelectSetter }
