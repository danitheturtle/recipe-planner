import { StrictMode, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { invoke } from '@tauri-apps/api/core';
import { listen, Event } from '@tauri-apps/api/event';

function App() {
  const handleClick = () => {
    invoke('custom_js_command', { message: 'craig!' });
  };
  useEffect(() => {
    listen<string>('example-started', (event: Event<string>) => {
      console.dir('example started' + event.payload);
    });
    listen<string>('example-progressed', (event: Event<string>) => {
      console.dir('example progressed' + event.payload);
    });
    listen<string>('example-started', (event: Event<string>) => {
      console.dir('example started' + event.payload);
    });
  }, []);
  //Put providers and routing here
  return (
    <div>
      <p className='p-10'>This is a test</p>
      <button onClick={handleClick} className='bg-blue-300 rounded-lg p-2'>
        Tell Rust code about Craig
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
