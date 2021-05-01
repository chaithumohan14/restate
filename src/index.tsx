import * as React from 'react'

export interface Slices {
  [propname: string]: any
}

export type Actions = { type: string; payload: any }

export type Reducers<InitialStates extends Slices> = {
  [propname in keyof InitialStates]: (
    prevState: InitialStates[propname],
    action: Actions
  ) => InitialStates[propname]
}

export type SelectorFunction<InitialStates extends Slices> = (
  state: InitialStates
) => InitialStates[keyof InitialStates]

interface Props<InitialStates extends Slices> {
  initialStates: InitialStates
  reducers: Reducers<InitialStates>
  children: React.ReactNode
}

const combineAllReducers = <InitialStates extends Slices>(
  initialStates: InitialStates,
  reducers: Reducers<InitialStates>
) => {
  const reducer: React.Reducer<InitialStates, Actions> = (
    prevState,
    action
  ) => {
    const mainAction = action.type.split('/')[0]
    const subActions = action.type.split('/').slice(1).join('/')
    const isSliceInState = Object.keys(prevState).includes(mainAction)
    if (isSliceInState) {
      const slice = prevState[mainAction]
      const sliceReducer = reducers[mainAction]
      const sliceAction: Actions = {
        type: subActions,
        payload: action.payload
      }
      const newState = {
        ...prevState,
        [mainAction]: sliceReducer(slice, sliceAction)
      }
      return newState
    } else {
      return prevState
    }
  }

  return {
    initialState: initialStates,
    reducer
  }
}

const RawStore = React.createContext<{
  state: Slices
  dispatch: React.Dispatch<Actions>
}>({ state: {}, dispatch: () => ({}) })

export const ReStateProvider = <InitialStates extends Slices>({
  initialStates,
  reducers,
  children
}: Props<InitialStates>) => {
  const {
    initialState: combinedInitialState,
    reducer: combinedReducer
  } = combineAllReducers(initialStates, reducers)
  const [state, dispatch] = React.useReducer(
    combinedReducer,
    combinedInitialState
  )
  return (
    <RawStore.Provider value={{ state, dispatch }}>
      {children}
    </RawStore.Provider>
  )
}

/*
 * Accepts a selector function that takes the combinedState as the argument and returns a slice from the state.
 */
export const useSlice = (selector: SelectorFunction<Slices>) => {
  const { state } = React.useContext(RawStore)
  return selector(state)
}

/*
 * Returns the combinedState.
 */
export const useCombinedState = () => {
  const { state } = React.useContext(RawStore)
  return state
}

/*
 * Returns the dispatch function of the combinedState.
 */
export const useDispatch = () => {
  const { dispatch } = React.useContext(RawStore)
  return dispatch
}
