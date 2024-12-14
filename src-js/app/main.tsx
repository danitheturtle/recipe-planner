import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Layout from '@/components/Layout.tsx';

// Uncomment if we need providers or routes
// function App() {
//   //Put providers and/or routing here
//   return (<Layout />);
// }

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Layout />
  </StrictMode>
);
