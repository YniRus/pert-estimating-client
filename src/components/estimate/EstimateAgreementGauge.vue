<template>
    <span class="agreement-gauge" aria-hidden="true">
        <span
            class="agreement-gauge__scale"
            :style="{ background: percentage === null ? emptyAgreementColor : agreementGradient }"
        />
        <svg class="agreement-gauge__needle" viewBox="0 0 100 62">
            <line
                v-if="percentage !== null"
                :transform="`rotate(${percentage * 1.8 - 180} 50 50)`"
                x1="50"
                y1="50"
                x2="73"
                y2="50"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
            />
        </svg>
    </span>
</template>

<script setup lang="ts">
import { agreementGradient, emptyAgreementColor } from '@/utils/estimate-agreement-presentation'

defineProps<{ percentage: number | null }>()
</script>

<style scoped lang="scss">
.agreement-gauge {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 20px;

    &__scale {
        position: absolute;
        inset: 0 0 auto;

        height: 16px;

        border-radius: 16px 16px 0 0;

        mask-image: radial-gradient(circle at 50% 100%, transparent 10px, #000 10.5px);
    }

    &__needle {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
