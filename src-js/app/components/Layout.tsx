import { FunctionComponent, useState } from 'react';
import UniformDistributionForm from '@/components/UniformDistributionForm.tsx';

const Layout: FunctionComponent<{}> = () => {
  const [lower, setLower] = useState(10);
  const [upper, setUpper] = useState(90);
  return (
    <div className='layout flex flex-row w-screen h-screen bg-background'>
      <div className='sidebar w-2/12 bg-neutral-900 p-6'>
        <h2>Sidebar</h2>
      </div>
      <div className='content flex-1 p-6'>
        <h2>Content</h2>
        <div className='w-96'>
          <UniformDistributionForm />
        </div>
      </div>
    </div>
  );
};
export default Layout;
