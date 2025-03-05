import React from 'react'
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import {Button } from '@heroui/react';
export default function WrongHint() {
  return (
    <div>
      <Button
        className="bg-[#ff3c3c] px-4"
        startContent={<BsFillExclamationCircleFill color="white" />}
      >
        <p className="text-white">
          Hmm, something went wrong with the project loading.
          <Button
            className="text-white px-0"
            variant="light"
            disableRipple
            style={{ backgroundColor: 'transparent' }}
          >
            <ins>Click to retry</ins>
          </Button>
        </p>
      </Button>
    </div>
  );
}
