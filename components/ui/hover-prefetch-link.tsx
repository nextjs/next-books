'use client';

import { FastLink } from '@fast-link/next';
import { useState } from 'react';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof FastLink>, 'prefetch'> & {
  eager: boolean;
};

export function HoverPrefetchLink({ eager, onFocus, onMouseEnter, ...props }: Props) {
  const [intent, setIntent] = useState(false);

  return (
    <FastLink
      {...props}
      prefetch={eager || intent ? true : 'auto'}
      onFocus={event => {
        setIntent(true);
        onFocus?.(event);
      }}
      onMouseEnter={event => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
    />
  );
}
