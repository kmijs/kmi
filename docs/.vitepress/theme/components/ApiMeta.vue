<template>
  <div :class="wrapperStyle">
    <span v-if="addedVersion" :class="[tagStyle]" class="added">
      <a :href="toChangelog(addedVersion)" target="_blank" rel="noreferrer">
        Added in v{{ addedVersion }}
      </a>
    </span>

    <span v-if="deprecatedVersion" :class="[tagStyle, 'deprecated']">
      <a :href="toChangelog(deprecatedVersion)"
        >Deprecated in v{{ deprecatedVersion }}</a
      >
    </span>

    <span v-if="removedVersion" :class="[tagStyle, 'removed']">
      <a :href="toChangelog(removedVersion)"
        >Removed in v{{ removedVersion }}</a
      >
    </span>

    <div v-if="stability" :class="[tagStyle, stability.toLowerCase()]">
      Stability: {{ stability }}
    </div>

    <span
      v-if="specific && specific.length > 0"
      :class="[tagStyle, 'specific']"
    >
      {{ specific.join('/') }}&nbsp;
      {{ specific.length > 1 ? 'specific' : 'only' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 枚举定义
enum Stability {
  Deprecated = 'Deprecated',
  Removed = 'Removed',
  Experimental = 'Experimental',
}

// Props 定义
interface Props {
  addedVersion?: string
  deprecatedVersion?: string
  removedVersion?: string
  stability?: Stability
  inline?: boolean
  specific?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
})

const tagStyle = computed(() => (props.inline ? 'tagInline' : 'tag'))
const wrapperStyle = computed(() =>
  props.inline ? 'wrapperInline' : 'wrapper',
)

const toChangelog = (version: string) => {
  return `/changelog/#${version.replace('v', '')}`
}
</script>

<style lang="less" scoped>
.wrapperInline {
  display: inline;
}

:global(h2) + .wrapper {
  margin-top: 0px;
}

.wrapper a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.wrapperInline a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.tagInline {
  display: inline-flex;
  color: #1c1c1c;
  margin-right: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  line-height: 18px;
}

.tag {
  display: inline-flex;
  color: #1c1c1c;
  margin-right: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  line-height: 18px;
}

.added {
  background-color: hsl(162deg 60% 75%);
}

.deprecated {
  background-color: hsl(36deg 100% 82%);
}

.removed {
  background-color: hsl(0deg 100% 90%);
}

.experimental {
  background-color: hsl(262deg 100% 90%);
}

.specific {
  background-color: hsl(262deg, 10%, 90%);
}
</style>
