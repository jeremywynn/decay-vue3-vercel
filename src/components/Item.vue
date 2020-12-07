<template>
  <transition name="fade">
    <div class="item" v-bind:class="{ decayed: decayed, imminent: imminent }">
      <div class="item__aside">
        <ItemImage :key="item._id" :item="item" />
      </div>
      <div class="item__main">
        <div class="item-title-area">
          <div class="item-title leading-tight">{{ item.name }}</div>
          <aside>
            <button class="button--item">...</button>
          </aside>
        </div>
        <!-- <div class="collapsible-content">
          <div class="item-menu">
            <div class="area area--name">
              <p>Change Item Name</p>
              <div class="form-field">
                <input type="text" v-model="itemName" />
                <button type="button" v-on:click="updateName">Update Item Name</button>
              </div>
            </div>

            <div class="area area--image" v-if="item.data.imageId">
              <p>Remove Item Image</p>
              <div class="form-field">
                <button type="button" v-on:click="removeImage">Remove Image</button>
              </div>
            </div>

            <div class="area area--start-time">
              <p>Start Time Area</p>
              <p>{{ friendlyStartTime }}</p>
              <flat-pickr
                v-model="newStartDate"
                :config="config"
                class="form-control"
                placeholder="Update Start Time"
                name="newStartDate"
              ></flat-pickr>
              <button type="button" v-on:click="updateStartTime">Update Start Time</button>
            </div>

            <div class="area area--end-time">
              <p>End Time Calendar Area</p>
              <p>{{ friendlyEndTime }}</p>
              <flat-pickr
                ref="endTimePickrSingle"
                v-model="endDate"
                :config="config"
                class="form-control"
                placeholder="Update End Time"
                name="endDate"
              ></flat-pickr>
              <button type="button" v-on:click="updateEndTime">Update End Time</button>
            </div>

            <div class="area area--end-time">
              <p>End Time Selector Area</p>
              <form action>
                <fieldset>
                  <div class="form-field">
                    <label for="selector-years">Years</label>
                    <input type="number" id="selector-years" min="0" v-model="endRelatively.years" />
                  </div>
                  <div class="form-field">
                    <label for="selector-months">Months</label>
                    <input type="number" id="selector-months" min="0" v-model="endRelatively.months" />
                  </div>
                  <div class="form-field">
                    <label for="selector-weeks">Weeks</label>
                    <input type="number" id="selector-weeks" min="0" v-model="endRelatively.weeks" />
                  </div>
                  <div class="form-field">
                    <label for="selector-days">Days</label>
                    <input type="number" id="selector-days" min="0" v-model="endRelatively.days" />
                  </div>
                  <div class="form-field">
                    <label for="selector-hours">Hours</label>
                    <input type="number" id="selector-hours" min="0" v-model="endRelatively.hours" />
                  </div>
                  <div class="form-field">
                    <label for="selector-minutes">Minutes</label>
                    <input
                      type="number"
                      id="selector-minutes"
                      min="0"
                      v-model="endRelatively.minutes"
                    />
                  </div>
                  <button
                    type="button"
                    v-on:click="updateEndTimeRelatively"
                  >Update End Time Relatively</button>
                </fieldset>
              </form>
            </div>

            <div class="area area--remove">
              <button type="button" class="remove-item" v-on:click="removeItem">Remove Item</button>
            </div>
          </div>
        </div> -->
        <div class="timer">
          <div class="timer__bar">
            <div ref="timerBar" class="measure unset" :style="timeBar"></div>
          </div>
          <div class="timer__remainder">{{ timeRemainder }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue"
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
import flatPickr from 'vue-flatpickr-component'
import ItemImage from '/src/components/ItemImage.vue'
import 'flatpickr/dist/flatpickr.css'
export default {
  name: 'Item',
  components: {
    flatPickr,
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
    const decayed = ref(false)
    const endRelatively = reactive({
      years: null,
      months: null,
      weeks: null,
      days: null,
      hours: null,
      minutes: null
    })
    const imminent = ref(false)
    const timerBar = ref(null)
    const timeBar = computed(() => {
      const timeElapsed = currentTime.value - props.item.startTime
      const lifespan = props.item.endTime - props.item.startTime
      const timeLeft = lifespan - timeElapsed
      if (timeLeft < 0) {
        return 'transform: translateX(-100%)'
      } else {
        if (timeElapsed / lifespan >= 0.85) {
          imminent.value = true;
        }
        const percentLeft = '-' + (timeElapsed / lifespan) * 100 + '%'
        const percentLeftCSS = 'transform: translateX(' + percentLeft + ')'
        return percentLeftCSS
      }
    })
    const timeRemainder = computed(() => {
      const timeElapsed = currentTime.value - props.item.startTime
      const lifespan = props.item.endTime - props.item.startTime
      if (timeElapsed > lifespan) {
        decayed.value = true
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
    return { decayed, endRelatively, imminent, timeBar, timerBar, timeRemainder }
  }
}
</script>

<style lang="postcss">
.item {
  border-top: 1px solid #f8feff;
  color: #f8feff;
  display: grid;
  font-family: 'FF DIN Pro Medium';
  grid-column-gap: 1rem;
  grid-template-columns: 20% auto;
  padding: 1rem;
  /* @media only all and (min-width: 20em) {
    grid-template-columns: 100px auto;
  }
  &:first-child {
    border-top: 0;
  } */
}
.item:first-child {
  border-top: 0;
}

.item__aside {
  width: 100%;
  /* & img {
    display: block;
    max-width: 100px;
  } */
}
.item__aside img {
  display: block;
  max-width: 100px;
}

.item__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item-title-area {
  display: grid;
  grid-column-gap: 2rem;
  grid-template-columns: 1fr auto;
}
.timer {
  margin-top: 1rem;
  position: relative;
}
.timer__bar {
  background-color: #5ea4dc;
  overflow: hidden;
  position: relative;
  width: 100%;
  /* & .measure {
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
  } */
}
.timer__bar .measure {
  background-color: #f8feff;
  clip-path: polygon(0% 0%, calc(100% - 1rem) 0%, 100% 100%, 0 100%);
  height: 1rem;
  transform-origin: left;
  position: relative;
  transition: transform 400ms;
  width: 100%;
}
.timer__bar .measure .unset {
  transform: translateX(0) !important;
}

.timer__remainder {
  color: #020912;
  font-family: 'CarbonPlus';
  line-height: 1.2;
  position: absolute;
  right: 0;
  top: 0%;
  white-space: nowrap;
  z-index: 2;
}
.decayed .timer__bar {
  background-color: transparent;
  outline: 1px solid #5ea4dc;
}
.decayed .timer__remainder {
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff;
}
.imminent .timer__remainder {
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