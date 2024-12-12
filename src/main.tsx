import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

function App() {
  //Put providers and routing here
  return <div>This is a test</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
