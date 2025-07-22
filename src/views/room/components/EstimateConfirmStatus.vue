<template>
    <span
        class="confirm-estimates-status"
        :class="{
            'unconfirmed': !userEstimates.confirmed && !isEmpty,
            'confirmed': userEstimates.confirmed
        }"
    />
</template>

<script setup lang="ts">
import { type UserEstimates } from '@/definitions/estimates'
import { isEmptyEstimates } from '@/utils/estimate/guards'
import { computed } from 'vue'

const props = defineProps<{
    userEstimates: UserEstimates
}>()

const isEmpty = computed(() => isEmptyEstimates(props.userEstimates.estimates))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;

.confirm-estimates-status {
    $status-width: 4px;
    $status-unconfirmed-height: 10px;
    $status-confirmed-height: calc($status-unconfirmed-height * 2);

    position: absolute;
    top: 50%;
    left: calc(-1 * map.get(v-settings.$spacers, 4));
    transform: translateY(-50%) translateX(-50%);

    width: $status-width;
    height: 0;

    opacity: 0.7;
    background-color: transparent;
    border-radius: 0 $status-width $status-width 0;

    transition: height 0.3s ease, transform 0.3s ease, background-color 0.3s ease;

    &.unconfirmed {
        transform: translateY(-50%);
        height: $status-unconfirmed-height;
        background-color: rgb(var(--v-theme-warning));
    }

    &.confirmed {
        transform: translateY(-50%);
        height: $status-confirmed-height;
        background-color: rgb(var(--v-theme-success));
    }
}
</style>
