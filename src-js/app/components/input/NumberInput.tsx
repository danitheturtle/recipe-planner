import { ChangeEventHandler, FunctionComponent, InputHTMLAttributes } from 'react';
import TextInput from '@/components/input/TextInput.tsx';

export type NumberInputProps = {
  id: string;
  value: string;
  setValue: (x: string) => void;
  isFloat: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const NumberInput: FunctionComponent<NumberInputProps> = ({ id, value, setValue, isFloat = false, className, ...rest }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    let nextVal: string = e.target.value;
    if (nextVal === undefined || nextVal.length === 0) {
      setValue('');
      return;
    }
    if (nextVal[0] === '.') {
      nextVal = '0' + nextVal;
    }
    const validNumberRegex: RegExp = isFloat ? /\d*\.{0,1}\d*/g : /\d*/g;
    const testResult: RegExpMatchArray | null = nextVal.match(validNumberRegex);
    if (testResult !== null && testResult.length === 2) {
      setValue(testResult[0]);
    }
  };
  return (
    <TextInput
      id='asdf'
      label='input'
      value={value}
      onChange={handleChange}
      className={className}
      {...rest}
    />
  );
};

export default NumberInput;
