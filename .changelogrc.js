module.exports = {
  options: {
    preset: {
      name: 'conventionalcommits',
      types: [
        { type: 'feat', section: '✨ 新功能' },
        { type: 'fix', section: '🐛 问题修复' },
        { type: 'perf', section: '⚡ 性能优化' },
        { type: 'revert', section: '⏪ 回退' },
        { type: 'docs', section: '📝 文档' },
        { type: 'style', section: '💄 样式' },
        { type: 'refactor', section: '♻️ 代码重构' },
        { type: 'test', section: '✅ 测试' },
        { type: 'build', section: '👷 构建' },
        { type: 'ci', section: '🔧 CI配置' },
        { type: 'chore', section: '🎫 其他更新' }
      ]
    },
    // outputUnreleased: false,
  }
};
