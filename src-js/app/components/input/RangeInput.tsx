import { FunctionComponent, ChangeEventHandler, FormEvent, ReactNode } from 'react';

export interface RangeInputProps {
  lower: number;
  setLower: (x: number) => void;
  upper: number;
  setUpper: (x: number) => void;
  min: number;
  max: number;
}

// const RangeInput: FunctionComponent<RangeInputProps> = ({ value, setValue, min, setMin, max, setMax }) => {
//   const handleLowerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
//     setLower(parseFloat(e.target.value));
//   };
//   return (
//     <div className='relative w-full flex flex-row'>
//       <TextInput value={min} setValue={setMin} />
//       <input
//         type='range'
//         step='0.1'
//         min={min}
//         max={max}
//         onChange={handleLowerChange}
//         value={lower}
//         className={`${sty.multiRangeInput} absolute appearance-none h-2 w-full cursor-pointer bg-neutral-300`}
//       />
//     </div>
//   );
// };

// export default RangeInput;
