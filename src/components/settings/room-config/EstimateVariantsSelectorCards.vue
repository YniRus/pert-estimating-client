<template>
    <div class="overflow-hidden w-100">
        <div
            ref="scroll-container"
            class="d-flex ga-1"
            :class="{ 'with-scroll-animation': hasOverflow }"
            :style="hasOverflow && {
                '--scroll-distance': `${scrollDistance}px`
            }"
        >
            <EstimateVariantsSelectorCard
                v-for="(variant, index) in variants"
                :key="index"
                :variant="variant"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, useTemplateRef, nextTick } from 'vue'
import { type EstimateVariant } from '@/definitions/estimates'
import EstimateVariantsSelectorCard from '@/components/settings/room-config/EstimateVariantsSelectorCard.vue'

const { variants } = defineProps<{
    variants: EstimateVariant[]
}>()

const scrollContainer = useTemplateRef('scroll-container')
const hasOverflow = ref(false)
const scrollDistance = ref(0)

const checkOverflow = () => {
    if (!scrollContainer.value) return

    const container = scrollContainer.value

    scrollDistance.value = container.scrollWidth - container.clientWidth
    hasOverflow.value = scrollDistance.value > 0
}

watch(() => variants, async () => {
    await nextTick()
    checkOverflow()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.with-scroll-animation {
    animation: scroll-horizontal 10s linear infinite;
}

@keyframes scroll-horizontal {
    0%,
    10% {
        transform: translateX(0);
    }

    50%,
    60% {
        transform: translateX(calc(var(--scroll-distance) * -1));
    }

    100% {
        transform: translateX(0);
    }
}
</style>
