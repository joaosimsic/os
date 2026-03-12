import type { ReactNode } from 'react';
import { Placeholder } from './Placeholder';
import { FileExplorer } from './FileExplorer';
import { Notepad } from './Notepad';

// Registry of available applications
// Add new apps here as they are created
const appRegistry: Record<
  string,
  (props: Record<string, unknown>) => ReactNode
> = {
  FileExplorer: (props) => <FileExplorer {...props} />,
  Settings: (props) => <Placeholder title="Settings" {...props} />,
  Help: (props) => <Placeholder title="Help" {...props} />,
  Notepad: (props) => <Notepad {...props} />,
};

export function getAppComponent(
  componentName: string,
  props?: Record<string, unknown>,
): ReactNode {
  const Component = appRegistry[componentName];
  if (!Component) {
    return <Placeholder title={componentName} />;
  }
  return Component(props ?? {});
}

export function registerApp(
  name: string,
  component: (props: Record<string, unknown>) => ReactNode,
) {
  appRegistry[name] = component;
}
