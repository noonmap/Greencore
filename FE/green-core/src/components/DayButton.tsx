import React from 'react';

type PropsType = {
  isSelected: boolean;
  handleClick: (index: number) => void;
  elementIndex: number;
  content: string | number;
};

export default function DayButton(props: PropsType) {
  const { isSelected, handleClick, elementIndex, content } = props;

  return (
    <>
      <button
        onClick={() => handleClick(elementIndex)}
        style={
          isSelected
            ? {
                backgroundColor: 'green',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                marginInline: '4px',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
              }
            : {
                backgroundColor: 'gray',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                marginInline: '4px',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
              }
        }>
        {content}
      </button>
    </>
  );
}
