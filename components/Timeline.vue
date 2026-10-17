<!--
  A horizontal timeline with pictures, events evenly spaced (not to scale),
  alternately above and below the axis: on one side of the axis the year, on
  the other side the short label and then the card (pictures, names, what).
  Usage in a slide:

    ---
    timeline:
      - year: 1965
        short: Unification
        what: the resolution principle
        people:
          - { name: J. Alan Robinson, img: /history/robinson.jpg }
      - year: 1977
        what: the first Prolog compiler
        people:
          - { name: David H. D. Warren }     # no img: a circle with the initials
    ---

    <Timeline :items="$frontmatter.timeline" />

  `logo: true` on a person shows the picture uncropped (e.g. a logo).
-->

<script setup lang="ts">
interface Person { name: string, img?: string, logo?: boolean }
interface Item { year: number | string, short?: string, what: string, people: Person[] }

defineProps<{ items: Item[] }>()

// paths of public/ files, with the base of the build (e.g. make html.local)
const src = (path: string) =>
  path.startsWith('/') ? import.meta.env.BASE_URL + path.slice(1) : path

// first and last initials: David H. D. Warren -> DW
const initials = (name: string) => {
  const words = name.split(/\s+/).filter(w => /^\p{Lu}/u.test(w))
  return words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? '?')[0]
}
</script>

<template>
  <div class="tl" :style="{ '--tl-n': items.length }">
    <div class="tl-axis" />
    <div
      v-for="(item, i) in items"
      :key="i"
      class="tl-item"
      :class="i % 2 === 0 ? 'tl-up' : 'tl-down'"
    >
      <div class="tl-card">
        <div class="tl-faces">
          <template v-for="p in item.people" :key="p.name">
            <img v-if="p.img" :src="src(p.img)" :alt="p.name" :class="p.logo ? 'tl-logo' : 'tl-face'">
            <div v-else class="tl-face tl-initials" :title="p.name">
              {{ initials(p.name) }}
            </div>
          </template>
        </div>
        <div class="tl-who">
          {{ item.people.map(p => p.name).join(' & ') }}
        </div>
        <div class="tl-what">
          {{ item.what }}
        </div>
      </div>
      <div class="tl-dot" />
      <div class="tl-year">
        {{ item.year }}
      </div>
      <div v-if="item.short" class="tl-short">
        {{ item.short }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.tl {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--tl-n), 1fr);
  height: 25rem;
  margin-top: 1rem;
}
.tl-axis {
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 3px;
  background: var(--lw-yellow, #fc0);
}
.tl-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.tl-dot {
  position: absolute;
  top: 50%;
  width: .9rem; height: .9rem;
  margin-top: calc(-.45rem + 1.5px);
  border-radius: 50%;
  background: var(--lw-yellow, #fc0);
  box-shadow: 0 0 0 4px var(--lw-bg, #000);
}
.tl-year {
  position: absolute;
  top: calc(50% + .9rem);
  font-family: var(--lw-display, sans-serif);
  font-style: italic;
  font-size: 1.3rem;
  color: var(--lw-yellow, #fc0);
}
.tl-down .tl-year { top: auto; bottom: calc(50% + .9rem); }
.tl-card {
  position: absolute;
  width: 115%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
}
/* next to the dot: the year on one side, the short label on the other */
.tl-short {
  position: absolute;
  bottom: calc(50% + .8rem);
  font-weight: 700;
  font-size: 1.35rem;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--lw-fg, #fff);
  text-shadow: 0 0 4px var(--lw-bg, #000), 0 0 2px var(--lw-bg, #000);
}
.tl-down .tl-short { bottom: auto; top: calc(50% + .8rem); }
/* the cards leave a band around the axis to the years and short labels */
.tl-up .tl-card { bottom: calc(50% + 3.1rem); }
.tl-down .tl-card { top: calc(50% + 3.1rem); }
.tl-faces { display: flex; gap: .3rem; }
.tl-face {
  width: 4.4rem; height: 4.4rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--lw-yellow, #fc0);
}
.tl-logo {
  height: 4.4rem; width: auto;
  background: #fff;
  border-radius: 6px;
  padding: 2px;
}
.tl-initials {
  display: flex; align-items: center; justify-content: center;
  background: var(--lw-hover, #222);
  color: var(--lw-fg, #fff);
  font-weight: 600;
}
.tl-who, .tl-what { text-shadow: 0 0 4px var(--lw-bg, #000), 0 0 2px var(--lw-bg, #000); }
.tl-who { font-size: .8rem; font-weight: 600; line-height: 1.15; color: var(--lw-fg, #fff); }
.tl-what { font-size: .7rem; line-height: 1.2; color: var(--lw-fg-muted, #ddd); }
</style>
