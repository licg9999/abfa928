import { FC } from 'react';
import { BareExample } from './components/BareExample';
import { SpreadoExample } from './components/SpreadoExample';

export const App: FC = () => {
  return (
    <div className="App">
      <BareExample />
      <hr />
      <SpreadoExample />
    </div>
  );
};
