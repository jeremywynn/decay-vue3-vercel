<template>
  <transition name="fade">
    <div class="ditem">
      <div class="ditem__aside">
        <ItemImage :key="item._id" :item="item" />
      </div>
      <div class="ditem__main">
        <div class="ditem-title-area">
          <div class="ditem-title">
            <div>{{ item.name }}</div>
          </div>
          <aside>
            <button class="button--item">...</button>
          </aside>
        </div>
        <div class="dtimer">
          <div class="dtimer__bar">
            <div ref="timerBar" class="measure unset" :style="timeBar"></div>
          </div>
          <div class="dtimer__remainder">{{ timeRemainder }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, onMounted, ref } from "vue"
import {
  formatDistanceToNow,
  getTime,
  addYears,
  addMonths,
  addWeeks,
  addDays,
  addHours,
  addMinutes,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfMinute,
  subYears,
  subMonths,
  subWeeks,
  subDays,
  subHours,
  subMinutes,
} from 'date-fns'
import ItemImage from '/src/components/ItemImage.vue'
export default {
  name: 'Item',
  components: {
    ItemImage
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const currentTime = ref(null)
    currentTime.value = getTime(new Date())
    const timerBar = ref(null)
    const timeBar = computed(() => {
      const timeElapsed = currentTime.value - props.item.startTime
      const lifespan = props.item.endTime - props.item.startTime
      const timeLeft = lifespan - timeElapsed
      if (timeLeft < 0) {
        return 'transform: translateX(-100%)'
      } else {
        const percentLeft = '-' + (timeElapsed / lifespan) * 100 + '%'
        const percentLeftCSS = 'transform: translateX(' + percentLeft + ')'
        return percentLeftCSS
      }
    })
    const timeRemainder = computed(() => {
      const timeElapsed = currentTime.value - props.item.startTime
      const lifespan = props.item.endTime - props.item.startTime
      if (timeElapsed > lifespan) {
        return 'Decayed'
      } else {
        const timeRemaining = lifespan - timeElapsed + currentTime.value
        const timeReported = formatDistanceToNow(timeRemaining)
        return timeReported
      }
    })
    onMounted(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            entry.target.classList.remove('unset')
            io.unobserve(entry.target)
          }
        })
      },
      {
        // The root to use for intersection.
        // If not provided, use the top-level document’s viewport.
        root: null,
        // Same as margin, can be 1, 2, 3 or 4 components, possibly negative lengths.
        // If an explicit root element is specified, components may be percentages of the
        // root element size.  If no explicit root element is specified, using a percentage
        // is an error.
        rootMargin: "0px",
        // Threshold(s) at which to trigger callback, specified as a ratio, or list of
        // ratios, of (visible area / total area) of the observed element (hence all
        // entries must be in the range [0, 1]).  Callback will be invoked when the visible
        // ratio of the observed element crosses a threshold in the list.
        threshold: [0],
      })
      io.observe(timerBar.value)
    })
    return { timeBar, timerBar, timeRemainder }
  }
}
</script>

<style lang="postcss">
.ditem {
  border-top: 1px solid #f8feff;
  color: #f8feff;
  display: grid;
  font-family: 'FF DIN Pro Medium';
  grid-column-gap: 1rem;
  grid-template-columns: 20% auto;
  padding: 1rem;
  @media only all and (min-width: 20em) {
    grid-template-columns: 100px auto;
  }
  &:first-child {
    border-top: 0;
  }
}
.ditem__aside {
  width: 100%;
  & img {
    display: block;
    max-width: 100px;
  }
}
.ditem__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.ditem-title-area {
  display: grid;
  grid-column-gap: 2rem;
  grid-template-columns: 1fr auto;
}
.dtimer {
  margin-top: 1rem;
  position: relative;
}
.dtimer__bar {
  background-color: #5ea4dc;
  overflow: hidden;
  position: relative;
  width: 100%;
  & .measure {
    background-color: #f8feff;
    clip-path: polygon(0% 0%, calc(100% - 1rem) 0%, 100% 100%, 0 100%);
    height: 1rem;
    transform-origin: left;
    position: relative;
    transition: transform 400ms;
    width: 100%;
    &.unset {
      transform: translateX(0) !important;
    }
  }
}

.dtimer__remainder {
  color: #020912;
  font-family: 'CarbonPlus';
  line-height: 1.2;
  position: absolute;
  right: 0;
  top: 0%;
  white-space: nowrap;
  z-index: 2;
}
.decayed .dtimer__bar {
  background-color: transparent;
  outline: 1px solid #5ea4dc;
}
.decayed .dtimer__remainder {
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff;
}
.imminent .dtimer__remainder {
  animation: 5000ms imminent linear infinite;
}
/*
.decayed {
  & .dtimer__bar {
    background-color: transparent;
    outline: 1px solid #5ea4dc;
  }
  & .dtimer__remainder
    color: #fff;
    text-shadow: 0 0 5px #fff, 0 0 10px #fff;
  }
}

.imminent {
  & .dtimer__remainder {
    animation: 5000ms imminent linear infinite;
  }
}
*/

@keyframes imminent {
  15% {
    color: #fff;
  }
  25% {
    color: #fff;
    text-shadow: 0 0 5px #fff;
  }
  35% {
    color: #fff;
  }
  50% {
    color: #020912;
    text-shadow: none;
  }
}

.area {
  border-top: 1px solid;
  border-top: 1px solid;
  padding: 0.75rem 0;
}

.button--item {
  background-color: transparent;
  border: 1px solid #5ea4dc;
  color: #f8feff;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
  width: 4ch;
}
input {
  color: black;
}
</style>