import { useEffect, FunctionComponent } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen, Event } from '@tauri-apps/api/event';

export const Example: FunctionComponent<{}> = () => {
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

  return (
    <button onClick={handleClick} className='bg-blue-300 rounded-lg p-2'>
      Tell Rust code about Craig
    </button>
  );
};
