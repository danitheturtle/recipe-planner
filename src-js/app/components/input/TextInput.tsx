import { ChangeEventHandler, FunctionComponent, InputHTMLAttributes, useMemo } from 'react';

type TextInputProps = {
  id: string;
  value: string;
  onChange: ChangeEventHandler;
  className?: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const labelBaseClasses =
  'absolute cursor-text bg-background px-1 left-2.5 top-2.5 text-neutral-500 text-sm transition-all transform origin-left';
const labelPeerClasses =
  'peer-focus:-top-2.5 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-neutral-500 peer-focus:scale-90';
const labelMovedClasses = '-top-2.5 left-2.5 text-xs text-neutral-500 scale-90';

const inputBaseClasses =
  'w-full bg-transparent text-neutral-200 text-sm border border-neutral-700 rounded-md px-3 ' +
  'py-2 transition duration-300 ease focus:outline-none focus:border-neutral-500 ' +
  'hover:border-neutral-600 shadow-sm focus:shadow';
const TextInput: FunctionComponent<TextInputProps> = ({ id, value, onChange, label, className, ...rest }) => {
  const inputClasses = `${label !== undefined && label.length > 0 ? 'peer ' : ''}${inputBaseClasses}${className !== undefined && className.length > 0 ? ' ' + className : ''}`;
  const labelClasses =
    labelBaseClasses + (value !== undefined && value.length > 0 ? ` ${labelMovedClasses}` : ` ${labelPeerClasses}`);
  return (
    <div className='relative w-full max-w-sm min-w-[200px]'>
      <input id={id} type='text' value={value} onChange={onChange} className={inputClasses} {...rest} />
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
    </div>
  );
};

export default TextInput;
