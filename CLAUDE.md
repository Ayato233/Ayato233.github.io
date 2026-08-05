# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

If the project has no test infrastructure and the task is exploratory, state success criteria in plain language instead (e.g., "verify: running curl /api/users returns 200 with expected JSON").

### 5. Security Baseline

**Never commit keys or sensitive credentials to the repository.**

- All API keys, tokens, passwords, private keys, database connection strings, and similar secrets **must** be managed via environment variables or `.env` files.
- Ensure `.env` is added to `.gitignore`.
- **If any sensitive information needs to be included in the code to function, you must ask me first before committing. Do not decide on your own.**
- If you discover sensitive data that has already been committed, immediately alert me so I can rotate the key and clean up the Git history.

## 6. 优先使用主题文档提供的方法

本项目基于 Mizuki 主题（Astro），进行任何功能优化或修改时：

1. **先阅读主题文档**，确认是否有官方支持的方法来实现需求：
   - 本地：`README.zh.md`（主文档）、`src/config/` 下各配置文件的注释说明
   - 在线：https://docs.mizuki.mysqil.com/
   - 相关脚本：`scripts/`（update-bilibili.mjs、new-post.js 等）
2. **优先采用文档中提供的方式**，不要自行发明替代方案或改主题源码。
3. 文档没有对应方法时，再提出其他方案供用户选择，说明原因和权衡。
4. 改配置不成就改源码，改源码需谨慎并说明理由。

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.