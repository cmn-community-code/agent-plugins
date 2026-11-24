{ pkgs, lib, ... }:

let
  devPackages = [
    pkgs.claude-code
    pkgs.just
    pkgs.bun
  ];

  printPackages = title: ps: ''
    echo "${title}:"
    ${lib.concatMapStringsSep "\n" (
      p: ''printf "    %-28s %s\n" "${lib.getName p}" "${lib.getVersion p}"''
    ) (lib.sort (a: b: lib.toLower (lib.getName a) < lib.toLower (lib.getName b)) ps)}
    echo ""
  '';
in
{
  name = "agent-plugins";

  packages = devPackages;

  enterShell = ''
    ${printPackages "Development packages" devPackages}
  '';
}
