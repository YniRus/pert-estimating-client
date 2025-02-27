<template>
    <div
        class="estimate-item d-flex align-center pa-2 rounded"
        :class="{
            'target': isTarget,
            'can-be-target': isCanBeTarget,
        }"
        @click="isCanBeTarget && emit('select')"
    >
        <template v-if="estimate">
            <v-icon
                v-if="isHidden ?? isHiddenEstimate(estimate)"
                icon="mdi-eye-off-outline"
                class="text-grey"
            />

            <v-icon
                v-else-if="isNonValueUnitEstimate(estimate)"
                :icon="getNonValueUnitEstimateIcon(estimate)"
                :size="getNonValueUnitEstimateIconSize(estimate)"
            />

            <template v-else-if="isValueUnitEstimate(estimate)">
                <div
                    class="value-unit-estimate-item"
                    :class="{ 'cursor-pointer': !isHidden && isCanCopy }"
                    @click="copyToClipboard"
                >
                    <span class="mr-1">
                        {{ Number(estimate.value.toFixed(1)) }}
                    </span>

                    <EstimateUnit :unit="estimate.unit" />

                    <v-tooltip
                        v-if="!isHidden && isCanCopy"
                        activator="parent"
                        location="top"
                        :text="copyToClipboardTooltipText"
                    />
                </div>
            </template>
        </template>

        <div
            v-else-if="closestEstimate"
            class="closest-estimate"
        >
            <span class="mr-1">
                {{ closestEstimate.value }}
            </span>

            <EstimateUnit :unit="closestEstimate.unit" />
        </div>

        <span
            v-else
            class="empty-estimate"
        >—</span>
    </div>
</template>

<script setup lang="ts">
import { type Estimate, NonValueUnitEstimate, type ValueUnitEstimate } from '@/definitions/estimates'
import EstimateUnit from '@/components/estimate/EstimateUnit.vue'
import {
    getNonValueUnitEstimateIcon,
    isHiddenEstimate,
    isNonValueUnitEstimate,
    isValueUnitEstimate,
} from '@/utils/estimate'
import { computed, ref } from 'vue'

const props = defineProps<{
    estimate?: Estimate
    closestEstimate?: ValueUnitEstimate | false
    isCanBeTarget?: boolean
    isTarget?: boolean
    isHidden?: boolean
    isCanCopy?: boolean
}>()

const emit = defineEmits<{
    select: []
}>()

function getNonValueUnitEstimateIconSize(estimate: NonValueUnitEstimate) {
    switch (estimate) {
        case NonValueUnitEstimate.Chill: return 'small'
        case NonValueUnitEstimate.IDontKnow: return 'x-small'
    }
}

const isCopied = ref(false)

const copyToClipboardTooltipText = computed(() => {
    if (!props.isCanCopy || props.isHidden) return ''

    if (isCopied.value) return 'Скопировано!'

    return 'Скопировать'
})

async function copyToClipboard() {
    if (!props.isCanCopy || props.isHidden) return
    if (isCopied.value) return
    if (!isValueUnitEstimate(props.estimate)) return

    const text = `${props.estimate.value}${props.estimate.unit}`
    await window.navigator.clipboard.writeText(text)

    isCopied.value = true
    setTimeout(() => isCopied.value = false, 3000)
}
</script>

<style scoped lang="scss">
.estimate-item {
    $bg-color: rgb(15 15 15);

    height: 36px;
    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: background-color, box-shadow;

    .closest-estimate {
        opacity: 0.2;
        filter: grayscale(100%);
    }

    .empty-estimate {
        opacity: 0.2;
    }

    &.can-be-target {
        cursor: pointer;

        &:hover {
            background-color: rgb(var(--v-theme-primary), 0.1);
            box-shadow: 0 0 2px 0 rgb($bg-color, 0.1) inset;
        }
    }

    &.target,
    &.target:hover {
        background-color: rgb(var(--v-theme-primary), 0.2);
        box-shadow: 0 0 4px 0 rgb($bg-color, 0.2) inset;
    }

    &.can-be-target:active,
    &.target:active {
        background-color: rgb(var(--v-theme-primary), 0.3);
        box-shadow: 0 0 6px 0 rgb($bg-color, 0.3) inset;
    }
}
</style>
