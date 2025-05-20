import type { IApi } from '@kmijs/kmijs';

export default (api: IApi) => {
  api.describe({
    key: '@kmijs/{{{ name }}}:alias',
  });

  api.modifyConfig((memo) => {
    memo.alias['@kmijs/{{{ name }}}'] = '@@/exports';
    memo.alias['umi'] = '@@/exports';
    return memo;
  });

  api.modifyAppData((memo) => {
    memo.kmi.importSource = '@kmijs/{{{ name }}}';
    memo.kmi.name = '@kmijs/{{{ name }}}'
    return memo;
  });
};
