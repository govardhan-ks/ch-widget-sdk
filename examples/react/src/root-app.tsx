import React from 'react';
import { usePlatform } from 'widget-sdk-react';

export function App() {
  const { context, theme, apiRequest } = usePlatform();

  const handleApiCall = async () => {
    try {
      const response = await apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' },
      });
    } catch (error) {}
  };

  if (!context || !theme) return <div>Loading...</div>;

  const containerStyle: React.CSSProperties = {
    fontFamily: theme.fontFamily || 'sans-serif',
    padding: theme.spacingLg || (16 as any),
    color: theme.colorText,
  };
  const cardStyle: React.CSSProperties = {
    background: theme.colorSurface,
    borderRadius: theme.borderRadius,
    border: '1px solid #e5e7eb',
    padding: theme.spacingLg,
  };
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacingMd,
  };
  const avatarStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: '50%',
  };
  const mutedStyle: React.CSSProperties = { color: theme.colorMuted };
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    background: theme.colorPrimary,
    color: theme.colorPrimaryText,
    borderRadius: '9999px',
    padding: '2px 8px',
    fontSize: 12,
  };
  const buttonStyle: React.CSSProperties = {
    height: theme.button?.height || 36,
    padding: `0 ${theme.button?.paddingInline || 12}`,
    background: theme.colorPrimary,
    color: theme.colorPrimaryText,
    border: 'none',
    borderRadius: theme.borderRadius,
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <img
            src={context.user?.avatarUrl}
            alt={context.user?.name}
            style={avatarStyle}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{context.user?.name}</div>
            <div style={mutedStyle}>{context.user?.email}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={badgeStyle}>{context.user?.role}</span>
          </div>
        </div>

        <div style={{ marginTop: theme.spacingLg }}>
          <div style={{ fontSize: 14, ...mutedStyle }}>Organization</div>
          <div
            style={{
              display: 'flex',
              gap: theme.spacingMd,
              alignItems: 'center',
              marginTop: theme.spacingSm,
            }}
          >
            <div style={{ fontWeight: 600 }}>{context.org?.name}</div>
            <span style={badgeStyle}>{context.org?.plan}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: theme.spacingLg,
            display: 'flex',
            gap: theme.spacingMd,
          }}
        >
          <button style={buttonStyle} onClick={handleApiCall}>
            Make API Call
          </button>
          <a
            href="#"
            style={{
              alignSelf: 'center',
              ...mutedStyle,
              textDecoration: 'underline',
            }}
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}
