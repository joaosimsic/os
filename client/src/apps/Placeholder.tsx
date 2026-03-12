interface PlaceholderProps {
  title?: string;
}

export function Placeholder({ title = 'Application' }: PlaceholderProps) {
  return (
    <div style={{ padding: '16px', fontFamily: 'inherit' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{title}</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#444' }}>
        This application is under construction.
      </p>
    </div>
  );
}
