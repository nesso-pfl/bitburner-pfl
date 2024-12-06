const background = "#121421";
// const darydark = "#282c44";
const dark = "#3d415d";
// const lightdark = "#74778c";
const light = "#c7c9d1";
const purple = "#a191c9";
const blue = "#859fc8";
// const cyan = "#89b8c1";
const green = "#b7c684";
const orange = "#e3a675";
const red = "#e27a79";

export async function main(ns: NS): Promise<void> {
  const theme = ns.ui.getTheme();
  ns.tprint(theme);
  ns.ui.setTheme({
    primarylight: light,
    primary: light,
    primarydark: light,
    successlight: green,
    success: green,
    successdark: green,
    errorlight: red,
    error: red,
    errordark: red,
    secondarylight: dark,
    secondary: dark,
    secondarydark: dark,
    warninglight: orange,
    warning: orange,
    warningdark: orange,
    infolight: blue,
    info: blue,
    infodark: blue,
    welllight: theme.welllight,
    well: theme.well,
    white: theme.white,
    black: theme.black,
    hp: red,
    money: orange,
    hack: green,
    combat: light,
    cha: purple,
    int: theme.int,
    rep: theme.rep,
    disabled: theme.disabled,
    backgroundprimary: background,
    backgroundsecondary: background,
    button: dark,
  });
  // ns.ui.resetTheme()
}
