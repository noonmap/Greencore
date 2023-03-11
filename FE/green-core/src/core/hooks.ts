import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from './store';

export const useInput = (initialValue: any = null) => {
  const [value, setValue] = useState(initialValue);

  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  return [value, handler];
};

// export const useForm =
//   <TContent>(defaultValues: TContent) =>
//   (handler: (content: TContent) => void) =>
//   async (event: ChangeEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     event.persist();

//     const form = event.target as HTMLFormElement;
//     const elements = Array.from(form.elements) as HTMLInputElement[];
//     const data = elements
//       .filter((element) => element.hasAttribute('name'))
//       .reduce(
//         (object, element) => ({
//           ...object,
//           [`${element.getAttribute('name')}`]: element.value,
//         }),
//         defaultValues
//       );
//     await handler(data);
//     form.reset();
//   };

export const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (...args: any) => savedCallback.current?.(...args);

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
