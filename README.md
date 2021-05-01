# restate

> A state management library with the features of Redux and simplicity of Context API

[![NPM](https://img.shields.io/npm/v/restate.svg)](https://www.npmjs.com/package/restate) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save restate
```

## Usage

```tsx
import {ReStateProvider} from 'restate'

const initialStates = {
  todos:[],
  counter:0,
}

const reducers = {
  todos:(prevState,action) =>{
    switch(action.type){
      case "add":
        return [...prevState,action.payload]
      
      default:
        return prevState
    }
  },
  counter:(prevState,action) =>{
    switch(action.type){
      case "add":
        return prevState + 1
      
      case "sub":
        return prevState > 0 ? prevState - 1 : 0
      
      default:
        return prevState
    }
  },
}

function App = () =>{
  return <ReStateProvider initialStates={initialStates} reducers={reducers}>
    <div> Hello World </div>
  </ReStateProvider>
}

```

## License

MIT © [chaithumohan14](https://github.com/chaithumohan14)
