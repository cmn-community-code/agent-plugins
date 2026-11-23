# CMN Agent Plugins

This repository is CMN's plugin marketplace for Claude Code and Codex. A marketplace is a list of
plugins that an agent can install. Each plugin lives in its own folder under
[`plugins`](./plugins).

| Plugin                                | What it does                                                            |
| ------------------------------------- | ----------------------------------------------------------------------- |
| [De WeetWinkel](./plugins/weetwinkel) | Connects your agent to the CMN knowledge base so it can search and read it. |

The plugins connect to servers on the CMN tailnet, so Tailscale must be running on your machine.

## Installing in Claude Code

Add the marketplace once and then install the plugins you want:

```
/plugin marketplace add cmn-community-code/agent-plugins
/plugin install weetwinkel@cmn
```

## Installing in Codex

Add the marketplace once:

```
codex plugin marketplace add cmn-community-code/agent-plugins
```

Then install De WeetWinkel from the Plugins Directory in the ChatGPT desktop app and restart it.

## How the repository is laid out

Claude Code and Codex read different manifest files, so every plugin has one of each:

- `.claude-plugin/marketplace.json` and `plugins/<name>/.claude-plugin/plugin.json` for Claude Code
- `.agents/plugins/marketplace.json` and `plugins/<name>/.codex-plugin/plugin.json` for Codex

Both agents share the plugin's `.mcp.json`. When you change a plugin's name, version or description,
change it in both manifests.

## Developing

Run `devenv shell` in the repository root to get every tool you need, then `just` to see the
available actions. `just install-local` installs the plugins from your checkout into Claude Code,
so you can try a change before it is pushed.
