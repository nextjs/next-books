'use client';

import { FastLink } from '@fast-link/next';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotFound() {
  return (
    <EmptyState body="That page isn't in the catalog." title="Page not found">
      <Button className="mt-1" render={<FastLink href="/" />} variant="secondary">
        Back to the shelf
      </Button>
    </EmptyState>
  );
}
