import InputSetter from './input-setter/index'
import RadioSetter from './radio-setter/index'
import SwitchSetter from './switch-setter/index'
import SelectSetter from './select-setter/index'
import TextSetter from './text-setter/index'
import SliderSetter from './slider-setter/index'
import CounterSetter from './counter-setter/index'
import SwitchInputSetter from './switch-input-setter/index'
import DraggableSetter from './draggable-setter/index.vue'

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
  {
    component: SwitchInputSetter,
    name: 'SwitchInputSetter',
    value: 0,
  },
  {
    component: DraggableSetter,
    name: 'DraggableSetter',
    value: 0,
  },
  {
    component: TextSetter,
    name: 'TextSetter',
    value: 0,
  },
]
export default Component
export {
  SwitchSetter,
  InputSetter,
  RadioSetter,
  SelectSetter,
  SliderSetter,
  CounterSetter,
  SwitchInputSetter,
  DraggableSetter,
  TextSetter,
}
