<template>
  <div
    aria-hidden="true"
    class="snowfall"
    v-if="show"
  >
    <span
      :key="xCoord"
      :style="{
        transform: `scale(${radius})`,
        top: `${yCoord}%`,
        left: `${xCoord}%`,
      }"
      class="snowfall__snowflake"
      v-for="{ radius, xCoord, yCoord } in snowflakes"
    >✽</span>
  </div>
</template>

<script lang="ts" setup>
interface Snowflake {
	radius: number;
	xCoord: number;
	yCoord: number;
}

const DAY_FINISH = 15;
const DAY_START = 24;
const MONTH_FINISH = 0;
const MONTH_START = 11;
const RADIUS_COEFFICIENT = 0.1;
const Y_COORD_COEFFICIENT = 0.7;
const Y_COORD_START = -20;
const DESKTOP_WIDTH = 1260;
const length = 100;

// Data
const show = ref(false);
const frame: Ref<null | number> = ref(null);
const snowflakes: Ref<Snowflake[]> = ref([]);

onMounted(() => {
	const date = dayjs();
	const [
		day,
		month,
	] = [
		date.date(),
		date.month(),
	];
	const isEndOfDecember = month === MONTH_START && day > DAY_START;
	const isBeginOfJanuary = month === MONTH_FINISH && day < DAY_FINISH;

	show.value = isEndOfDecember || isBeginOfJanuary;
	if (!show.value || document.documentElement.clientWidth < DESKTOP_WIDTH) {
		return;
	}

	snowflakes.value = Array.from({ length }, () => ({
		radius: RADIUS_COEFFICIENT + Math.random(),
		xCoord: Math.random() * length,
		yCoord: Y_COORD_START - Math.random() * length,
	}));

	const loop = () => {
		frame.value = requestAnimationFrame(loop);

		snowflakes.value = snowflakes.value.map(({
			radius, xCoord, yCoord,
		}) => {
			yCoord += Y_COORD_COEFFICIENT * radius;
			if (yCoord > window.innerHeight) {
				yCoord = Y_COORD_START;
			}

			return {
				radius,
				xCoord,
				yCoord,
			};
		});
	};

	loop();
});
</script>

<style lang="scss" scoped>
.showfall {
	overflow: hidden;
	font-size: 3vw;
	color: $color-white;
	user-select: none;
}

.snowfall__flake {
	position: absolute;
}
</style>
