import {
  Application,
  extend,
} from '@pixi/react';
import {
  Container,
  Graphics,
  Sprite,
} from 'pixi.js';

import { BunnySprite } from './BunnySprite'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

export default function App() {
  return (
    // We'll wrap our components with an <Application> component to provide
    // the Pixi.js Application context
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Application><BunnySprite /></Application>} />
      </Routes>
    </BrowserRouter>
  );
}
