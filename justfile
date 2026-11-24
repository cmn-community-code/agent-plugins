_default:
    @just --list --unsorted

# Validates the marketplace and De WeetWinkel, failing on warnings
check:
    claude plugin validate --strict .
    claude plugin validate --strict plugins/weetwinkel

# Adds this checkout as a local marketplace and installs De WeetWinkel from it
install-local: check
    claude plugin marketplace add "$PWD"
    claude plugin install weetwinkel@cmn

# Removes De WeetWinkel and the local marketplace again
uninstall-local:
    claude plugin uninstall weetwinkel@cmn
    claude plugin marketplace remove cmn

# Bump the version of a plugin
bump level="patch" plugin="weetwinkel":
    bun scripts/bump.ts {{level}} {{plugin}}
