import { ReactNode } from 'react';

export interface CraftComponentProps {
  displayName: string;
  props: Record<string, any>;
  related: {
    toolbar: React.ComponentType<any>;
  };
  custom?: Record<string, any>;
}

export type CraftComponent<P = {}> = React.FC<P> & {
  craft: CraftComponentProps;
};

export interface CraftNodeProps {
  children?: ReactNode;
}

export interface CraftSettings<T = {}> {
  props: T;
  setProp: (setter: (props: T) => void) => void;
}