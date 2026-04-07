{
  description = "WallStreetBets.top - AI Investment Intelligence Platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.pnpm
            pkgs.git
          ];

          shellHook = ''
            if [ -z "''${NO_BANNER:-}" ]; then
            echo ""
            echo "╔════════════════════════════════════════════════════════════════╗"
            echo "║                                                                ║"
            echo "║       📈 WallStreetBets.top Development Environment 📈        ║"
            echo "║                                                                ║"
            echo "╚════════════════════════════════════════════════════════════════╝"
            echo ""
            echo "  Available Tools:"
            echo "  • Node.js $(node --version) + pnpm $(pnpm --version)"
            echo "  • Git $(git --version | cut -d' ' -f3)"
            echo ""
            echo "  Quick Start:"
            echo "    pnpm install          # Install dependencies"
            echo "    pnpm dev              # Start dev server (port 3000)"
            echo ""
            fi
          '';
        };
      });
}
