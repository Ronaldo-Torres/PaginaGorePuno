import { MutatingDots, Oval, ThreeDots, TailSpin, RotatingLines, Triangle } from "react-loader-spinner";
import { useTheme } from "next-themes";

// Hook para obtener colores basados en el tema
const useThemeColors = () => {
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  
  return {
    primary: isDark ? "#F3F4F6" : "#2B3554", // blue-500 / blue-600
    secondary: isDark ? "#F3F4F6" : "#2B3554", // gray-500 / gray-600
    muted: isDark ? "#F3F4F6" : "#2B3554", // gray-400 / gray-500
  };
};

// Spinner principal con colores condicionales al tema
export const MutatingDotsSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <MutatingDots
      visible={true}
      height="100"
      width="100"
      color={colors.primary}
      secondaryColor={colors.muted}
      radius="12.5"
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner oval para cargas más sutiles
export const OvalSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <Oval
      visible={true}
      height="40"
      width="40"
      color={colors.primary}
      secondaryColor={colors.muted}
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner de tres puntos para botones
export const ThreeDotsSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <ThreeDots
      visible={true}
      height="20"
      width="20"
      color={colors.primary}
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner de cola giratoria
export const TailSpinSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <TailSpin
      visible={true}
      height="30"
      width="30"
      color={colors.primary}
      ariaLabel="tail-spin-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner de líneas rotatorias
export const RotatingLinesSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <RotatingLines
      visible={true}
      strokeColor={colors.primary}
      strokeWidth="3"
      animationDuration="0.75"
      width="30"
      ariaLabel="rotating-lines-loading"
    />
  );
};

// Spinner pequeño para elementos inline
export const SmallSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <Oval
      visible={true}
      height="16"
      width="16"
      color={colors.primary}
      secondaryColor={colors.muted}
      ariaLabel="small-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner grande para páginas completas
export const LargeSpinner = () => {
  const colors = useThemeColors();
  
  return (
    <MutatingDots
      visible={true}
      height="120"
      width="120"
      color={colors.primary}
      secondaryColor={colors.muted}
      radius="15"
      ariaLabel="large-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

// Spinner con colores personalizados
export const CustomSpinner = ({ 
  color,
  secondaryColor,
  size = 100 
}: { 
  color?: string; 
  secondaryColor?: string; 
  size?: number; 
}) => {
  const themeColors = useThemeColors();
  
  const finalColor = color || themeColors.primary;
  const finalSecondaryColor = secondaryColor || themeColors.muted;
  
  return (
    <MutatingDots
      visible={true}
      height={size}
      width={size}
      color={finalColor}
      secondaryColor={finalSecondaryColor}
      radius="12.5"
      ariaLabel="custom-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export const TriangleSpinner = () => {
  const colors = useThemeColors();

  return (
    <Triangle
    visible={true}
    height="80"
    width="80"
    color={colors.primary}
    ariaLabel="triangle-loading"
    wrapperStyle={{}}
    wrapperClass=""
    />
  );
};


