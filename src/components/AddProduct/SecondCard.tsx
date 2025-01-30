import { forwardRef, ReactNode } from 'react';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import Highlighter from './third-party/Highlighter';
import { SxProps } from '@mui/system';

// Header style
const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

interface SecondCardProps {
  border?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: SxProps;
  darkTitle?: boolean;
  elevation?: number;
  secondary?: ReactNode;
  sx?: SxProps;
  title?: string | ReactNode;
  codeHighlight?: boolean;
}

const SecondCard = forwardRef<HTMLDivElement, SecondCardProps>(
  (
    {
      border = true,
      children,
      content = true,
      contentSX = {},
      darkTitle,
      elevation,
      secondary,
      sx = {},
      title,
      codeHighlight,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px dashed #a0a0a0' : 'none',
          background: '#f8f8f8',
          borderRadius: 2,
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          ...sx
        }}
      >
        {/* Card header and action */}
        {!darkTitle && title && (
          <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />
        )}
        {darkTitle && title && (
          <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
        )}

        {/* Card content */}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}

        {/* Card footer - clipboard & highlighter */}
        {codeHighlight && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Highlighter codeHighlight={codeHighlight} main>
              {children}
            </Highlighter>
          </>
        )}
      </Card>
    );
  }
);

export default SecondCard;
