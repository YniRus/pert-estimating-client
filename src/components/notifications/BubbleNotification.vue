<template>
    <div
        class="bubble-notification text-caption text-truncate px-3 py-2 rounded-xl elevation-2 bg-grey-darken-3 text-white"
        :style="{ left: `${positionX}px` }"
        @animationend="emit('animation-complete')"
    >
        {{ text }}
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { randomNumber } from '@/utils/utils'

export interface BubbleNotificationProps {
    text: string
}

const { text } = defineProps<BubbleNotificationProps>()

const emit = defineEmits<{
    'animation-complete': []
}>()

const positionX = ref(getWindowMiddle())

function getWindowMiddle() {
    return window.innerWidth / 2
}

onMounted(() => {
    positionX.value = getWindowMiddle() + Math.floor(randomNumber(-100, 100))
})
</script>

<style scoped lang="scss">
.bubble-notification {
    pointer-events: none;

    position: fixed;
    z-index: 9999;
    bottom: 0;

    max-width: 240px;

    font-weight: 400;

    transition-property: opacity, transform;
    animation: bubble-float 1.5s ease-out forwards;
}

@keyframes bubble-float {
    0% {
        transform: translateY(100%);
        opacity: 1;
    }

    100% {
        transform: translateY(-120px);
        opacity: 0;
    }
}
</style>
