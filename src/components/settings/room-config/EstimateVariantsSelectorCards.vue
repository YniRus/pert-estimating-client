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
            <div
                v-for="(variant, index) in variants"
                :key="index"
                class="pa-3 variant-preview-card bg-grey-lighten-3 text-caption d-flex align-center justify-center rounded"
            >
                <v-icon
                    v-if="isNonValueUnitEstimate(variant)"
                    :icon="getNonValueUnitEstimateIcon(variant)"
                    :size="getNonValueUnitEstimateIconSize(variant)"
                />

                <span v-else>{{ variant }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, useTemplateRef, nextTick } from 'vue'
import { isNonValueUnitEstimate } from '@/utils/estimate/guards'
import { getNonValueUnitEstimateIcon } from '@/utils/estimate/ui'
import { type EstimateVariant, NonValueUnitEstimate } from '@/definitions/estimates'

const { variants } = defineProps<{
    variants: EstimateVariant[]
}>()

function getNonValueUnitEstimateIconSize(estimate: NonValueUnitEstimate) {
    switch (estimate) {
        case NonValueUnitEstimate.Chill: return 'small'
        case NonValueUnitEstimate.IDontKnow: return 'x-small'
    }
}

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

.variant-preview-card {
    width: 32px;
    height: 32px;
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
