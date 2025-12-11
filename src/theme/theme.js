import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0071e3', // Apple blue
        light: '#0077ed',
        dark: '#0066cc',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#1d1d1f',
        light: '#424245',
        dark: '#000000',
        contrastText: '#ffffff',
      },
      success: {
        main: '#34c759',
        light: '#5dd777',
        dark: '#28a745',
      },
      warning: {
        main: '#ff9500',
        light: '#ffad33',
        dark: '#e68500',
      },
      error: {
        main: '#ff3b30',
        light: '#ff6961',
        dark: '#d32f2f',
      },
      background: {
        default: isDark ? '#000000' : '#ffffff',
        paper: isDark ? '#1d1d1f' : '#f5f5f7',
      },
      text: {
        primary: isDark ? '#f5f5f7' : '#1d1d1f',
        secondary: isDark ? '#86868b' : '#6e6e73',
      },
      divider: isDark ? '#424245' : '#d2d2d7',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h1: {
        fontWeight: 600,
        fontSize: '3.5rem',
        lineHeight: 1.07143,
        letterSpacing: '-0.011em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2.75rem',
        lineHeight: 1.09091,
        letterSpacing: '-0.008em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      h3: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.125,
        letterSpacing: '-0.004em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.16667,
        letterSpacing: '0em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.2,
        letterSpacing: '0em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.0625rem',
        lineHeight: 1.23529,
        letterSpacing: '0.009em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      body1: {
        fontSize: '1.0625rem',
        lineHeight: 1.47059,
        fontWeight: 400,
        letterSpacing: '-0.022em',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.42859,
        fontWeight: 400,
        letterSpacing: '-0.016em',
        color: isDark ? '#86868b' : '#6e6e73',
      },
      button: {
        fontWeight: 400,
        textTransform: 'none',
        letterSpacing: '-0.011em',
        fontSize: '1.0625rem',
      },
    },
    shape: {
      borderRadius: 0,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundImage: 'none',
            backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: isDark ? '#86868b' : '#6e6e73',
              boxShadow: 'none',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            textTransform: 'none',
            fontWeight: 400,
            padding: '8px 22px',
            fontSize: '1.0625rem',
            letterSpacing: '-0.011em',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
            border: '1px solid',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            backgroundColor: '#0071e3',
            color: '#ffffff',
            borderColor: '#0071e3',
            '&:hover': {
              backgroundColor: '#0077ed',
              borderColor: '#0077ed',
              transform: 'scale(1.02)',
            },
          },
          outlined: {
            borderColor: isDark ? '#424245' : '#d2d2d7',
            borderWidth: '1px',
            color: isDark ? '#f5f5f7' : '#1d1d1f',
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: isDark ? '#86868b' : '#6e6e73',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
          text: {
            color: '#0071e3',
            '&:hover': {
              backgroundColor: 'rgba(0, 113, 227, 0.08)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              backgroundColor: isDark ? '#1d1d1f' : '#f5f5f7',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '& fieldset': {
                borderColor: isDark ? '#424245' : '#d2d2d7',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#86868b' : '#6e6e73',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0071e3',
                borderWidth: '2px',
              },
              '&.Mui-focused': {
                backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#86868b' : '#6e6e73',
              '&.Mui-focused': {
                color: '#0071e3',
              },
            },
            '& .MuiInputBase-input': {
              color: isDark ? '#f5f5f7' : '#1d1d1f',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontWeight: 400,
            backgroundColor: isDark ? '#1d1d1f' : '#f5f5f7',
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
            color: isDark ? '#f5f5f7' : '#1d1d1f',
            fontSize: '0.875rem',
            height: '28px',
            '&:hover': {
              backgroundColor: isDark ? '#424245' : '#e8e8ed',
              borderColor: isDark ? '#86868b' : '#6e6e73',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'saturate(180%) blur(20px)',
            borderBottom: 'none',
            boxShadow: 'none',
            color: isDark ? '#f5f5f7' : '#1d1d1f',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
            boxShadow: isDark
              ? '0 20px 60px rgba(0, 0, 0, 0.5)'
              : '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
            borderRadius: 0,
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: '#0071e3',
            color: '#ffffff',
            border: '1px solid #0071e3',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#0077ed',
              borderColor: '#0077ed',
              boxShadow: 'none',
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
            boxShadow: isDark
              ? '0 8px 24px rgba(0, 0, 0, 0.4)'
              : '0 8px 24px rgba(0, 0, 0, 0.15)',
            marginTop: '8px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            margin: '4px 8px',
            padding: '8px 12px',
            fontSize: '0.9375rem',
            border: 'none',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(0, 113, 227, 0.2)' : 'rgba(0, 113, 227, 0.1)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(0, 113, 227, 0.3)' : 'rgba(0, 113, 227, 0.15)',
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            height: 4,
            border: isDark ? '1px solid #424245' : '1px solid #d2d2d7',
          },
          bar: {
            borderRadius: 0,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: '#0071e3',
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
              boxShadow: '0 2px 6px rgba(0, 113, 227, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 113, 227, 0.4)',
              },
            },
            '& .MuiSlider-track': {
              height: 4,
            },
            '& .MuiSlider-rail': {
              height: 4,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  });
};

export default createAppTheme;
