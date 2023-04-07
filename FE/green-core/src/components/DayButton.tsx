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
                backgroundColor: '#4FC577',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                marginInline: '4px',
                borderRadius: '50%',
                width: '1.9rem',
                height: '1.9rem',
              }
            : {
                backgroundColor: '#D9D9D9',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                marginInline: '4px',
                borderRadius: '50%',
                width: '1.9rem',
                height: '1.9rem',
              }
        }>
        {content}
      </button>
    </>
  );
}
