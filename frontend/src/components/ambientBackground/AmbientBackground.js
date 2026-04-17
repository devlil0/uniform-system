import { memo } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';

const LIGHT_BG = `
  radial-gradient(ellipse 80% 60% at 10% 10%, rgba(139,92,246,0.15) 0%, transparent 60%),
  radial-gradient(ellipse 70% 55% at 90% 5%,  rgba(96,165,250,0.14) 0%, transparent 60%),
  radial-gradient(ellipse 65% 50% at 5%  90%, rgba(52,211,153,0.12) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 95% 90%, rgba(251,113,133,0.12) 0%, transparent 60%),
  #f8faff
`.replace(/\n\s*/g, ' ');

const DARK_BG = `
  radial-gradient(ellipse 80% 60% at 10% 10%, rgba(109,40,217,0.22) 0%, transparent 60%),
  radial-gradient(ellipse 70% 55% at 90% 5%,  rgba(29,78,216,0.18) 0%, transparent 60%),
  radial-gradient(ellipse 65% 50% at 5%  90%, rgba(5,150,105,0.14) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 95% 90%, rgba(190,18,60,0.13) 0%, transparent 60%),
  #0b0b14
`.replace(/\n\s*/g, ' ');

function AmbientBackground() {
  const { colorMode } = useColorMode();

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      style={{
        background: colorMode === 'dark' ? DARK_BG : LIGHT_BG,
        transition: 'background 0.5s ease',
      }}
    />
  );
}

export default memo(AmbientBackground);
