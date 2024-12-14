import { FunctionComponent, useState } from 'react';
import NumberInput from '@/components/input/NumberInput.tsx';

type UniformDistributionFormProps = {};
const UniformDistributionForm: FunctionComponent<UniformDistributionFormProps> = () => {
  const [num, setNum] = useState<string>("0");
  return (
    <div>
      <NumberInput id="testInput" value={num} setValue={setNum} isFloat={true} />
    </div>
  );
};

export default UniformDistributionForm;
